// worker.js
var PRINTIFY_API_BASE = "https://api.printify.com/v1";
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Secret"
    };
    const jsonHeaders = {
      "Content-Type": "application/json",
      ...corsHeaders
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    const adminProtectedPath = url.pathname.startsWith("/api/admin/") || request.method === "POST" && url.pathname === "/api/webhooks/printify/setup";
    if (adminProtectedPath) {
      if (!env.ADMIN_SECRET) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "ADMIN_SECRET no est\xE1 configurado."
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
      const authorization = request.headers.get("Authorization") || "";
      const bearerSecret = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
      const headerSecret = (request.headers.get("X-Admin-Secret") || "").trim();
      const authorized = [
        headerSecret,
        bearerSecret
      ].some((secret) => secret && secret === env.ADMIN_SECRET);
      if (!authorized) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "No autorizado."
          }),
          { status: 401, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "success",
          app: "OMNIA Marketplace API",
          message: "OMNIA API funcionando correctamente."
        }),
        { status: 200, headers: jsonHeaders }
      );
    }
    if (request.method === "GET" && url.pathname === "/api/printify/shops") {
      try {
        if (!env.PRINTIFY_API_KEY) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "La variable PRINTIFY_API_KEY no est\xE1 configurada."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const response = await fetch(
          `${PRINTIFY_API_BASE}/shops.json`,
          {
            headers: {
              Authorization: `Bearer ${env.PRINTIFY_API_KEY}`
            }
          }
        );
        const data = await response.json();
        return new Response(
          JSON.stringify({
            status: response.ok ? "success" : "error",
            shops: data
          }),
          {
            status: response.ok ? 200 : response.status,
            headers: jsonHeaders
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "GET" && url.pathname === "/api/printify/products") {
      try {
        if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no est\xE1n configuradas."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const page = Math.max(
          1,
          Number(url.searchParams.get("page") || 1)
        );
        const response = await fetch(
          `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/products.json?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${env.PRINTIFY_API_KEY}`
            }
          }
        );
        const data = await response.json();
        return new Response(
          JSON.stringify({
            status: response.ok ? "success" : "error",
            page,
            products: data
          }),
          {
            status: response.ok ? 200 : response.status,
            headers: jsonHeaders
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "POST" && url.pathname === "/api/sync/printify") {
      try {
        if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no est\xE1n configuradas."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const body = await request.json();
        const printifyId = body.printify_id || body.id;
        if (!printifyId) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Falta printify_id."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const response = await fetch(
          `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/products/${encodeURIComponent(String(printifyId))}.json`,
          {
            headers: {
              Authorization: `Bearer ${env.PRINTIFY_API_KEY}`
            }
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          return new Response(
            JSON.stringify({
              status: "error",
              message: "No se pudo obtener el producto desde Printify.",
              detail: errorText
            }),
            { status: response.status, headers: jsonHeaders }
          );
        }
        const product = await response.json();
        await env.DB.prepare(`
                    INSERT INTO printify_products (
                        printify_id, shop_id, title, description,
                        status, payload_json, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(printify_id) DO UPDATE SET
                        shop_id = excluded.shop_id,
                        title = excluded.title,
                        description = excluded.description,
                        status = excluded.status,
                        payload_json = excluded.payload_json,
                        updated_at = CURRENT_TIMESTAMP
                `).bind(
          String(product.id),
          String(env.PRINTIFY_SHOP_ID),
          product.title || "",
          product.description || "",
          product.status || "",
          JSON.stringify(product)
        ).run();
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Producto Printify sincronizado correctamente.",
            printify_id: product.id
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "POST" && url.pathname === "/api/sync/printify-all") {
      try {
        if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no est\xE1n configuradas."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        let page = 1;
        let total = 0;
        let pages = 0;
        while (true) {
          const response = await fetch(
            `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/products.json?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${env.PRINTIFY_API_KEY}`
              }
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            return new Response(
              JSON.stringify({
                status: "error",
                message: "Error obteniendo productos de Printify.",
                detail: errorText,
                page
              }),
              { status: response.status, headers: jsonHeaders }
            );
          }
          const data = await response.json();
          const products = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
          if (!products.length) break;
          for (const product of products) {
            if (!product || !product.id) continue;
            await env.DB.prepare(`
                            INSERT INTO printify_products (
                                printify_id, shop_id, title, description,
                                status, payload_json, updated_at
                            )
                            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                            ON CONFLICT(printify_id) DO UPDATE SET
                                shop_id = excluded.shop_id,
                                title = excluded.title,
                                description = excluded.description,
                                status = excluded.status,
                                payload_json = excluded.payload_json,
                                updated_at = CURRENT_TIMESTAMP
                        `).bind(
              String(product.id),
              String(env.PRINTIFY_SHOP_ID),
              product.title || "",
              product.description || "",
              product.status || "",
              JSON.stringify(product)
            ).run();
            total++;
          }
          pages++;
          if (!data.last_page && products.length < 100) break;
          if (data.last_page && page >= Number(data.last_page)) break;
          page++;
        }
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Sincronizaci\xF3n completa de Printify finalizada.",
            products_synced: total,
            pages
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "GET" && (url.pathname === "/api/catalog/omnia" || url.pathname === "/api/catalog/products")) {
      try {
        const { results } = await env.DB.prepare(`
                    SELECT
                        p.printify_id,
                        p.shop_id,
                        p.title,
                        p.description,
                        p.status,
                        p.payload_json,
                        p.updated_at,
                        EXISTS (
                            SELECT 1
                            FROM product_channels pc
                            WHERE pc.product_id = p.printify_id
                              AND pc.enabled = 1
                              AND pc.status = 'published'
                              AND pc.channel = 'omnia'
                        ) AS is_published
                    FROM printify_products p
                    WHERE EXISTS (
                        SELECT 1
                        FROM product_channels pc
                        WHERE pc.product_id = p.printify_id
                          AND pc.enabled = 1
                          AND pc.status = 'published'
                          AND pc.channel = 'omnia'
                    )
                    ORDER BY p.updated_at DESC
                `).all();
        const products = (results || []).map((product) => {
          let payload = {};
          try {
            payload = JSON.parse(product.payload_json || "{}");
          } catch (error) {
            payload = {};
          }
          const variants = Array.isArray(payload.variants) ? payload.variants : [];
          const enabledVariants = variants.filter(
            (variant) => variant && variant.is_enabled === true && variant.is_available !== false
          );
          const firstVariant = enabledVariants[0] || variants[0] || null;
          const rawPrice = firstVariant && firstVariant.price ? Number(firstVariant.price) : 0;
          const price = rawPrice > 100 ? rawPrice / 100 : rawPrice;
          const images = Array.isArray(payload.images) ? payload.images : [];
          const defaultImage = images.find(
            (image) => image && image.is_default === true && image.src
          ) || images.find((image) => image && image.src);
          return {
            id: product.printify_id,
            printify_id: product.printify_id,
            shop_id: product.shop_id,
            title: product.title || payload.title || "",
            description: product.description || payload.description || "",
            status: product.status || payload.status || "",
            price,
            image: defaultImage ? defaultImage.src : "",
            images,
            variants: variants.map((variant) => ({
              ...variant,
              enabled: variant.is_enabled === true
            })),
            is_published: Number(product.is_published) === 1,
            updated_at: product.updated_at,
            ...payload
          };
        });
        return new Response(
          JSON.stringify({
            status: "success",
            products
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/catalog/products/")) {
      try {
        const printifyId = decodeURIComponent(
          url.pathname.replace("/api/catalog/products/", "")
        );
        if (!printifyId) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Falta el ID de Printify."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const product = await env.DB.prepare(`
                    SELECT
                        printify_id,
                        shop_id,
                        title,
                        description,
                        status,
                        payload_json,
                        updated_at
                    FROM printify_products
                    WHERE printify_id = ?
                      AND EXISTS (
                          SELECT 1
                          FROM product_channels pc
                          WHERE pc.product_id = printify_products.printify_id
                            AND pc.channel = 'omnia'
                            AND pc.enabled = 1
                            AND pc.status = 'published'
                      )
                    LIMIT 1
                `).bind(printifyId).first();
        if (!product) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Producto no encontrado."
            }),
            { status: 404, headers: jsonHeaders }
          );
        }
        let payload = {};
        try {
          payload = JSON.parse(product.payload_json || "{}");
        } catch (error) {
          payload = {};
        }
        return new Response(
          JSON.stringify({
            status: "success",
            product: {
              ...payload,
              printify_id: product.printify_id,
              shop_id: product.shop_id,
              title: product.title || payload.title || "",
              description: product.description || payload.description || "",
              status: product.status || payload.status || "",
              updated_at: product.updated_at
            }
          }),
          { status: 200, headers: jsonHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            status: "error",
            message: error.message
          }),
          { status: 500, headers: jsonHeaders }
        );
      }
    }
    if (request.method === "POST" && url.pathname === "/api/webhooks/printify/setup") {
      try {
        if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
          return new Response(
            JSON.stringify({
              status: "error",
              message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no est\xE1n configuradas."
            }),
            { status: 400, headers: jsonHeaders }
          );
        }
        const webhookUrl = `${url.origin}/api/webhooks/printify`;
        const topics = [
          "product:created",
          "product:updated",
          "product:deleted",
          "product:publish:started"
        ];
        const created = [];
        const alreadyExists = [];
        const errors = [];
        const existingResponse = await fetch(
          `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/webhooks.json`,
          {
            headers: {
              Authorization: `Bearer ${env.PRINTIFY_API_KEY}`
            }
          }
        );
        if (!existingResponse.ok) {
          const errorText = await existingResponse.text();
          return new Response(
            JSON.stringify({
              status: "error",
              message: "No se pudieron consultar los webhooks existentes de Printify.",
              http_status: existingResponse.status,
              detail: errorText
            }),
            {
              status: existingResponse.status,
              headers: jsonHeaders
            }
          );
        }
        const existingData = await existingResponse.json();
        const existingWebhooks = Array.isArray(existingData) ? existingData : Array.isArray(existingData.data) ? existingData.data : [];
        for (const topic of topics) {
          const exists = existingWebhooks.find(
            (webhook) => webhook && webhook.topic === topic && webhook.url === webhookUrl
          );
          if (exists) {
            alreadyExists.push({
              topic,
              url: webhookUrl,
              shop_id: env.PRINTIFY_SHOP_ID,
              id: exists.id
            });
            continue;
          }
          const response = await fetch(
            `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/webhooks.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${env.PRINTIFY_API_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                topic,
                url: webhookUrl
              })
            }
          );
          const responseText = await response.text();
          let data = {};
          try {
            data = responseText ? JSON.parse(responseText) : {};
          } catch (error) {
            data = { response: responseText };
          }
          if (response.ok) {
            created.push({
              topic,
              url: webhookUrl,
              shop_id: env.PRINTIFY_SHOP_ID,
              id: data.id || null
            });
          } else {
            errors.push({
              topic,
              http_status: response.status,
              detail: data
            });
          }
        }
        return new Response(
          JSON.stringify({
          
