const PRINTIFY_API_BASE = "https://api.printify.com/v1";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
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

        if (request.method === "GET" && url.pathname === "/") {
            if (env.ASSETS) {
                return await env.ASSETS.fetch(request);
            }

            return new Response(
                JSON.stringify({
                    status: "success",
                    app: "OMNIA Marketplace API",
                    message: "OMNIA API funcionando correctamente."
                }),
                {
                    status: 200,
                    headers: jsonHeaders
                }
            );
        }

        if (request.method === "GET" && url.pathname === "/api/printify/shops") {
            try {
                if (!env.PRINTIFY_API_KEY) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "La variable PRINTIFY_API_KEY no está configurada."
                        }),
                        { status: 400, headers: jsonHeaders }
                    );
                }

                const response = await fetch(
                    `${PRINTIFY_API_BASE}/shops.json`,
                    {
                        headers: {
                            "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`
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
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "GET" &&
            url.pathname === "/api/printify/products"
        ) {
            try {
                if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no están configuradas."
                        }),
                        { status: 400, headers: jsonHeaders }
                    );
                }

                const page = Number(url.searchParams.get("page") || 1);

                const response = await fetch(
                    `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/products.json?page=${page}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`
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
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "POST" &&
            url.pathname === "/api/sync/printify"
        ) {
            try {
                if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no están configuradas."
                        }),
                        { status: 400, headers: jsonHeaders }
                    );
                }

                const body = await request.json();

                const printifyId =
                    body.printify_id ||
                    body.id;

                if (!printifyId) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Falta printify_id."
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                const response = await fetch(
                    `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/products/${encodeURIComponent(printifyId)}.json`,
                    {
                        headers: {
                            "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`
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
                        {
                            status: response.status,
                            headers: jsonHeaders
                        }
                    );
                }

                const product = await response.json();

                await env.DB.prepare(`
                    INSERT INTO printify_products (
                        printify_id,
                        shop_id,
                        title,
                        description,
                        status,
                        payload_json,
                        updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(printify_id)
                    DO UPDATE SET
                        shop_id = excluded.shop_id,
                        title = excluded.title,
                        description = excluded.description,
                        status = excluded.status,
                        payload_json = excluded.payload_json,
                        updated_at = CURRENT_TIMESTAMP
                `)
                    .bind(
                        String(product.id),
                        String(env.PRINTIFY_SHOP_ID),
                        product.title || "",
                        product.description || "",
                        product.status || "",
                        JSON.stringify(product)
                    )
                    .run();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message: "Producto Printify sincronizado correctamente.",
                        printify_id: product.id
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "POST" &&
            url.pathname === "/api/sync/printify-all"
        ) {
            try {
                if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no están configuradas."
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
                                "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`
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
                            {
                                status: response.status,
                                headers: jsonHeaders
                            }
                        );
                    }

                    const data = await response.json();

                    const products =
                        Array.isArray(data)
                            ? data
                            : Array.isArray(data.data)
                                ? data.data
                                : [];

                    if (!products.length) {
                        break;
                    }

                    for (const product of products) {
                        if (!product || !product.id) {
                            continue;
                        }

                        await env.DB.prepare(`
                            INSERT INTO printify_products (
                                printify_id,
                                shop_id,
                                title,
                                description,
                                status,
                                payload_json,
                                updated_at
                            )
                            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                            ON CONFLICT(printify_id)
                            DO UPDATE SET
                                shop_id = excluded.shop_id,
                                title = excluded.title,
                                description = excluded.description,
                                status = excluded.status,
                                payload_json = excluded.payload_json,
                                updated_at = CURRENT_TIMESTAMP
                        `)
                            .bind(
                                String(product.id),
                                String(env.PRINTIFY_SHOP_ID),
                                product.title || "",
                                product.description || "",
                                product.status || "",
                                JSON.stringify(product)
                            )
                            .run();

                        total++;
                    }

                    pages++;

                    if (
                        !data.last_page &&
                        products.length < 100
                    ) {
                        break;
                    }

                    if (
                        data.last_page &&
                        page >= Number(data.last_page)
                    ) {
                        break;
                    }

                    page++;
                }

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message: "Sincronización completa de Printify finalizada.",
                        products_synced: total,
                        pages
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "GET" &&
            (
                url.pathname === "/api/catalog/omnia" ||
                url.pathname === "/api/catalog/products"
            )
        ) {
            try {
                const { results } = await env.DB.prepare(`
                    SELECT
                        printify_id,
                        shop_id,
                        title,
                        description,
                        status,
                        payload_json,
                        updated_at
                    FROM printify_products
                    ORDER BY updated_at DESC
                `).all();

                const products = (results || []).map(product => {
                    let payload = {};

                    try {
                        payload = JSON.parse(
                            product.payload_json || "{}"
                        );
                    } catch (error) {
                        payload = {};
                    }

                    const variants =
                        Array.isArray(payload.variants)
                            ? payload.variants
                            : [];

                    const enabledVariants =
                        variants.filter(variant =>
                            variant &&
                            variant.is_enabled === true &&
                            variant.is_available !== false
                        );

                    const firstVariant =
                        enabledVariants[0] ||
                        variants[0] ||
                        null;

                    const price =
                        firstVariant &&
                        Number.isFinite(Number(firstVariant.price))
                            ? Number(firstVariant.price)
                            : 0;

                    const images =
                        Array.isArray(payload.images)
                            ? payload.images
                            : [];

                    const defaultImage =
                        images.find(image =>
                            image &&
                            image.is_default === true &&
                            image.src
                        ) ||
                        images.find(image =>
                            image &&
                            image.src
                        );

                    return {
                        id: product.printify_id,
                        printify_id: product.printify_id,
                        shop_id: product.shop_id,
                        title: product.title || payload.title || "",
                        description:
                            product.description ||
                            payload.description ||
                            "",
                        status:
                            product.status ||
                            payload.status ||
                            "",
                        price,
                        image:
                            defaultImage
                                ? defaultImage.src
                                : "",
                        updated_at: product.updated_at
                    };
                });

                return new Response(
                    JSON.stringify({
                        status: "success",
                        products
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "GET" &&
            url.pathname.startsWith("/api/catalog/products/")
        ) {
            try {
                const printifyId =
                    decodeURIComponent(
                        url.pathname.replace(
                            "/api/catalog/products/",
                            ""
                        )
                    );

                if (!printifyId) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Falta el ID de Printify."
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                const product =
                    await env.DB.prepare(`
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
                        LIMIT 1
                    `)
                        .bind(printifyId)
                        .first();

                if (!product) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Producto no encontrado."
                        }),
                        {
                            status: 404,
                            headers: jsonHeaders
                        }
                    );
                }

                let payload = {};

                try {
                    payload = JSON.parse(
                        product.payload_json || "{}"
                    );
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
                            title:
                                product.title ||
                                payload.title ||
                                "",
                            description:
                                product.description ||
                                payload.description ||
                                "",
                            status:
                                product.status ||
                                payload.status ||
                                "",
                            updated_at: product.updated_at
                        }
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "POST" &&
            url.pathname === "/api/webhooks/printify/setup"
        ) {
            try {
                if (!env.PRINTIFY_API_KEY || !env.PRINTIFY_SHOP_ID) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Las variables PRINTIFY_API_KEY o PRINTIFY_SHOP_ID no están configuradas."
                        }),
                        { status: 400, headers: jsonHeaders }
                    );
                }

                const webhookUrl =
                    `${url.origin}/api/webhooks/printify`;

                const topics = [
                    "product:created",
                    "product:updated",
                    "product:deleted",
                    "product:publish:started"
                ];

                const created = [];
                const alreadyExists = [];

                const existingResponse = await fetch(
                    `${PRINTIFY_API_BASE}/shops/${env.PRINTIFY_SHOP_ID}/webhooks.json`,
                    {
                        headers: {
                            "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`
                        }
                    }
                );

                let existingWebhooks = [];

                if (existingResponse.ok) {
                    const existingData =
                        await existingResponse.json();

                    existingWebhooks =
                        Array.isArray(existingData)
                            ? existingData
                            : Array.isArray(existingData.data)
                                ? existingData.data
                                : [];
                }

                for (const topic of topics) {
                    const exists = existingWebhooks.find(webhook =>
                        webhook &&
                        webhook.topic === topic &&
                        webhook.url === webhookUrl
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
                                "Authorization": `Bearer ${env.PRINTIFY_API_KEY}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                topic,
                                url: webhookUrl
                            })
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {
                        created.push({
                            topic,
                            url: webhookUrl,
                            shop_id: env.PRINTIFY_SHOP_ID,
                            id: data.id || null
                        });
                    }
                }

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message:
                            "Webhooks automáticos de Printify configurados correctamente.",
                        webhook_url: webhookUrl,
                        created,
                        already_exists: alreadyExists
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "POST" &&
            url.pathname === "/api/webhooks/printify"
        ) {
            try {
                const body = await request.json();

                const topic =
                    body.topic ||
                    body.type ||
                    "";

                const product =
                    body.resource ||
                    body.product ||
                    body.data ||
                    body;

                const printifyId =
                    product &&
                    (
                        product.id ||
                        product.printify_id
                    );

                if (topic === "product:deleted") {
                    if (printifyId) {
                        await env.DB.prepare(`
                            DELETE FROM printify_products
                            WHERE printify_id = ?
                        `)
                            .bind(String(printifyId))
                            .run();
                    }

                    return new Response(
                        JSON.stringify({
                            status: "success",
                            message: "Producto eliminado de D1 correctamente.",
                            printify_id: printifyId || null
                        }),
                        {
                            status: 200,
                            headers: jsonHeaders
                        }
                    );
                }

                if (!printifyId) {
                    return new Response(
                        JSON.stringify({
                            status: "success",
                            message: "Webhook recibido sin producto procesable."
                        }),
                        {
                            status: 200,
                            headers: jsonHeaders
                        }
                    );
                }

                await env.DB.prepare(`
                    INSERT INTO printify_products (
                        printify_id,
                        shop_id,
                        title,
                        description,
                        status,
                        payload_json,
                        updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(printify_id)
                    DO UPDATE SET
                        shop_id = excluded.shop_id,
                        title = excluded.title,
                        description = excluded.description,
                        status = excluded.status,
                        payload_json = excluded.payload_json,
                        updated_at = CURRENT_TIMESTAMP
                `)
                    .bind(
                        String(printifyId),
                        String(
                            product.shop_id ||
                            body.shop_id ||
                            env.PRINTIFY_SHOP_ID
                        ),
                        product.title || "",
                        product.description || "",
                        product.status || "",
                        JSON.stringify(product)
                    )
                    .run();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message: "Webhook Printify procesado correctamente.",
                        topic,
                        printify_id: printifyId
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }


        if (
            request.method === "GET" &&
            url.pathname === "/api/admin/products"
        ) {
            try {
                const { results } = await env.DB.prepare(`
                    SELECT
                        p.printify_id,
                        p.shop_id,
                        p.title,
                        p.description,
                        p.status,
                        p.updated_at,
                        COUNT(pc.id) AS channel_count
                    FROM printify_products p
                    LEFT JOIN product_channels pc
                        ON pc.product_id = p.printify_id
                        AND pc.enabled = 1
                    GROUP BY
                        p.printify_id,
                        p.shop_id,
                        p.title,
                        p.description,
                        p.status,
                        p.updated_at
                    ORDER BY p.updated_at DESC
                `).all();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        products: results || []
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "GET" &&
            url.pathname.match(
                /^\/api\/admin\/products\/[^/]+\/channels$/
            )
        ) {
            try {
                const printifyId = decodeURIComponent(
                    url.pathname.split("/")[4] || ""
                );

                if (!printifyId) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Falta el ID del producto."
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                const { results } = await env.DB.prepare(`
                    SELECT
                        id,
                        product_id,
                        channel,
                        enabled,
                        status,
                        external_product_id,
                        published_at,
                        created_at,
                        updated_at
                    FROM product_channels
                    WHERE product_id = ?
                    ORDER BY channel ASC
                `)
                    .bind(printifyId)
                    .all();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        product_id: printifyId,
                        channels: results || []
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "POST" &&
            url.pathname.match(
                /^\/api\/admin\/products\/[^/]+\/channels$/
            )
        ) {
            try {
                const printifyId = decodeURIComponent(
                    url.pathname.split("/")[4] || ""
                );

                const body = await request.json();

                const channel = String(
                    body.channel || ""
                ).trim().toLowerCase();

                const allowedChannels = [
                    "omnia",
                    "shopify",
                    "amazon",
                    "bonanza"
                ];

                if (!printifyId) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Falta el ID del producto."
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                if (!allowedChannels.includes(channel)) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Canal no válido.",
                            allowed_channels: allowedChannels
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                const product = await env.DB.prepare(`
                    SELECT
                        printify_id,
                        shop_id,
                        title,
                        description,
                        status
                    FROM printify_products
                    WHERE printify_id = ?
                    LIMIT 1
                `)
                    .bind(printifyId)
                    .first();

                if (!product) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Producto no encontrado."
                        }),
                        {
                            status: 404,
                            headers: jsonHeaders
                        }
                    );
                }

                await env.DB.prepare(`
                    INSERT INTO product_channels (
                        product_id,
                        channel,
                        enabled,
                        status,
                        published_at,
                        updated_at
                    )
                    VALUES (
                        ?,
                        ?,
                        1,
                        'published',
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP
                    )
                    ON CONFLICT(product_id, channel)
                    DO UPDATE SET
                        enabled = 1,
                        status = 'published',
                        published_at =
                            COALESCE(
                                product_channels.published_at,
                                CURRENT_TIMESTAMP
                            ),
                        updated_at = CURRENT_TIMESTAMP
                `)
                    .bind(
                        printifyId,
                        channel
                    )
                    .run();

                const savedChannel = await env.DB.prepare(`
                    SELECT
                        id,
                        product_id,
                        channel,
                        enabled,
                        status,
                        external_product_id,
                        published_at,
                        created_at,
                        updated_at
                    FROM product_channels
                    WHERE product_id = ?
                    AND channel = ?
                    LIMIT 1
                `)
                    .bind(
                        printifyId,
                        channel
                    )
                    .first();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message: "Canal asignado correctamente.",
                        product,
                        channel: savedChannel
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            request.method === "DELETE" &&
            url.pathname.match(
                /^\/api\/admin\/products\/[^/]+\/channels\/[^/]+$/
            )
        ) {
            try {
                const parts = url.pathname.split("/");

                const printifyId = decodeURIComponent(
                    parts[4] || ""
                );

                const channel = decodeURIComponent(
                    parts[6] || ""
                ).trim().toLowerCase();

                if (!printifyId || !channel) {
                    return new Response(
                        JSON.stringify({
                            status: "error",
                            message: "Falta el producto o el canal."
                        }),
                        {
                            status: 400,
                            headers: jsonHeaders
                        }
                    );
                }

                await env.DB.prepare(`
                    DELETE FROM product_channels
                    WHERE product_id = ?
                    AND channel = ?
                `)
                    .bind(
                        printifyId,
                        channel
                    )
                    .run();

                return new Response(
                    JSON.stringify({
                        status: "success",
                        message: "Canal eliminado correctamente.",
                        product_id: printifyId,
                        channel
                    }),
                    {
                        status: 200,
                        headers: jsonHeaders
                    }
                );
            } catch (error) {
                return new Response(
                    JSON.stringify({
                        status: "error",
                        message: error.message
                    }),
                    {
                        status: 500,
                        headers: jsonHeaders
                    }
                );
            }
        }

        if (
            (request.method === "GET" || request.method === "HEAD") &&
            (url.pathname === "/admin" || url.pathname === "/admin/")
        ) {
            return await env.ASSETS.fetch(
                new Request(
                    new URL("/admin/index.html", url),
                    request
                )
            );
        }

        if (env.ASSETS) {
            return await env.ASSETS.fetch(request);
        }

        return new Response(
            JSON.stringify({
                status: "error",
                message: "Ruta no encontrada."
            }),
            {
                status: 404,
                headers: jsonHeaders
            }
        );
    }
};
