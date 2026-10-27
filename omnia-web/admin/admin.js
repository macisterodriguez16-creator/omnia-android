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


function renderTopPublicationPanel(products) {
    let panel = document.getElementById("topProductPublicationPanel");

    if (!panel) {
        panel = document.createElement("section");
        panel.id = "topProductPublicationPanel";
        panel.className = "top-product-publication-panel";
        const container = document.querySelector(".admin-products-container");
        if (!container || !container.parentNode) return;
        container.parentNode.insertBefore(panel, container);
    }

    const list = Array.isArray(products) ? products : [];
    const options = list.map(product => {
        const id = String(
            product.printify_id || product.printifyId || product.id || ""
        );
        const title = String(product.title || product.name || "Producto sin nombre");
        return `<option value="${escapeHtml(id)}">${escapeHtml(title)} — ${escapeHtml(id)}</option>`;
    }).join("");

    const previous = panel.querySelector("#topPublicationProductSelect");
    const previousId = previous ? previous.value : "";

    panel.innerHTML = `
        <h3>PUBLICACIÓN POR CANAL</h3>
        <label class="top-publication-product-label" for="topPublicationProductSelect">
            Producto
        </label>
        <select id="topPublicationProductSelect"
                onchange="loadTopProductChannels()"
                ${list.length ? "" : "disabled"}>
            ${options || '<option value="">No hay productos disponibles</option>'}
        </select>
        <div class="product-channel-panel">
            <div class="product-channel-sidebar-title">CANALES DE VENTA</div>
            <div class="product-channel-list">
                ${channels.map(channel => `
                    <label class="product-channel-option">
                        <input type="checkbox"
                               class="top-product-channel-checkbox"
                               data-channel="${escapeHtml(channel.id)}">
                        <span class="channel-option-content">
                            ${escapeHtml(channel.name)}
                        </span>
                    </label>
                `).join("")}
            </div>
        </div>
        <div class="product-channel-save">
            <button class="primary-button"
                    type="button"
                    onclick="saveTopProductChannels()"
                    ${list.length ? "" : "disabled"}>
                Guardar publicación
            </button>
        </div>
        <p id="topPublicationMessage" role="status" aria-live="polite"></p>
    `;

    const selector = panel.querySelector("#topPublicationProductSelect");
    if (previousId && list.some(product =>
        String(product.printify_id || product.printifyId || product.id || "") === previousId
    )) {
        selector.value = previousId;
    }

    if (selector.value) {
        loadTopProductChannels();
    }
}

async function loadTopProductChannels() {
    const selector = document.getElementById("topPublicationProductSelect");
    const panel = document.getElementById("topProductPublicationPanel");
    if (!selector || !panel || !selector.value) return;
    if (!requestAdminSecret()) return;

    const productId = selector.value;
    const message = document.getElementById("topPublicationMessage");
    if (message) message.textContent = "Cargando publicación…";

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const savedChannels = data.channels || data.canales || data.items || [];
        const savedMap = {};

        savedChannels.forEach(item => {
            const channelId = item.channel || item.id;
            if (channelId) savedMap[channelId] = item;
        });

        if (selector.value !== productId) return;

        panel.querySelectorAll(".top-product-channel-checkbox").forEach(input => {
            const saved = savedMap[input.dataset.channel];
            input.checked = !!(
                saved &&
                Number(saved.enabled) === 1 &&
                saved.status === "published"
            );
        });

        if (message) message.textContent = "Publicación cargada.";
    } catch (error) {
        if (message) message.textContent = `No se pudo cargar: ${error.message}`;
    }
}

async function saveTopProductChannels() {
    const selector = document.getElementById("topPublicationProductSelect");
    const panel = document.getElementById("topProductPublicationPanel");
    const message = document.getElementById("topPublicationMessage");

    if (!selector || !selector.value || !panel) {
        if (message) message.textContent = "Selecciona un producto primero.";
        return;
    }
    if (!requestAdminSecret()) return;

    const productId = selector.value;
    const checkboxes = Array.from(
        panel.querySelectorAll(".top-product-channel-checkbox")
    );

    try {
        if (message) message.textContent = "Guardando publicación…";

        for (const input of checkboxes) {
            const channel = input.dataset.channel;
            const baseUrl =
                `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels`;

            if (input.checked) {
                const response = await adminFetch(baseUrl, {
                    method: "POST",
                    headers: getAdminHeaders(true),
                    body: JSON.stringify({ channel })
                });
                if (!response.ok) throw new Error(`Error al publicar en ${channel}: HTTP ${response.status}`);
            } else {
                const response = await adminFetch(
                    `${baseUrl}/${encodeURIComponent(channel)}`,
                    { method: "DELETE", headers: getAdminHeaders(false) }
                );
                if (!response.ok && response.status !== 404) {
                    throw new Error(`Error al retirar ${channel}: HTTP ${response.status}`);
                }
            }
        }

        if (message) message.textContent = "Publicación guardada correctamente.";
        window.alert("Publicación actualizada correctamente.");
        await loadTopProductChannels();

        if (typeof loadDashboardStats === "function") {
            loadDashboardStats();
        }
    } catch (error) {
        if (message) message.textContent = `No se pudo guardar: ${error.message}`;
        window.alert(`No se pudo guardar la publicación.\n${error.message}`);
    }
}

function renderAdminProducts(products) {
    window.__omniaProductsById = Object.create(null);
    const container = document.querySelector(
        ".admin-products-container"
    );

    if (!container) {
        return;
    }

    renderTopPublicationPanel(products);


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
            window.__omniaProductsById[String(id)] = product;

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
                <div class="product-admin-card" role="button" tabindex="0" onclick="openProductEditor('${encodeURIComponent(String(id))}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductEditor('${encodeURIComponent(String(id))}')}">

                    <div class="product-admin-image">
                        ${
                            image
                                ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">`
                                : `<div class="product-image-placeholder">∞</div>`
                        }
                    </div>

                    <div class="product-admin-info">
                        <h3>${escapeHtml(title)}</h3>
                        <p class="product-open-hint">Abrir para editar producto</p>

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
        onclick="event.stopPropagation();openProductChannels('${encodeURIComponent(String(id))}')"
    >
        Gestionar publicación
    </button>

    <button
        class="secondary-button omnia-withdraw-button"
        onclick="event.stopPropagation();withdrawProductFromOmnia('${encodeURIComponent(String(id))}')"
    >
        Eliminar publicación de OMNIA
    </button>

    <button
        class="secondary-button product-mockup-button"
        onclick="event.stopPropagation();openProductMockup('${encodeURIComponent(String(id))}')"
    >
        Elegir maqueta
    </button>
    <button class="secondary-button" onclick="event.stopPropagation();editOmniaProduct('${encodeURIComponent(String(id))}')">Editar ficha</button>
    <button class="secondary-button" onclick="event.stopPropagation();removeProductBackground('${encodeURIComponent(String(id))}', '${encodeURIComponent(String(image || ''))}')">Quitar fondo</button>
    <button class="secondary-button product-delete-button" onclick="event.stopPropagation();deleteOmniaProduct('${encodeURIComponent(String(id))}')">Eliminar</button>
</div>
                </div>
            `;
        })
        .join("");
}




async function withdrawProductFromOmnia(encodedProductId) {
    const productId = decodeURIComponent(encodedProductId);

    if (!window.confirm(
        "¿Retirar este producto de la tienda OMNIA?\n\n" +
        "El producto seguirá en el catálogo y en Printify. " +
        "Las publicaciones en otros canales no se modificarán."
    )) {
        return;
    }

    if (!requestAdminSecret()) return;

    try {
        const response = await adminFetch(
            `${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(productId)}/channels/omnia`,
            {
                method: "DELETE",
                headers: getAdminHeaders(false)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        window.alert("El producto se retiró de la tienda OMNIA.");

        await loadAdminProducts();

        if (typeof loadDashboardStats === "function") {
            loadDashboardStats();
        }
    } catch (error) {
        window.alert(
            "No se pudo retirar el producto de OMNIA.\n" + error.message
        );
    }
}

async function openProductChannels(encodedProductId) {
    const productId = decodeURIComponent(encodedProductId);

    if (!requestAdminSecret()) {
        return;
    }

    // Sincronizar el producto seleccionado en el panel superior.
    const topSelector = document.getElementById("topPublicationProductSelect");

    if (topSelector) {
        const hasProduct = Array.from(topSelector.options).some(
            option => option.value === productId
        );

        if (hasProduct) {
            topSelector.value = productId;
            await loadTopProductChannels();
        }
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

                <div class="product-channel-panel"><div class="product-channel-sidebar-title">CANALES DE VENTA</div><div class="product-channel-list">

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

                </div></div>

                <div class="product-channel-save">
                    <button class="primary-button"
                        onclick="saveProductChannels('${encodeURIComponent(productId)}')">
                        Guardar publicación
                    </button>
                </div>


            </div>

            <div class="admin-modal-footer">

                <button
                    class="secondary-button"
                    onclick="closeProductChannels()"
                >
                    Cancelar
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

function setProductManagementMessage(message, isError = false) {
    const el = document.getElementById("productManagementMessage");
    if (el) {
        el.textContent = message;
        el.classList.toggle("is-error", Boolean(isError));
    }
}

async function readApiResponse(response) {
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok || data.status === "error") {
        throw new Error(data.message || data.detail || `Error HTTP ${response.status}`);
    }
    return data;
}

async function createManualProduct() {
    const title = window.prompt("Nombre del producto:");
    if (title === null) return;
    if (!title.trim()) { setProductManagementMessage("El nombre es obligatorio.", true); return; }
    const priceText = window.prompt("Precio de venta (USD):", "0.00");
    if (priceText === null) return;
    const price = Number(priceText);
    if (!Number.isFinite(price) || price < 0) { setProductManagementMessage("Introduce un precio válido.", true); return; }
    const description = window.prompt("Descripción del producto (opcional):", "") || "";
    const category = window.prompt("Categoría (opcional):", "") || "";
    const image = window.prompt("URL de imagen (opcional):", "") || "";
    try {
        setProductManagementMessage("Creando producto…");
        await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/manual`, {
            method: "POST", body: JSON.stringify({ title: title.trim(), price, description, category, image })
        }));
        setProductManagementMessage("Producto creado como borrador.");
        await loadAdminProducts();
        if (typeof loadDashboardStats === "function") await loadDashboardStats();
    } catch (error) { setProductManagementMessage(`No se pudo crear el producto: ${error.message}`, true); }
}

async function syncAllPrintifyProducts() {
    if (!window.confirm("¿Sincronizar los productos de la tienda Printify configurada con el catálogo de OMNIA?")) return;
    try {
        setProductManagementMessage("Sincronizando productos de Printify. Puede tardar un poco…");
        const data = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/sync/printify-all`, { method: "POST" }));
        const count = data.products_synced ?? data.total ?? data.synced ?? null;
        setProductManagementMessage(count === null ? (data.message || "Sincronización finalizada.") : `Sincronización finalizada: ${count} productos procesados.`);
        await loadAdminProducts();
        if (typeof loadDashboardStats === "function") await loadDashboardStats();
    } catch (error) { setProductManagementMessage(`Falló la sincronización: ${error.message}`, true); }
}

async function setupPrintifyWebhook() {
    if (!window.confirm("¿Solicitar a OMNIA API la configuración del webhook de Printify?")) return;
    try {
        setProductManagementMessage("Configurando webhook de Printify…");
        const data = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/webhooks/printify/setup`, { method: "POST", body: JSON.stringify({}) }));
        setProductManagementMessage(data.message || "Solicitud de configuración del webhook completada.");
    } catch (error) { setProductManagementMessage(`No se pudo configurar el webhook: ${error.message}`, true); }
}

async function editOmniaProduct(encodedId) {
    const id = decodeURIComponent(encodedId);
    try {
        const current = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}/omnia-settings`));
        const settings = current.settings || {};
        const title = window.prompt("Título para mostrar en OMNIA:", settings.title || "");
        if (title === null) return;
        const description = window.prompt("Descripción para OMNIA:", settings.description || "");
        if (description === null) return;
        const category = window.prompt("Categoría para OMNIA:", settings.category || "");
        if (category === null) return;
        setProductManagementMessage("Guardando ficha de OMNIA…");
        const data = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}/omnia-settings`, {
            method: "PUT", body: JSON.stringify({ settings: { ...settings, title: title.trim(), description, category } })
        }));
        setProductManagementMessage(data.message || "Ficha de OMNIA guardada.");
        await loadAdminProducts();
    } catch (error) { setProductManagementMessage(`No se pudo editar la ficha: ${error.message}`, true); }
}

async function removeProductBackground(encodedId, encodedImage) {
    const id = decodeURIComponent(encodedId);
    const imageUrl = decodeURIComponent(encodedImage || "");
    if (!imageUrl) { setProductManagementMessage("Este producto no tiene una URL de imagen disponible.", true); return; }
    if (!window.confirm("¿Procesar esta imagen para quitar el fondo? El servicio puede requerir credenciales configuradas en la API.")) return;
    try {
        setProductManagementMessage("Procesando imagen para quitar el fondo…");
        const data = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}/remove-background`, {
            method: "POST", body: JSON.stringify({ image_url: imageUrl })
        }));
        setProductManagementMessage(data.message || (data.processed_image_url ? `Imagen procesada: ${data.processed_image_url}` : "Procesamiento completado."));
        await loadAdminProducts();
    } catch (error) { setProductManagementMessage(`No se pudo quitar el fondo: ${error.message}`, true); }
}

async function deleteOmniaProduct(encodedId) {
    const id = decodeURIComponent(encodedId);
    if (!window.confirm("¿Eliminar este producto del catálogo de OMNIA? Esta acción no se puede deshacer. No elimina el producto original de Printify.")) return;
    try {
        setProductManagementMessage("Eliminando producto del catálogo…");
        const data = await readApiResponse(await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }));
        setProductManagementMessage(data.message || "Producto eliminado del catálogo de OMNIA.");
        await loadAdminProducts();
        if (typeof loadDashboardStats === "function") await loadDashboardStats();
    } catch (error) { setProductManagementMessage(`No se pudo eliminar: ${error.message}`, true); }
}

// Editor visual por producto. Las imágenes ocultas y añadidas aquí solo afectan a esta ventana;
// nunca se envía una operación de borrado de imagen a Printify ni al catálogo de OMNIA.
function productEditorStoreKey(id) { return `omnia_product_editor_images_v1:${id}`; }
function readProductEditorImages(id, product) {
    let stored = { hidden: [], added: [] };
    try { stored = JSON.parse(localStorage.getItem(productEditorStoreKey(id)) || '{"hidden":[],"added":[]}'); } catch (_) {}
    const originals = [];
    const add = (value, index) => {
        const url = typeof value === 'string' ? value : value && (value.src || value.url || value.preview_url || value.preview);
        if (url && !originals.some(item => item.url === url)) originals.push({ key: `source:${url}`, url, source: true, label: `Imagen ${index + 1}` });
    };
    if (Array.isArray(product.images)) product.images.forEach(add);
    if (product.payload) {
        let payload = product.payload;
        if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (_) { payload = {}; } }
        if (Array.isArray(payload.images)) payload.images.forEach(add);
    }
    add(product.main_image_url || product.image_url || product.imageUrl || product.image, originals.length);
    const hidden = new Set(stored.hidden || []);
    return [...originals.filter(item => !hidden.has(item.key)), ...(stored.added || []).map((item, i) => ({...item, key: item.key || `added:${i}`, source: false}))];
}
function saveProductEditorImageState(id, images, product) {
    let stored = { hidden: [], added: [] };
    try { stored = JSON.parse(localStorage.getItem(productEditorStoreKey(id)) || '{"hidden":[],"added":[]}'); } catch (_) {}
    const sourceUrls = new Set();
    const collect = value => { const u = typeof value === 'string' ? value : value && (value.src || value.url || value.preview_url || value.preview); if (u) sourceUrls.add(u); };
    if (Array.isArray(product.images)) product.images.forEach(collect);
    let payload = product.payload;
    if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (_) { payload = {}; } }
    if (Array.isArray(payload?.images)) payload.images.forEach(collect);
    collect(product.main_image_url || product.image_url || product.imageUrl || product.image);
    stored.added = images.filter(item => !item.source);
    const visibleSourceKeys = new Set(images.filter(item => item.source).map(item => item.key));
    stored.hidden = [...sourceUrls].map(url => `source:${url}`).filter(key => !visibleSourceKeys.has(key));
    try { localStorage.setItem(productEditorStoreKey(id), JSON.stringify(stored)); }
    catch (_) { throw new Error('El navegador no tiene espacio suficiente para guardar las imágenes añadidas en este dispositivo.'); }
}
function openProductEditor(encodedId) {
    const id = decodeURIComponent(encodedId);
    const product = window.__omniaProductsById && window.__omniaProductsById[id];
    if (!product) { setProductManagementMessage('No se encontró el producto seleccionado. Actualiza el catálogo e inténtalo de nuevo.', true); return; }
    let images = readProductEditorImages(id, product);
    let active = 0;
    const title = product.title || product.name || '';
    const description = product.description || product.omnia_description || '';
    const price = product.price ?? product.sale_price ?? product.salePrice ?? '';
    const stock = product.stock ?? product.quantity ?? product.inventory ?? '';
    const old = document.getElementById('omniaProductEditorModal'); if (old) old.remove();
    const modal = document.createElement('div'); modal.id = 'omniaProductEditorModal'; modal.className = 'omnia-product-editor-backdrop';
    modal.innerHTML = `<section class="omnia-product-editor" role="dialog" aria-modal="true" aria-labelledby="omniaEditorHeading">
      <header class="omnia-editor-header"><div><span class="section-label">CATÁLOGO OMNIA</span><h2 id="omniaEditorHeading">Editar producto</h2><p>Las imágenes que ocultes aquí se conservarán en Printify y en OMNIA.</p></div><button type="button" class="omnia-editor-close" aria-label="Cerrar" data-close-editor>×</button></header>
      <div class="omnia-editor-content"><section class="omnia-editor-gallery"><div class="omnia-editor-main-image" id="omniaEditorMainImage"></div><div class="omnia-editor-thumbnails" id="omniaEditorThumbnails"></div><label class="omnia-editor-add">＋ <span>Añadir imágenes desde tu dispositivo</span><input id="omniaEditorImageInput" type="file" accept="image/*" multiple hidden></label><p class="omnia-editor-note">Eliminar una imagen solo la oculta en esta ventana. El zoom abre una vista ampliada.</p></section>
      <form id="omniaProductEditorForm" class="omnia-editor-fields"><label>Título<input id="omniaEditorTitle" maxlength="200" required value="${escapeHtml(title)}"></label><label>Descripción <span class="omnia-editor-counter" id="omniaEditorDescriptionCount">0/5000</span><textarea id="omniaEditorDescription" maxlength="5000" rows="7">${escapeHtml(description)}</textarea></label><div class="omnia-editor-two-fields"><label>Precio<input id="omniaEditorPrice" type="number" min="0" step="0.01" value="${escapeHtml(price)}"></label><label>Cantidad en stock<input id="omniaEditorStock" type="number" min="0" step="1" value="${escapeHtml(stock)}" placeholder="No especificado"></label></div><p class="omnia-editor-stock-note">El stock se guardará solo si la API admite la actualización para este producto.</p><p class="product-management-message" id="omniaEditorMessage" role="status" aria-live="polite"></p><footer class="omnia-editor-footer"><button type="button" class="secondary-button" data-close-editor>Cancelar</button><button type="submit" class="primary-button" id="omniaEditorSaveButton">Guardar cambios</button></footer></form></div></section>`;
    document.body.appendChild(modal);
    const $ = sel => modal.querySelector(sel);
    const close = () => modal.remove();
    modal.querySelectorAll('[data-close-editor]').forEach(btn => btn.addEventListener('click', close));
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    const desc = $('#omniaEditorDescription'); const count = $('#omniaEditorDescriptionCount');
    const updateCount = () => count.textContent = `${desc.value.length}/5000`; desc.addEventListener('input', updateCount); updateCount();
    function renderGallery() {
      if (active >= images.length) active = Math.max(0, images.length - 1);
      const main = $('#omniaEditorMainImage');
      main.innerHTML = images.length ? `<img src="${escapeHtml(images[active].url)}" alt="Imagen ${active+1}"><span class="omnia-editor-image-count">${active+1} / ${images.length}</span><button type="button" class="omnia-editor-zoom" aria-label="Ampliar imagen">⌕</button><button type="button" class="omnia-editor-image-delete" aria-label="Ocultar imagen">×</button>${images.length > 1 ? `<button type="button" class="omnia-editor-prev" aria-label="Imagen anterior">‹</button><button type="button" class="omnia-editor-next" aria-label="Imagen siguiente">›</button>` : ''}` : '<div class="omnia-editor-no-image">No hay imágenes visibles. Pulsa + para añadir desde tu dispositivo.</div>';
      if (images.length) {
        main.querySelector('.omnia-editor-zoom').onclick = () => openProductImageZoom(images[active].url);
        main.querySelector('.omnia-editor-image-delete').onclick = () => { if (!confirm('¿Ocultar esta imagen solamente en la ventana de edición? No se eliminará de Printify ni de OMNIA.')) return; images.splice(active,1); try { saveProductEditorImageState(id, images, product); renderGallery(); } catch (e) { $('#omniaEditorMessage').textContent = e.message; } };
        const prev = main.querySelector('.omnia-editor-prev'); if (prev) prev.onclick = () => { active = (active - 1 + images.length) % images.length; renderGallery(); };
        const next = main.querySelector('.omnia-editor-next'); if (next) next.onclick = () => { active = (active + 1) % images.length; renderGallery(); };
      }
      $('#omniaEditorThumbnails').innerHTML = images.map((img,i) => `<button type="button" class="omnia-editor-thumb ${i===active?'active':''}" data-image-index="${i}" aria-label="Seleccionar imagen ${i+1}"><img src="${escapeHtml(img.url)}" alt=""><span>${i+1}</span></button>`).join('');
      $('#omniaEditorThumbnails').querySelectorAll('[data-image-index]').forEach(btn => btn.onclick = () => { active = Number(btn.dataset.imageIndex); renderGallery(); });
    }
    $('#omniaEditorImageInput').addEventListener('change', async e => {
      const files = [...(e.target.files || [])];
      for (const file of files) { if (!file.type.startsWith('image/')) continue; const dataUrl = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); images.push({key:`added:${Date.now()}:${Math.random().toString(36).slice(2)}`,url:dataUrl,source:false,label:file.name}); }
      try { saveProductEditorImageState(id, images, product); renderGallery(); $('#omniaEditorMessage').textContent = files.length ? 'Imágenes añadidas a la galería de este dispositivo.' : ''; }
      catch (err) { $('#omniaEditorMessage').textContent = err.message; }
      e.target.value = '';
    });
    renderGallery();
    $('#omniaProductEditorForm').addEventListener('submit', async e => {
      e.preventDefault();
      const newTitle = $('#omniaEditorTitle').value.trim(); const newDescription = desc.value;
      const priceValue = $('#omniaEditorPrice').value; const stockValue = $('#omniaEditorStock').value;
      if (!newTitle) { $('#omniaEditorMessage').textContent = 'El título es obligatorio.'; return; }
      if (newDescription.length > 5000) { $('#omniaEditorMessage').textContent = 'La descripción no puede superar 5.000 caracteres.'; return; }
      const btn = $('#omniaEditorSaveButton'); btn.disabled = true; btn.textContent = 'Guardando…'; $('#omniaEditorMessage').textContent = '';
      try {
        const payload = { title: newTitle, description: newDescription };
        if (priceValue !== '') payload.price = Number(priceValue);
        if (stockValue !== '') payload.stock = Number(stockValue);
        const productSave = await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}`, { method:'PUT', body:JSON.stringify(payload) });
        await readApiResponse(productSave);
        // También guarda la presentación de OMNIA cuando esa ruta está disponible.
        const settingsResponse = await adminFetch(`${OMNIA_API_BACKEND}/api/admin/products/${encodeURIComponent(id)}/omnia-settings`, { method:'PUT', body:JSON.stringify({settings:{title:newTitle,description:newDescription}}) });
        if (!settingsResponse.ok && settingsResponse.status !== 404 && settingsResponse.status !== 405) await readApiResponse(settingsResponse);
        saveProductEditorImageState(id, images, product);
        $('#omniaEditorMessage').textContent = 'Cambios guardados.';
        await loadAdminProducts();
        setTimeout(() => { if (document.body.contains(modal)) close(); }, 650);
      } catch (err) { $('#omniaEditorMessage').textContent = `No se pudieron guardar todos los cambios: ${err.message}`; }
      finally { if (document.body.contains(btn)) { btn.disabled = false; btn.textContent = 'Guardar cambios'; } }
    });
}
function openProductImageZoom(url) {
    const layer = document.createElement('div'); layer.className = 'omnia-image-zoom-backdrop';
    layer.innerHTML = `<button type="button" class="omnia-image-zoom-close" aria-label="Cerrar zoom">×</button><img src="${escapeHtml(url)}" alt="Vista ampliada"><div class="omnia-image-zoom-controls"><button type="button" data-zoom-out>−</button><button type="button" data-zoom-reset>100%</button><button type="button" data-zoom-in>＋</button></div>`;
    document.body.appendChild(layer); const img = layer.querySelector('img'); let scale = 1;
    const apply = () => { img.style.transform = `scale(${scale})`; layer.querySelector('[data-zoom-reset]').textContent = `${Math.round(scale*100)}%`; };
    layer.querySelector('.omnia-image-zoom-close').onclick = () => layer.remove(); layer.addEventListener('click', e => { if (e.target === layer) layer.remove(); });
    layer.querySelector('[data-zoom-in]').onclick = () => { scale = Math.min(4, scale + .25); apply(); };
    layer.querySelector('[data-zoom-out]').onclick = () => { scale = Math.max(.5, scale - .25); apply(); };
    layer.querySelector('[data-zoom-reset]').onclick = () => { scale = 1; apply(); };
    img.addEventListener('wheel', e => { e.preventDefault(); scale = Math.max(.5, Math.min(4, scale + (e.deltaY < 0 ? .15 : -.15))); apply(); }, {passive:false});
}

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
window.createManualProduct = createManualProduct;
window.syncAllPrintifyProducts = syncAllPrintifyProducts;
window.setupPrintifyWebhook = setupPrintifyWebhook;
window.editOmniaProduct = editOmniaProduct;
window.removeProductBackground = removeProductBackground;
window.deleteOmniaProduct = deleteOmniaProduct;
window.showSection = showSection;

loadInitialSection();
loadDashboardStats();
