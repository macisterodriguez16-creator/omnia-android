const OMNIA_API_BACKEND = "https://omnia-api.macisterodriguez16.workers.dev";

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".admin-section");
const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const adminApp = document.body;

const sectionTitles = {
    dashboard: "Dashboard",
    products: "Productos",
    orders: "Pedidos",
    customers: "Clientes",
    inventory: "Inventario",
    payments: "Pagos",
    channels: "Publicación / Canales",
    integrations: "Integraciones",
    settings: "Configuración"
};

const channels = [
    { id: "omnia", name: "OMNIA Marketplace" },
    { id: "shopify", name: "Shopify" },
    { id: "amazon", name: "Amazon" },
    { id: "bonanza", name: "Bonanza" }
];

let adminSecret = "";

function getAdminHeaders(includeJson = false) {
    const headers = {};

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    if (adminSecret) {
        headers["Authorization"] = `Bearer ${adminSecret}`;
        headers["X-Admin-Secret"] = adminSecret;
    }

    return headers;
}

function requestAdminSecret() {
    if (adminSecret) {
        return true;
    }

    const secret = window.prompt(
        "OMNIA CONTROL CENTER\n\nIntroduce tu ADMIN_SECRET para continuar:"
    );

    if (!secret || !secret.trim()) {
        return false;
    }

    adminSecret = secret.trim();
    sessionStorage.setItem("omnia_admin_secret", adminSecret);

    return true;
}

function clearAdminSecret() {
    adminSecret = "";
    sessionStorage.removeItem("omnia_admin_secret");
}

async function adminFetch(url, options = {}) {
    if (!requestAdminSecret()) {
        throw new Error("Autenticación de administrador cancelada.");
    }

    const headers = {
        ...(options.headers || {}),
        ...getAdminHeaders(false)
    };

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        clearAdminSecret();

        const retry = window.confirm(
            `La petición ${url} devolvió HTTP ${response.status}.\n\n¿Quieres introducir nuevamente el ADMIN_SECRET?`
        );

        if (retry) {
            return adminFetch(url, options);
        }

        throw new Error("No autorizado.");
    }

    return response;
}

function showSection(sectionName) {
    navItems.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.section === sectionName
        );
    });

    sections.forEach(section => {
        section.classList.toggle(
            "active",
            section.id === `section-${sectionName}`
        );
    });

    if (pageTitle) {
        pageTitle.textContent =
            sectionTitles[sectionName] || "Control Center";
    }

    if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove("open");
    }

    if (sectionName === "products") {
        loadAdminProducts();
    }

    if (sectionName === "dashboard") {
        loadDashboardStats();
    }
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        showSection(item.dataset.section);
    });
});

document.querySelectorAll("[data-section-action]").forEach(button => {
    button.addEventListener("click", () => {
        showSection(button.dataset.sectionAction);
    });
});

function updateSidebarToggle() {
    if (!menuToggle || !adminApp) return;
    const collapsed = adminApp.classList.contains("sidebar-collapsed");
    menuToggle.textContent = collapsed ? "☰" : "‹";
    menuToggle.setAttribute("aria-label", collapsed ? "Expandir barra lateral" : "Contraer barra lateral");
    menuToggle.setAttribute("aria-expanded", String(!collapsed));
}

if (window.innerWidth <= 800) {
    adminApp.classList.add("sidebar-collapsed");
}

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        adminApp.classList.toggle("sidebar-collapsed");
        updateSidebarToggle();
    });
    updateSidebarToggle();
}

async function loadDashboardStats() {
    try {
        const response = await fetch(
            `${OMNIA_API_BACKEND}/api/catalog/omnia`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const products =
            data.productos ||
            data.products ||
            data.items ||
            data.catalogo ||
            [];

        const statProducts = document.getElementById("statProducts");

        if (statProducts) {
            statProducts.textContent = products.length;
        }

        const statOrders = document.getElementById("statOrders");
        const statCustomers = document.getElementById("statCustomers");
        const statSales = document.getElementById("statSales");

        if (statOrders) {
            statOrders.textContent = "—";
        }

        if (statCustomers) {
            statCustomers.textContent = "—";
        }

        if (statSales) {
            statSales.textContent = "—";
        }

        renderRecentProducts(products);
    } catch (error) {
        console.error("Error cargando dashboard:", error);

        const statProducts = document.getElementById("statProducts");

        if (statProducts) {
            statProducts.textContent = "0";
        }

        const recent = document.getElementById("recentProducts");

        if (recent) {
            recent.innerHTML = `
                <div class="empty-icon">!</div>
                <h4>No se pudieron cargar los productos</h4>
                <p>Verifica la conexión con OMNIA API.</p>
            `;
        }
    }
}

async function loadAdminProducts() {
    const container = document.querySelector(
        ".admin-products-container"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">▣</div>
            <h4>Cargando productos...</h4>
            <p>Consultando productos de OMNIA.</p>
        </div>
    `;

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const products =
            data.productos ||
            data.products ||
            data.items ||
            data.catalogo ||
            [];

        renderAdminProducts(products);
    } catch (error) {
        console.error("Error cargando productos:", error);

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">!</div>
                <h4>No se pudieron cargar los productos</h4>
                <p>${escapeHtml(error.message)}</p>
                <button
                    class="secondary-button"
                    onclick="loadAdminProducts()"
                >
                    Reintentar
                </button>
            </div>
        `;
    }
}

function renderAdminProducts(products) {
    const container = document.querySelector(
        ".admin-products-container"
    );

    if (!container) {
        return;
    }

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">▣</div>
                <h4>No hay productos</h4>
                <p>Los productos disponibles aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products
        .map(product => {
            const id =
                product.printify_id ||
                product.printifyId ||
                product.id ||
                "";

            const title =
                product.title ||
                product.name ||
                "Producto sin nombre";

            let image =
    product.main_image_url ||
    product.image_url ||
    product.imageUrl ||
    "";

const imageValue = product.image;

if (!image && imageValue) {
    image =
        typeof imageValue === "string"
            ? imageValue
            : imageValue.src ||
              imageValue.url ||
              imageValue.preview_url ||
              imageValue.preview ||
              "";
}

if (!image && Array.isArray(product.images)) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
        image = firstImage;
    } else if (firstImage) {
        image =
            firstImage.src ||
            firstImage.url ||
            firstImage.preview_url ||
            firstImage.preview ||
            "";
    }
}

if (!image && product.payload) {
    const payload =
        typeof product.payload === "string"
            ? (() => {
                try {
                    return JSON.parse(product.payload);
                } catch {
                    return {};
                }
            })()
            : product.payload;

    const images = Array.isArray(payload?.images)
        ? payload.images
        : [];

    const selectedImage =
        images.find(img =>
            img &&
            typeof img === "object" &&
            img.is_default === true &&
            (img.src || img.url)
        ) || images[0];

    if (typeof selectedImage === "string") {
        image = selectedImage;
    } else if (selectedImage) {
        image =
            selectedImage.src ||
            selectedImage.url ||
            selectedImage.preview_url ||
            selectedImage.preview ||
            "";
    }
}

              const price =
                product.price ??
                product.sale_price ??
                product.salePrice ??
                "";

            const status =
                product.status ||
                "disponible";

            return `
                <div class="product-admin-card">

                    <div class="product-admin-image">
                        ${
                            image
                                ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">`
                                : `<div class="product-image-placeholder">∞</div>`
                        }
                    </div>

                    <div class="product-admin-info">
                        <h3>${escapeHtml(title)}</h3>

                        <p class="product-admin-id">
                            ID: ${escapeHtml(String(id))}
                        </p>

                        ${
                            price !== ""
                                ? `<p class="product-admin-price">$${escapeHtml(String(price))}</p>`
                                : ""
                        }

                        <span class="product-admin-status">
                            ${escapeHtml(String(status))}
                        </span>
                    </div>
                    
<div class="product-admin-actions">
    <button
        class="primary-button"
        onclick="openProductChannels('${encodeURIComponent(String(id))}')"
    >
        Gestionar publicación
    </button>

    <button
        class="secondary-button remove-background-button"
        data-product-id="${escapeHtml(String(id))}"
        data-image-url="${escapeHtml(image)}"
    >
        Eliminar fondo
    </button>
    <button
        class="secondary-button product-mockup-button"
        onclick="openProductMockup('${encodeURIComponent(String(id))}')"
    >
        Elegir maqueta
    </button>
</div>
                </div>
            `;
        })
        .join("");
}

async function removeProductBackground(button) {
    const productId = button.dataset.productId;
    const imageUrl = button.dataset.imageUrl;

    if (!productId || !imageUrl) {
        alert("No se encontró la imagen original del producto.");
        return;
    }

    if (!requestAdminSecret()) {
        return;
    }

    const confirmed = window.confirm(
        "¿Eliminar el fondo de esta imagen?\n\n" +
        "La imagen original de Printify se conservará."
    );

    if (!confirmed) {
        return;
    }

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Procesando imagen...";

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/remove-background`,
            {
                method: "POST",
                headers: getAdminHeaders(true),
                body: JSON.stringify({
                    image_url: imageUrl
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.status !== "success" ||
            !data.processed_image_url) {
            throw new Error(
                data.message || `Error HTTP ${response.status}`
            );
        }

        const card = button.closest(".product-admin-card");
        const image = card?.querySelector(".product-admin-image img");

        if (image) {
            image.src = data.processed_image_url;
        }

        button.textContent = "Fondo eliminado";

        alert(
            "Imagen procesada y guardada en Cloudinary."
        );
    } catch (error) {
        console.error("Error eliminando el fondo:", error);
        alert(`No se pudo procesar la imagen.\n\n${error.message}`);
        button.textContent = originalText;
    } finally {
        button.disabled = false;
    }
}

async function openProductChannels(encodedProductId) {
    const productId = decodeURIComponent(encodedProductId);

    if (!requestAdminSecret()) {
        return;
    }

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        const savedChannels =
            data.channels ||
            data.canales ||
            data.items ||
            [];

        renderProductChannels(productId, savedChannels);
    } catch (error) {
        console.error(
            "Error cargando canales del producto:",
            error
        );

        alert(
            `No se pudieron cargar los canales del producto.\n\n${error.message}`
        );
    }
}

function renderProductChannels(productId, savedChannels) {
    const existingModal = document.getElementById(
        "productChannelsModal"
    );

    if (existingModal) {
        existingModal.remove();
    }

    const savedMap = {};

    if (Array.isArray(savedChannels)) {
        savedChannels.forEach(channel => {
            if (channel && channel.channel) {
                savedMap[channel.channel] = channel;
            }
        });
    }

    const modal = document.createElement("div");

    modal.id = "productChannelsModal";

    modal.className = "admin-modal-overlay";

    modal.innerHTML = `
        <div class="admin-modal">

            <div class="admin-modal-header">
                <div>
                    <span class="section-label">
                        PUBLICACIÓN
                    </span>
                    <h2>Canales del producto</h2>
                    <p>
                        Selecciona dónde quieres publicar este producto.
                    </p>
                </div>

                <button
                    class="admin-modal-close"
                    onclick="closeProductChannels()"
                >
                    ×
                </button>
            </div>

            <div class="admin-modal-body">

                <div class="product-channel-id">
                    Producto:
                    <strong>${escapeHtml(String(productId))}</strong>
                </div>

                <div class="product-channel-list">

                    ${channels
                        .map(channel => {
                            const saved =
                                savedMap[channel.id];

                            const enabled =
                                saved &&
                                Number(saved.enabled) === 1 &&
                                saved.status === "published";

                            return `
                                <label class="product-channel-option">

                                    <input
                                        type="checkbox"
                                        class="product-channel-checkbox"
                                        data-channel="${escapeHtml(channel.id)}"
                                        ${enabled ? "checked" : ""}
                                    >

                                    <span class="channel-option-content">

                                        <span class="channel-option-logo">
                                            ${channel.id === "omnia" ? "∞" : channel.name.charAt(0)}
                                        </span>

                                        <span class="channel-option-info">
                                            <strong>
                                                ${escapeHtml(channel.name)}
                                            </strong>

                                            <small>
                                                ${
                                                    enabled
                                                        ? "Publicado"
                                                        : "No publicado"
                                                }
                                            </small>
                                        </span>

                                    </span>

                                </label>
                            `;
                        })
                        .join("")}

                </div>

            </div>

            <div class="admin-modal-footer">

                <button
                    class="secondary-button"
                    onclick="closeProductChannels()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    onclick="saveProductChannels('${encodeURIComponent(productId)}')"
                >
                    Guardar publicación
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeProductChannels();
        }
    });
}

async function saveProductChannels(encodedProductId) {
    const productId = decodeURIComponent(encodedProductId);

    if (!requestAdminSecret()) {
        return;
    }

    const checkboxes = document.querySelectorAll(
        ".product-channel-checkbox"
    );

    if (!checkboxes.length) {
        return;
    }

    const saveButton = document.querySelector(
        "#productChannelsModal .primary-button"
    );

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Guardando...";
    }

    try {
        for (const checkbox of checkboxes) {
            const channel = checkbox.dataset.channel;

            if (!channel) {
                continue;
            }

            if (checkbox.checked) {
                const response = await adminFetch(
                    `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels`,
                    {
                        method: "POST",
                        headers: getAdminHeaders(true),
                        body: JSON.stringify({
                            channel
                        })
                    }
                );

                if (!response.ok) {
                    const text = await response.text();

                    throw new Error(
                        `No se pudo publicar en ${channel}: HTTP ${response.status} ${text}`
                    );
                }
            } else {
                const response = await adminFetch(
                    `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels/${encodeURIComponent(channel)}`,
                    {
                        method: "DELETE",
                        headers: getAdminHeaders(false)
                    }
                );

                if (!response.ok && response.status !== 404) {
                    const text = await response.text();

                    throw new Error(
                        `No se pudo retirar de ${channel}: HTTP ${response.status} ${text}`
                    );
                }
            }
        }

        closeProductChannels();

        alert(
            "Publicación actualizada correctamente."
        );

        loadAdminProducts();
        loadDashboardStats();
    } catch (error) {
        console.error(
            "Error guardando canales:",
            error
        );

        alert(
            `No se pudieron guardar los cambios.\n\n${error.message}`
        );

        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "Guardar publicación";
        }
    }
}

function closeProductChannels() {
    const modal = document.getElementById(
        "productChannelsModal"
    );

    if (modal) {
        modal.remove();
    }
}


async function openProductMockup(encodedProductId) {
    const productId = decodeURIComponent(encodedProductId);

    if (!requestAdminSecret()) return;

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/mockup`
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || data.message || `HTTP ${response.status}`);
        }

        renderProductMockup(productId, data);
    } catch (error) {
        console.error("Error cargando maquetas:", error);
        alert(`No se pudieron cargar las imágenes del producto.\n\n${error.message}`);
    }
}

function renderProductMockup(productId, data) {
    closeProductMockup();

    const images = Array.isArray(data.images) ? data.images : [];
    const mainImageUrl = data.main_image_url || "";

    const modal = document.createElement("div");
    modal.id = "productMockupModal";
    modal.className = "admin-modal-overlay product-mockup-overlay";

    const cards = images.map((image, index) => {
        const url = typeof image === "string"
            ? image
            : image.src || image.url || image.preview_url || image.preview || "";

        if (!url || !/^https?:\/\//i.test(url)) return "";

        const selected = url === mainImageUrl;
        const safeUrl = escapeHtml(url);

        return `
            <button type="button"
                class="product-mockup-option${selected ? " is-selected" : ""}"
                data-mockup-url="${safeUrl}"
                aria-pressed="${selected ? "true" : "false"}">
                <img src="${safeUrl}" alt="Maqueta ${index + 1}" loading="lazy">
                <span class="product-mockup-option-label">
                    ${selected ? "✓ Imagen principal" : "Elegir como principal"}
                </span>
            </button>
        `;
    }).join("");

    modal.innerHTML = `
        <div class="admin-modal-content product-mockup-dialog" role="dialog"
            aria-modal="true" aria-labelledby="productMockupTitle">
            <div class="admin-modal-header">
                <h2 id="productMockupTitle">Elegir maqueta</h2>
                <button type="button" class="secondary-button"
                    data-mockup-close aria-label="Cerrar">Cerrar</button>
            </div>
            <div class="admin-modal-body">
                <p>Selecciona la imagen que aparecerá primero en OMNIA.</p>
                ${
                    cards
                        ? `<div class="product-mockup-grid">${cards}</div>`
                        : `<p>No se encontraron imágenes válidas para este producto.</p>`
                }
                <p class="product-mockup-message" aria-live="polite"></p>
            </div>
            <div class="admin-modal-footer">
                <button type="button" class="secondary-button"
                    data-mockup-close>Cancelar</button>
                <button type="button" class="primary-button"
                    data-mockup-save ${cards ? "" : "disabled"}>Guardar imagen principal</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll("[data-mockup-close]").forEach(button => {
        button.addEventListener("click", closeProductMockup);
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) closeProductMockup();
    });

    modal.querySelectorAll(".product-mockup-option").forEach(button => {
        button.addEventListener("click", () => {
            modal.querySelectorAll(".product-mockup-option").forEach(option => {
                const isSelected = option === button;
                option.classList.toggle("is-selected", isSelected);
                option.setAttribute("aria-pressed", String(isSelected));
                option.querySelector(".product-mockup-option-label").textContent =
                    isSelected ? "✓ Imagen principal" : "Elegir como principal";
            });

            const message = modal.querySelector(".product-mockup-message");
            if (message) message.textContent = "";
        });
    });

    modal.querySelector("[data-mockup-save]").addEventListener("click", async event => {
        const saveButton = event.currentTarget;
        const selected = modal.querySelector(".product-mockup-option.is-selected");
        const message = modal.querySelector(".product-mockup-message");

        if (!selected) {
            message.textContent = "Selecciona una imagen antes de guardar.";
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Guardando…";

        try {
            const response = await adminFetch(
                `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/mockup`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        main_image_url: selected.dataset.mockupUrl
                    })
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || result.message || `HTTP ${response.status}`);
            }

            closeProductMockup();
            alert("Imagen principal guardada correctamente.");
            await loadAdminProducts();
        } catch (error) {
            console.error("Error guardando la maqueta:", error);
            message.textContent = `No se pudo guardar: ${error.message}`;
            saveButton.disabled = false;
            saveButton.textContent = "Guardar imagen principal";
        }
    });
}

function closeProductMockup() {
    const modal = document.getElementById("productMockupModal");
    if (modal) modal.remove();
}

function renderRecentProducts(products) {
    const container = document.getElementById(
        "recentProducts"
    );

    if (!container) {
        return;
    }

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="empty-icon">▣</div>
            <h4>No hay productos todavía</h4>
            <p>
                Los productos publicados en OMNIA aparecerán aquí.
            </p>
        `;

        return;
    }

    const recentProducts = products.slice(0, 5);

    container.className = "recent-products";

    container.innerHTML = recentProducts
        .map(product => {
            const title =
                product.title ||
                product.name ||
                "Producto sin nombre";

            let image =
                product.main_image_url ||
                product.image_url ||
                product.imageUrl ||
                "";

            const imageValue = product.image;

            if (!image && imageValue) {
                image =
                    typeof imageValue === "string"
                        ? imageValue
                        : imageValue.src ||
                          imageValue.url ||
                          imageValue.preview_url ||
                          imageValue.preview ||
                          "";
            }

            if (!image && Array.isArray(product.images)) {
                const firstImage = product.images[0];

                if (typeof firstImage === "string") {
                    image = firstImage;
                } else if (firstImage) {
                    image =
                        firstImage.src ||
                        firstImage.url ||
                        firstImage.preview_url ||
                        firstImage.preview ||
                        "";
                }
            }

            return `
                <div class="recent-product-row">

                    <div class="recent-product-image">
                        ${
                            image
                                ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">`
                                : "∞"
                        }
                    </div>

                    <div class="recent-product-info">
                        <strong>
                            ${escapeHtml(title)}
                        </strong>
                        <span>
                            Producto OMNIA
                        </span>
                    </div>

                </div>
            `;
        })
        .join("");
}

document.addEventListener("click", event => {
    const button = event.target.closest(
        ".remove-background-button"
    );

    if (button) {
        removeProductBackground(button);
    }
});

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function loadInitialSection() {
    const activeItem = document.querySelector(
        ".nav-item.active"
    );

    if (activeItem) {
        showSection(activeItem.dataset.section);
    } else {
        showSection("dashboard");
    }
}

window.openProductChannels = openProductChannels;
window.closeProductChannels = closeProductChannels;
window.saveProductChannels = saveProductChannels;
window.loadAdminProducts = loadAdminProducts;
window.showSection = showSection;

loadInitialSection();
loadDashboardStats();
