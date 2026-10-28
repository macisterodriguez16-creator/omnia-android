const PRINTIFY_API_BASE = "https://api.printify.com/v1";

function getImageUrl(image) {
  let rawUrl = "";

  if (typeof image === "string") {
    rawUrl = image.trim();
  } else if (image && typeof image === "object") {
    const candidates = [
      image.src,
      image.url,
      image.preview_url,
      image.preview,
      image.original_image,
      image.original,
      image.image,
    ];

    const found = candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0
    );
    if (found) {
      rawUrl = found.trim();
    }
  }

  if (/^https?:\/\/\S+$/i.test(rawUrl)) {
    return rawUrl;
  }

  return "";
}

function normalizeMockupImages(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image, index) => {
      const src = getImageUrl(image);

      if (!src) {
        return null;
      }

      return {
        ...(typeof image === "object" && image !== null ? image : {}),
        id: image?.id ?? `mockup-${index}`,
        src,
      };
    })
    .filter(Boolean);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Admin-Secret, X-Pfy-Signature, X-Printify-Signature",
    };

    const jsonHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    };

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: jsonHeaders,
      });

    const adminAuthorized = (req) => {
      if (!env.ADMIN_SECRET) return false;
      const authorization = req.headers.get("Authorization") || "";
      const secret = req.headers.get("X-Admin-Secret") || "";
      return (
        authorization === `Bearer ${env.ADMIN_SECRET}` ||
        secret === env.ADMIN_SECRET
      );
    };

    const requireAdmin = (req) => {
      if (!env.ADMIN_SECRET) {
        return json(
          { status: "error", message: "ADMIN_SECRET no está configurado." },
          500,
        );
      }
      if (!adminAuthorized(req)) {
        return json({ status: "error", message: "No autorizado." }, 401);
      }
      return null;
    };

    const printifyRequest = async (endpoint, options = {}) => {
      if (!env.PRINTIFY_API_KEY) {
        throw new Error("PRINTIFY_API_KEY no está configurada.");
      }
      return fetch(`${PRINTIFY_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${env.PRINTIFY_API_KEY}`,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
        },
      });
    };

    const parsePayload = (value) => {
      try {
        const parsed = JSON.parse(value || "{}");
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    };

    const getProduct = async (id) => {
      return env.DB.prepare(
        `SELECT printify_id, shop_id, title, description, status, payload_json, updated_at
         FROM printify_products
         WHERE printify_id = ?
         LIMIT 1`
      )
        .bind(String(id))
        .first();
    };

    const saveProduct = async (product, shopId) => {
      if (!product || !product.id) {
        throw new Error("El producto no contiene un ID válido.");
      }
      await env.DB.prepare(
        `INSERT INTO printify_products (printify_id, shop_id, title, description, status, payload_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(printify_id)
         DO UPDATE SET
           shop_id = excluded.shop_id,
           title = excluded.title,
           description = excluded.description,
           status = excluded.status,
           payload_json = excluded.payload_json,
           updated_at = CURRENT_TIMESTAMP`
      )
        .bind(
          String(product.id),
          String(shopId || env.PRINTIFY_SHOP_ID || "manual"),
          product.title || "",
          product.description || "",
          product.status || "draft",
          JSON.stringify(product),
        )
        .run();
    };

    const listChannels = async (productId) => {
      const result = await env.DB.prepare(
        `SELECT id, product_id, channel, enabled, status, external_product_id, published_at, created_at, updated_at
         FROM product_channels
         WHERE product_id = ?
         ORDER BY channel ASC`
      )
        .bind(String(productId))
        .all();
      return result.results || [];
    };

    const getPublicProduct = async (id) => {
      return env.DB.prepare(
        `SELECT p.printify_id, p.shop_id, p.title, p.description, p.status, p.payload_json, p.updated_at, pds.main_image_url, pip.processed_image_url, pos.settings_json AS omnia_settings_json
         FROM printify_products p
         INNER JOIN product_channels pc ON pc.product_id = p.printify_id
         LEFT JOIN product_display_settings pds ON pds.product_id = p.printify_id
         LEFT JOIN product_image_processing pip ON pip.product_id = p.printify_id
         LEFT JOIN product_omnia_settings pos ON pos.product_id = p.printify_id
         WHERE p.printify_id = ?
           AND pc.channel = 'omnia'
           AND pc.enabled = 1
           AND pc.status = 'published'
         LIMIT 1`
      )
        .bind(String(id))
        .first();
    };

    const normalizePublicProduct = (product) => {
      const payload = parsePayload(product.payload_json);
      let custom = {};
      try {
        const parsed = product.omnia_settings_json
          ? JSON.parse(product.omnia_settings_json)
          : {};
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) custom = parsed;
      } catch (_) {}

      const variants = Array.isArray(custom.variants)
        ? custom.variants
        : (Array.isArray(payload.variants) ? payload.variants : []);
      const options = Array.isArray(custom.options)
        ? custom.options
        : (Array.isArray(payload.options) ? payload.options : []);
      const availableVariants = variants.filter(
        (v) => v && v.is_enabled !== false && v.is_available !== false,
      );
      const selectedVariant = availableVariants[0] || variants[0] || null;
      const rawPrice = selectedVariant && selectedVariant.price != null
        ? Number(selectedVariant.price)
        : Number(payload.price || 0);
      const price = Number.isFinite(rawPrice) ? rawPrice / 100 : 0;

      const rawImages = Array.isArray(custom.images)
        ? custom.images
        : (Array.isArray(payload.images) ? payload.images : []);
      let normalizedImages = normalizeMockupImages(rawImages);
      const coverImageUrl = typeof custom.cover_image === "string"
        ? custom.cover_image.trim()
        : "";

      if (coverImageUrl && !normalizedImages.some((image) => image.src === coverImageUrl)) {
        normalizedImages = [
          { src: coverImageUrl, url: coverImageUrl, is_default: true },
          ...normalizedImages,
        ];
      }

      const selectedImage =
        (coverImageUrl && normalizedImages.find((image) => image.src === coverImageUrl)) ||
        normalizedImages.find((image) => image.src === product.main_image_url);
      const defaultImage = selectedImage ||
        normalizedImages.find((image) => image.is_default === true) ||
        normalizedImages[0] || null;
      const mainImageUrl = defaultImage ? defaultImage.src : "";
      const processedImageUrl = product.processed_image_url || "";
      const displayImageUrl = coverImageUrl ? mainImageUrl : (processedImageUrl || mainImageUrl);
      const finalizedImages = normalizedImages.map((image) => ({
        ...image,
        is_default: image.src === mainImageUrl,
      }));

      return {
        ...payload,
        id: product.printify_id,
        printify_id: product.printify_id,
        shop_id: product.shop_id,
        title: typeof custom.title === "string" ? custom.title : (product.title || payload.title || ""),
        description: typeof custom.description === "string" ? custom.description : (product.description || payload.description || ""),
        category: typeof custom.category === "string" ? custom.category : (payload.category || ""),
        status: product.status || payload.status || "",
        price,
        image: displayImageUrl,
        original_image: mainImageUrl,
        processed_image: processedImageUrl || null,
        images: finalizedImages,
        variants,
        options,
        updated_at: product.updated_at,
        is_published: true,
      };
    };
    const verifyPrintifySignature = async (rawBody, signature) => {
      if (!env.PRINTIFY_WEBHOOK_SECRET || !signature) return false;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(env.PRINTIFY_WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );
      const digest = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(rawBody),
      );
      const expected =
        "sha256=" +
        Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      if (signature.length !== expected.length) return false;
      let difference = 0;
      for (let i = 0; i < expected.length; i++) {
        difference += signature.charCodeAt(i) ^ expected.charCodeAt(i);
      }
      return difference === 0;
    };

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (method === "GET" && path === "/") {
      return json({
        status: "success",
        app: "OMNIA Marketplace API",
        message: "OMNIA API funcionando correctamente.",
      });
    }

    if (method === "GET" && path === "/api/printify/shops") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const response = await printifyRequest("/shops.json");
        const data = await response.json();
        return json(
          { status: response.ok ? "success" : "error", shops: data },
          response.ok ? 200 : response.status,
        );
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "GET" && path === "/api/printify/products") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        if (!env.PRINTIFY_SHOP_ID) {
          return json(
            {
              status: "error",
              message: "PRINTIFY_SHOP_ID no está configurada.",
            },
            400,
          );
        }
        const page = Math.max(1, Number(url.searchParams.get("page") || 1));
        const response = await printifyRequest(
          `/shops/${env.PRINTIFY_SHOP_ID}/products.json?page=${page}`,
        );
        const data = await response.json();
        return json(
          { status: response.ok ? "success" : "error", page, products: data },
          response.ok ? 200 : response.status,
        );
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && path === "/api/sync/printify") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        if (!env.PRINTIFY_SHOP_ID) {
          return json(
            {
              status: "error",
              message: "PRINTIFY_SHOP_ID no está configurada.",
            },
            400,
          );
        }
        const body = await request.json();
        const id = body.printify_id || body.id;
        if (!id) {
          return json({ status: "error", message: "Falta printify_id." }, 400);
        }
        const response = await printifyRequest(
          `/shops/${env.PRINTIFY_SHOP_ID}/products/${encodeURIComponent(String(id))}.json`,
        );
        if (!response.ok) {
          return json(
            {
              status: "error",
              message: "No se pudo obtener el producto desde Printify.",
              detail: await response.text(),
            },
            response.status,
          );
        }
        const product = await response.json();
        await saveProduct(product, env.PRINTIFY_SHOP_ID);
        return json({
          status: "success",
          message: "Producto sincronizado con D1.",
          printify_id: String(product.id),
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && path === "/api/sync/printify-all") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        if (!env.PRINTIFY_SHOP_ID) {
          return json(
            {
              status: "error",
              message: "PRINTIFY_SHOP_ID no está configurada.",
            },
            400,
          );
        }
        let page = 1,
          total = 0,
          pages = 0;
        while (page <= 100) {
          const response = await printifyRequest(
            `/shops/${env.PRINTIFY_SHOP_ID}/products.json?page=${page}`,
          );
          if (!response.ok) {
            return json(
              {
                status: "error",
                message: "Error obteniendo productos de Printify.",
                detail: await response.text(),
                page,
                products_synced: total,
              },
              response.status,
            );
          }
          const data = await response.json();
          const products = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [];
          if (!products.length) break;
          for (const product of products) {
            if (!product || !product.id) continue;
            await saveProduct(product, env.PRINTIFY_SHOP_ID);
            total++;
          }
          pages++;
          if (data.last_page && page >= Number(data.last_page)) break;
          if (!data.last_page && products.length < 100) break;
          page++;
        }
        return json({
          status: "success",
          message: "Sincronización de Printify finalizada.",
          products_synced: total,
          pages,
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "GET" && path === "/api/catalog/omnia") {
      try {
        const { results } = await env.DB.prepare(
          `SELECT p.printify_id, p.shop_id, p.title, p.description, p.status, p.payload_json, p.updated_at, pds.main_image_url, pip.processed_image_url, pos.settings_json AS omnia_settings_json
           FROM printify_products p
           INNER JOIN product_channels pc ON pc.product_id = p.printify_id
           LEFT JOIN product_display_settings pds ON pds.product_id = p.printify_id
           LEFT JOIN product_image_processing pip ON pip.product_id = p.printify_id
         LEFT JOIN product_omnia_settings pos ON pos.product_id = p.printify_id
           WHERE pc.channel = 'omnia' AND pc.enabled = 1 AND pc.status = 'published'
           ORDER BY p.updated_at DESC`
        ).all();
        const products = (results || []).map(normalizePublicProduct);
        return json({ status: "success", products });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    const productDetailMatch = path.match(
      /^\/api\/catalog\/products\/([^/]+)$/,
    );
    if (method === "GET" && productDetailMatch) {
      try {
        const id = decodeURIComponent(productDetailMatch[1]);
        const product = await getPublicProduct(id);
        if (!product) {
          return json(
            { status: "error", message: "Producto no disponible en OMNIA." },
            404,
          );
        }
        return json({
          status: "success",
          product: normalizePublicProduct(product),
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "GET" && path === "/api/admin/products") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const { results } = await env.DB.prepare(
          `SELECT printify_id, shop_id, title, description, status, payload_json, updated_at
           FROM printify_products
           ORDER BY updated_at DESC`
        ).all();
        const products = [];
        for (const product of results || []) {
          products.push({
            ...product,
            payload: parsePayload(product.payload_json),
            channels: await listChannels(product.printify_id),
          });
        }
        return json({ status: "success", products });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && path === "/api/admin/products/manual") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const body = await request.json();
        const title = String(body.title || "").trim();
        const description = String(body.description || "").trim();
        const category = String(body.category || "").trim();
        const price = Number(body.price);

        if (!title)
          return json(
            { status: "error", message: "El título es obligatorio." },
            400,
          );
        if (!Number.isFinite(price) || price < 0)
          return json({ status: "error", message: "Precio no válido." }, 400);

        const images = Array.isArray(body.images)
          ? body.images
              .filter((img) => typeof img === "string" && img.trim())
              .map((src, i) => ({ src: src.trim(), is_default: i === 0 }))
          : body.image
            ? [{ src: String(body.image), is_default: true }]
            : [];

        const id = `manual_${crypto.randomUUID()}`;
        const variants = [
          {
            id: `${id}_variant_1`,
            title: "Predeterminado",
            price: Math.round(price * 100),
            is_enabled: true,
            is_available: true,
          },
        ];
        const product = {
          id,
          title,
          description,
          category,
          price: Math.round(price * 100),
          images,
          variants,
          options: [],
          tags: [],
          origin: "manual",
          status: "draft",
        };

        await saveProduct(product, "manual");
        return json(
          {
            status: "success",
            message: "Producto manual creado.",
            product: { ...product, printify_id: id },
          },
          201,
        );
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    const channelsMatch = path.match(
      /^\/api\/admin\/products\/([^/]+)\/channels$/,
    );
    if (method === "GET" && channelsMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const id = decodeURIComponent(channelsMatch[1]);
        const product = await getProduct(id);
        if (!product)
          return json(
            { status: "error", message: "Producto no encontrado." },
            404,
          );
        return json({
          status: "success",
          product: { ...product, payload: parsePayload(product.payload_json) },
          channels: await listChannels(id),
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    const mockupMatch = path.match(
      /^\/api\/admin\/products\/([^/]+)\/mockup$/
    );

    if (mockupMatch && ["GET", "PUT"].includes(method)) {
      const authError = requireAdmin(request);
      if (authError) return authError;

      try {
        if (!env.DB) {
          return json({
            status: "error",
            message: "La base de datos D1 no está configurada."
          }, 500);
        }

        const id = decodeURIComponent(mockupMatch[1]);
        const product = await getProduct(id);

        if (!product) {
          return json({
            status: "error",
            message: "Producto no encontrado."
          }, 404);
        }

        const payload = parsePayload(product.payload_json);
        const rawImages = Array.isArray(payload.images)
          ? payload.images
          : [];
        const images = normalizeMockupImages(rawImages);

        if (!images.length) {
          return json({
            status: "error",
            message: "No se encontraron maquetas válidas. Sincroniza este producto con Printify e inténtalo de nuevo."
          }, 400);
        }

        if (method === "GET") {
          const saved = await env.DB.prepare(
            `SELECT main_image_url
             FROM product_display_settings
             WHERE product_id = ?
             LIMIT 1`
          ).bind(id).first();

          const savedUrl = saved?.main_image_url || "";
          const mainImage =
            images.find((image) => image.src === savedUrl) ||
            images.find((image) => image.is_default === true) ||
            images[0];

          return json({
            status: "success",
            product_id: id,
            main_image_url: mainImage.src,
            images: images.map((image) => ({
              ...image,
              is_default: image.src === mainImage.src
            }))
          });
        }

        let body;
        try {
          body = await request.json();
        } catch {
          return json({
            status: "error",
            message: "El cuerpo de la solicitud no contiene JSON válido."
          }, 400);
        }

        const mainImageUrl =
          typeof body?.main_image_url === "string"
            ? body.main_image_url.trim()
            : "";

        if (!mainImageUrl) {
          return json({
            status: "error",
            message: "Selecciona una imagen principal."
          }, 400);
        }

        const selectedImage = images.find(
          (image) => image.src === mainImageUrl
        );

        if (!selectedImage) {
          return json({
            status: "error",
            message: "La imagen seleccionada no pertenece a este producto."
          }, 400);
        }

        await env.DB.prepare(
          `INSERT INTO product_display_settings
             (product_id, main_image_url, updated_at)
           VALUES (?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(product_id) DO UPDATE SET
             main_image_url = excluded.main_image_url,
             updated_at = CURRENT_TIMESTAMP`
        ).bind(id, selectedImage.src).run();

        return json({
          status: "success",
          message: "Imagen principal de maqueta guardada correctamente.",
          product_id: id,
          main_image_url: selectedImage.src
        });
      } catch (error) {
        return json({
          status: "error",
          message: "No se pudo procesar el selector de maquetas.",
          detail: String(error?.message || error)
        }, 500);
      }
    }

    const omniaSettingsMatch = path.match(/^\/api\/admin\/products\/([^/]+)\/omnia-settings$/);
if (omniaSettingsMatch && (method === "GET" || method === "PUT")) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  if (!env.DB) return json({ status: "error", message: "Base de datos no disponible." }, 500);
  try {
    const id = decodeURIComponent(omniaSettingsMatch[1]);
    if (!(await getProduct(id))) return json({ status: "error", message: "Producto no encontrado." }, 404);
    if (method === "GET") {
      const row = await env.DB.prepare("SELECT settings_json, updated_at FROM product_omnia_settings WHERE product_id = ?").bind(id).first();
      let settings = {};
      if (row?.settings_json) settings = JSON.parse(row.settings_json);
      return json({ status: "success", product_id: id, settings, updated_at: row?.updated_at || null });
    }
    const body = await request.json();
    const settings = body?.settings;
    const allowed = ["title", "description", "category", "images", "cover_image", "variants", "options"];
    if (!settings || typeof settings !== "object" || Array.isArray(settings) || Object.keys(settings).some(k => !allowed.includes(k))) {
      return json({ status: "error", message: "Configuración no válida o contiene campos no permitidos." }, 400);
    }
    for (const [key, maxLength] of [
      ["title", 5000],
      ["description", 50000],
      ["category", 500]
    ]) {
      if (settings[key] !== undefined && typeof settings[key] !== "string") {
        return json({ status: "error", message: key + " debe ser texto." }, 400);
      }
      if (typeof settings[key] === "string" && settings[key].length > maxLength) {
        return json({ status: "error", message: key + " supera la longitud permitida." }, 400);
      }
    }

    if (settings.cover_image !== undefined && typeof settings.cover_image !== "string") {
      return json({ status: "error", message: "cover_image debe ser texto." }, 400);
    }
    if (typeof settings.cover_image === "string" && settings.cover_image.length > 5000) {
      return json({ status: "error", message: "La URL de portada supera la longitud permitida." }, 400);
    }

    const arrayLimits = { images: 100, variants: 500, options: 100 };
    for (const [key, maxItems] of Object.entries(arrayLimits)) {
      if (settings[key] !== undefined && !Array.isArray(settings[key])) {
        return json({ status: "error", message: key + " debe ser una lista." }, 400);
      }
      if (Array.isArray(settings[key]) && settings[key].length > maxItems) {
        return json({ status: "error", message: key + " supera la cantidad permitida." }, 400);
      }
    }

    const saved = JSON.stringify(settings);
    if (saved.length > 200000) return json({ status: "error", message: "Configuración demasiado grande." }, 400);
    await env.DB.prepare("INSERT INTO product_omnia_settings (product_id, settings_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(product_id) DO UPDATE SET settings_json = excluded.settings_json, updated_at = CURRENT_TIMESTAMP").bind(id, saved).run();
    return json({ status: "success", message: "Configuración de OMNIA guardada correctamente.", product_id: id });
  } catch (error) {
    return json({ status: "error", message: "No se pudo procesar la configuración de OMNIA.", detail: String(error?.message || error) }, 500);
  }
}

const removeBackgroundMatch = path.match(
      /^\/api\/admin\/products\/([^/]+)\/remove-background$/,
    );

    if (method === "POST" && removeBackgroundMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;

      try {
        const id = decodeURIComponent(removeBackgroundMatch[1]);

        if (
          !env.CLEARBACKDROP_API_KEY ||
          !env.CLOUDINARY_CLOUD_NAME ||
          !env.CLOUDINARY_API_KEY ||
          !env.CLOUDINARY_API_SECRET
        ) {
          return json(
            {
              status: "error",
              message: "Faltan secretos de ClearBackdrop o Cloudinary.",
            },
            500,
          );
        }

        const product = await getProduct(id);
        if (!product) {
          return json(
            {
              status: "error",
              message: "Producto no encontrado.",
            },
            404,
          );
        }

        const body = await request.json();
        const imageUrl = String(body.image_url || "").trim();

        const payload = parsePayload(product.payload_json);
        const images = normalizeMockupImages(payload.images).map((img) => img.src);

        if (!imageUrl || !images.includes(imageUrl)) {
          return json(
            {
              status: "error",
              message: "Selecciona una imagen original válida del producto.",
            },
            400,
          );
        }

        const parsedUrl = new URL(imageUrl);
        if (parsedUrl.protocol !== "https:") {
          return json(
            {
              status: "error",
              message: "La imagen debe utilizar HTTPS.",
            },
            400,
          );
        }

        const sourceResponse = await fetch(imageUrl);
        if (!sourceResponse.ok) {
          return json(
            {
              status: "error",
              message: "No se pudo descargar la imagen original.",
            },
            502,
          );
        }

        const sourceType = (sourceResponse.headers.get("Content-Type") || "")
          .split(";")[0]
          .trim()
          .toLowerCase();

        const declaredSize = Number(
          sourceResponse.headers.get("Content-Length") || 0,
        );

        if (
          !sourceType.startsWith("image/") ||
          sourceType === "image/svg+xml" ||
          declaredSize > 15 * 1024 * 1024
        ) {
          return json(
            {
              status: "error",
              message: "La imagen debe ser válida y no superar 15 MB.",
            },
            400,
          );
        }

        const sourceBytes = await sourceResponse.arrayBuffer();

        if (sourceBytes.byteLength > 15 * 1024 * 1024) {
          return json(
            {
              status: "error",
              message: "La imagen supera el límite de 15 MB.",
            },
            400,
          );
        }

        const input = new FormData();
        input.append(
          "image",
          new Blob([sourceBytes], { type: sourceType }),
          "original-image",
        );

        const processedResponse = await fetch(
          "https://clearbackdrop.com/api/v1/remove-background",
          {
            method: "POST",
            headers: {
              "X-API-Key": env.CLEARBACKDROP_API_KEY,
            },
            body: input,
          },
        );

        if (!processedResponse.ok) {
          const detail = (await processedResponse.text()).slice(0, 500);
          return json(
            {
              status: "error",
              message: "ClearBackdrop no pudo procesar la imagen.",
              detail,
            },
            502,
          );
        }

        const processedType = (
          processedResponse.headers.get("Content-Type") || ""
        ).toLowerCase();

        if (!processedType.includes("image/png")) {
          return json(
            {
              status: "error",
              message: "El servicio no devolvió un PNG transparente.",
            },
            502,
          );
        }

        const pngBytes = await processedResponse.arrayBuffer();

        if (!pngBytes.byteLength || pngBytes.byteLength > 15 * 1024 * 1024) {
          return json(
            {
              status: "error",
              message: "El PNG procesado está vacío o supera 15 MB.",
            },
            502,
          );
        }

        const uploadForm = new FormData();
        uploadForm.append(
          "file",
          new Blob([pngBytes], { type: "image/png" }),
          "product-transparent.png",
        );
        uploadForm.append("folder", "omnia/processed");
        uploadForm.append(
          "public_id",
          `product_${id.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}`,
        );

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            headers: {
              Authorization:
                "Basic " +
                btoa(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`),
            },
            body: uploadForm,
          },
        );

        const cloudinaryData = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
          return json(
            {
              status: "error",
              message: "No se pudo guardar la imagen en Cloudinary.",
            },
            502,
          );
        }

        await env.DB.prepare(
          `INSERT INTO product_image_processing (product_id, original_image_url, processed_image_url, updated_at)
           VALUES (?, ?, ?, CURRENT_TIMESTAMP)
           ON CONFLICT(product_id) DO UPDATE SET
             original_image_url = excluded.original_image_url,
             processed_image_url = excluded.processed_image_url,
             updated_at = CURRENT_TIMESTAMP`
        )
          .bind(id, imageUrl, cloudinaryData.secure_url)
          .run();

        return json({
          status: "success",
          message: "Fondo procesado y PNG guardado en Cloudinary.",
          product_id: id,
          original_image_url: imageUrl,
          processed_image_url: cloudinaryData.secure_url,
        });
      } catch (error) {
        return json(
          {
            status: "error",
            message: error.message || "Error procesando la imagen.",
          },
          500,
        );
      }
    }

        const productDeleteMatch = path.match(
      /^\/api\/admin\/products\/([^/]+)$/
    );

    if (method === "DELETE" && productDeleteMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;

      try {
        const id = decodeURIComponent(productDeleteMatch[1]);
        const product = await getProduct(id);

        if (!product) {
          return json(
            { status: "error", message: "Producto no encontrado." },
            404
          );
        }

        // Eliminar datos locales relacionados, sin tocar Printify.
        await env.DB.batch([
          env.DB.prepare(
            "DELETE FROM product_image_processing WHERE product_id = ?"
          ).bind(id),
          env.DB.prepare(
            "DELETE FROM product_display_settings WHERE product_id = ?"
          ).bind(id),
          env.DB.prepare(
            "DELETE FROM product_channels WHERE product_id = ?"
          ).bind(id),
          env.DB.prepare(
            "DELETE FROM printify_products WHERE printify_id = ?"
          ).bind(id)
        ]);

        return json({
          status: "success",
          message: "Producto eliminado del registro local de OMNIA. El producto original de Printify no se modificó.",
          printify_id: id
        });
      } catch (error) {
        return json({
          status: "error",
          message: "No se pudo eliminar el producto del registro local.",
          detail: String(error?.message || error)
        }, 500);
      }
    }

    const productEditMatch = path.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (["PUT", "PATCH"].includes(method) && productEditMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const id = decodeURIComponent(productEditMatch[1]);
        const existing = await getProduct(id);
        if (!existing)
          return json(
            { status: "error", message: "Producto no encontrado." },
            404,
          );

        const body = await request.json();
        const payload = parsePayload(existing.payload_json);
        const title =
          body.title !== undefined ? String(body.title).trim() : existing.title;
        const description =
          body.description !== undefined
            ? String(body.description)
            : existing.description;

        if (!title)
          return json(
            { status: "error", message: "El título no puede estar vacío." },
            400,
          );
        Object.assign(payload, { title, description });

        if (body.price !== undefined) {
          const price = Number(body.price);
          if (!Number.isFinite(price) || price < 0)
            return json({ status: "error", message: "Precio no válido." }, 400);
          payload.price = Math.round(price * 100);
          payload.variants = [
            {
              id: `${id}_variant_1`,
              title: "Predeterminado",
              price: Math.round(price * 100),
              is_enabled: true,
              is_available: true,
            },
          ];
        }

        await env.DB.prepare(
          `UPDATE printify_products SET title = ?, description = ?, payload_json = ?, updated_at = CURRENT_TIMESTAMP WHERE printify_id = ?`
        )
          .bind(title, description, JSON.stringify(payload), id)
          .run();

        return json({
          status: "success",
          message: "Producto actualizado.",
          product: { ...existing, title, description, payload },
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && channelsMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const id = decodeURIComponent(channelsMatch[1]);
        const body = await request.json();
        const channel = String(body.channel || "")
          .trim()
          .toLowerCase();
        const allowedChannels = ["omnia", "shopify", "amazon", "bonanza"];

        if (!allowedChannels.includes(channel))
          return json({ status: "error", message: "Canal no válido." }, 400);
        if (!(await getProduct(id)))
          return json(
            { status: "error", message: "El producto no existe." },
            404,
          );

        const enabled = channel === "omnia" ? 1 : 0;
        const status = channel === "omnia" ? "published" : "pending";

        await env.DB.prepare(
          `INSERT INTO product_channels (product_id, channel, enabled, status, published_at, updated_at)
           VALUES (?, ?, ?, ?, CASE WHEN ? = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END, CURRENT_TIMESTAMP)
           ON CONFLICT(product_id, channel) DO UPDATE SET
             enabled = excluded.enabled,
             status = excluded.status,
             published_at = CASE WHEN excluded.status = 'published' THEN CURRENT_TIMESTAMP ELSE product_channels.published_at END,
             updated_at = CURRENT_TIMESTAMP`
        )
          .bind(id, channel, enabled, status, status)
          .run();

        return json({
          status: "success",
          channel,
          enabled,
          publication_status: status,
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    const deleteChannelMatch = path.match(
      /^\/api\/admin\/products\/([^/]+)\/channels\/([^/]+)$/,
    );
    if (method === "DELETE" && deleteChannelMatch) {
      const authError = requireAdmin(request);
      if (authError) return authError;
      try {
        const id = decodeURIComponent(deleteChannelMatch[1]);
        const channel = decodeURIComponent(deleteChannelMatch[2])
          .trim()
          .toLowerCase();
        await env.DB.prepare(
          `DELETE FROM product_channels WHERE product_id = ? AND channel = ?`
        )
          .bind(id, channel)
          .run();
        return json({
          status: "success",
          message: `Canal ${channel} retirado.`,
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && path === "/api/webhooks/printify") {
      try {
        const rawBody = await request.text();
        const signature =
          request.headers.get("X-Pfy-Signature") ||
          request.headers.get("X-Printify-Signature") ||
          "";
        if (!(await verifyPrintifySignature(rawBody, signature))) {
          return json({ status: "error", message: "Firma no válida." }, 401);
        }
        const event = JSON.parse(rawBody);
        const resourceId =
          event.resource && typeof event.resource === "object"
            ? event.resource.id
            : event.resource;
        if (!resourceId)
          return json({ status: "success", message: "Evento sin ID." });

        const response = await printifyRequest(
          `/shops/${env.PRINTIFY_SHOP_ID}/products/${encodeURIComponent(String(resourceId))}.json`,
        );
        if (!response.ok)
          return json(
            { status: "error", message: "No se pudo recuperar de Printify." },
            502,
          );

        const product = await response.json();
        await saveProduct(product, env.PRINTIFY_SHOP_ID);
        return json({
          status: "success",
          message: "Webhook procesado.",
          printify_id: String(product.id),
        });
      } catch (error) {
        return json({ status: "error", message: error.message }, 500);
      }
    }

    if (method === "POST" && path === "/api/webhooks/printify/setup") {
      const authError = requireAdmin(request);
      if (authError) return authError;
      return json({
        status: "manual_setup_required",
        webhook_url: `${url.origin}/api/webhooks/printify`,
      });
    }

// PayPal: crear pedidos con precios calculados en el servidor.
    if (method === "POST" && path === "/api/payments/paypal/create-order") {
      let localOrderId = null;
      try {
        if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
          return json({ status: "error", message: "PayPal no está configurado." }, 503);
        }

        const body = await parsePayload(await request.text());
        if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) {
          return json({ status: "error", message: "Artículos inválidos." }, 400);
        }

        const validated = [];
        let totalCents = 0;

        for (const item of body.items) {
          const productId = String(item.printify_product_id || "");
          const variantId = String(item.variant_id || "");
          const quantity = Number(item.quantity);

          if (!productId || !variantId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
            return json({ status: "error", message: "Artículo o cantidad inválidos." }, 400);
          }

          const product = await getPublicProduct(productId);
          if (!product) {
            return json({ status: "error", message: "Un producto ya no está disponible." }, 400);
          }

          const normalized = normalizePublicProduct(product);
          const variants = Array.isArray(normalized.variants) ? normalized.variants : [];
          const variant = variants.find(v =>
            v && String(v.id) === variantId &&
            v.is_enabled !== false && v.is_available !== false
          );

          const priceCents = Number(variant && variant.price);
          if (!variant || !Number.isSafeInteger(priceCents) || priceCents <= 0) {
            return json({ status: "error", message: "Variante o precio inválido." }, 400);
          }

          const lineCents = priceCents * quantity;
          if (!Number.isSafeInteger(lineCents) || !Number.isSafeInteger(totalCents + lineCents)) {
            return json({ status: "error", message: "Importe fuera de rango." }, 400);
          }

          totalCents += lineCents;
          validated.push({
            productId,
            variantId,
            title: String(normalized.title || "Producto OMNIA").slice(0, 250),
            quantity,
            priceCents,
            lineCents
          });
        }

        if (totalCents <= 0) {
          return json({ status: "error", message: "Importe inválido." }, 400);
        }

        localOrderId = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO orders
           (id, status, currency, subtotal_cents, total_cents, payment_provider,
            payment_status, fulfillment_status, created_at, updated_at)
           VALUES (?, 'pending', 'USD', ?, ?, 'paypal', 'pending', 'pending',
                   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        ).bind(localOrderId, totalCents, totalCents).run();

        for (const item of validated) {
          await env.DB.prepare(
            `INSERT INTO order_items
             (order_id, product_id, printify_product_id, variant_id, product_title,
              quantity, unit_price_cents, line_total_cents, fulfillment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
          ).bind(
            localOrderId, item.productId, item.productId, item.variantId,
            item.title, item.quantity, item.priceCents, item.lineCents
          ).run();
        }

        const credentials = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
        const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "grant_type=client_credentials"
        });

        if (!tokenResponse.ok) throw new Error("PayPal OAuth failed");
        const tokenData = await tokenResponse.json();

        const paypalResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
            "PayPal-Request-Id": localOrderId
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
              custom_id: localOrderId,
              invoice_id: localOrderId,
              amount: {
                currency_code: "USD",
                value: (totalCents / 100).toFixed(2)
              }
            }]
          })
        });

        const paypalData = await paypalResponse.json();
        if (!paypalResponse.ok || !paypalData.id) {
          throw new Error("PayPal order creation failed");
        }

        const savePayPalOrder = await env.DB.prepare(
          `UPDATE orders SET paypal_order_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
        ).bind(paypalData.id, localOrderId).run();

        if (savePayPalOrder.meta?.changes !== 1) {
          throw new Error("Could not persist PayPal order ID");
        }

        return json({
          status: "success",
          orderID: paypalData.id,
          localOrderId
        });
      } catch (error) {
        console.error("PayPal create-order error:", error.message);
        if (localOrderId) {
          try {
            await env.DB.prepare(
              `UPDATE orders
               SET status = 'payment_failed', payment_status = 'failed',
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = ? AND payment_status = 'pending'`
            ).bind(localOrderId).run();
          } catch (cleanupError) {
            console.error("PayPal order cleanup error:", cleanupError.message);
          }
        }
        return json({
          status: "error",
          message: "No se pudo crear el pedido. Comprueba la configuración y vuelve a intentarlo."
        }, 502);
      }
    }

    // PayPal: capturar y verificar el importe antes de marcar el pedido como pagado.
    if (method === "POST" && path === "/api/payments/paypal/capture-order") {
      try {
        if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
          return json({ status: "error", message: "PayPal no está configurado." }, 503);
        }

        const body = await parsePayload(await request.text());
        const localOrderId = String(body.localOrderId || "");
        const paypalOrderId = String(body.orderID || "");

        if (!localOrderId || !paypalOrderId) {
          return json({ status: "error", message: "Faltan los datos del pedido." }, 400);
        }

        const order = await env.DB.prepare(
          `SELECT id, paypal_order_id, status, payment_status, total_cents
           FROM orders WHERE id = ? LIMIT 1`
        ).bind(localOrderId).first();

        if (!order || order.paypal_order_id !== paypalOrderId) {
          return json({ status: "error", message: "Pedido no válido." }, 400);
        }

        if (order.payment_status === "captured" && order.status === "paid") {
          return json({ status: "success", paid: true, localOrderId, alreadyCaptured: true });
        }

        const credentials = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
        const tokenResponse = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "grant_type=client_credentials"
        });

        if (!tokenResponse.ok) throw new Error("PayPal OAuth failed");
        const tokenData = await tokenResponse.json();

        const captureResponse = await fetch(
          `https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
              "PayPal-Request-Id": `capture-${localOrderId}`
            },
            body: "{}"
          }
        );

        let captureData = await captureResponse.json();

        // Si la captura respondió con error o la respuesta fue ambigua,
        // consultar PayPal antes de declarar que el pago falló.
        if (!captureResponse.ok || captureData.status !== "COMPLETED") {
          const verifyResponse = await fetch(
            `https://api-m.paypal.com/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json"
              }
            }
          );

          if (verifyResponse.ok) {
            const verifiedOrder = await verifyResponse.json();
            if (verifiedOrder.status === "COMPLETED") {
              captureData = verifiedOrder;
            } else {
              return json({
                status: "error",
                message: "PayPal aún no confirma el pago. Verifica el estado antes de reintentar."
              }, 409);
            }
          } else {
            return json({
              status: "error",
              message: "No se pudo verificar el estado del pago. Comprueba PayPal antes de reintentar."
            }, 502);
          }
        }

        const purchaseUnit = (captureData.purchase_units || []).find(
          unit => unit.custom_id === localOrderId || unit.invoice_id === localOrderId
        );
        const capture = purchaseUnit &&
          purchaseUnit.payments &&
          (purchaseUnit.payments.captures || []).find(c => c.status === "COMPLETED");

        if (
          !purchaseUnit || !capture || !capture.amount ||
          capture.amount.currency_code !== "USD" ||
          Math.round(Number(capture.amount.value) * 100) !== Number(order.total_cents)
        ) {
          return json({
            status: "error",
            message: "No se pudo verificar el importe capturado. El pedido requiere revisión."
          }, 409);
        }

        const captureId = String(capture.id || paypalOrderId);
        const payerName = [
          captureData.payer && captureData.payer.name && captureData.payer.name.given_name,
          captureData.payer && captureData.payer.name && captureData.payer.name.surname
        ].filter(Boolean).join(" ").slice(0, 250);
        const payerEmail = String(
          captureData.payer && captureData.payer.email_address || ""
        ).slice(0, 250);

        const markPaidResult = await env.DB.prepare(
          `UPDATE orders
           SET status = 'paid', payment_status = 'captured',
               payer_name = ?, payer_email = ?, paid_at = CURRENT_TIMESTAMP,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ? AND paypal_order_id = ?
             AND payment_status != 'captured'`
        ).bind(payerName, payerEmail, localOrderId, paypalOrderId).run();

        if (markPaidResult.meta?.changes !== 1) {
          const latestOrder = await env.DB.prepare(
            `SELECT status, payment_status, paypal_order_id
             FROM orders WHERE id = ?`
          ).bind(localOrderId).first();

          if (
            !latestOrder ||
            latestOrder.paypal_order_id !== paypalOrderId ||
            latestOrder.status !== "paid" ||
            latestOrder.payment_status !== "captured"
          ) {
            return json({
              status: "error",
              message: "No se pudo verificar el registro del pago. Comprueba PayPal antes de reintentar."
            }, 409);
          }
        }

        const eventResult = await env.DB.prepare(
          `INSERT OR IGNORE INTO payment_events
           (order_id, provider, provider_event_id, event_type, payload_json)
           VALUES (?, 'paypal', ?, 'PAYMENT.CAPTURE.COMPLETED', ?)`
        ).bind(localOrderId, captureId, JSON.stringify({
          paypal_order_id: paypalOrderId,
          capture_id: captureId,
          amount: capture.amount
        })).run();

        if (eventResult.meta?.changes !== 1) {
          const existingEvent = await env.DB.prepare(
            `SELECT order_id FROM payment_events
             WHERE provider = 'paypal' AND provider_event_id = ?
             LIMIT 1`
          ).bind(captureId).first();

          if (!existingEvent || existingEvent.order_id !== localOrderId) {
            console.error("PayPal capture event was not recorded:", localOrderId);
            return json({
              status: "error",
              paid: true,
              message: "El pago fue confirmado, pero su registro requiere revisión. No vuelvas a pagar."
            }, 500);
          }
        }

        return json({ status: "success", paid: true, localOrderId });
      } catch (error) {
        console.error("PayPal capture error:", error.message);
        return json({
          status: "error",
          message: "No se pudo confirmar el pago. Verifica el estado en PayPal antes de reintentar."
        }, 502);
      }
    }


    return json({ status: "error", message: "Ruta no encontrada." }, 404);
  },
};
