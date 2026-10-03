export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // 1. Endpoint API: Obtener tiendas de Printify
      if (path === "/api/printify/shops" && request.method === "GET") {
        const apiKey = env.PRINTIFY_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "PRINTIFY_API_KEY no configurada" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const res = await fetch("https://api.printify.com/v1/shops.json", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        const shops = await res.json();
        return new Response(JSON.stringify(shops), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. Endpoint API: Obtener productos de Printify
      if (path === "/api/printify/products" && request.method === "GET") {
        const apiKey = env.PRINTIFY_API_KEY;
        const shopId = env.PRINTIFY_SHOP_ID || "28386791";

        if (!apiKey) {
          return new Response(JSON.stringify({ error: "PRINTIFY_API_KEY no configurada" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
          headers: { 
            "Authorization": `Bearer ${apiKey}`,
            "User-Agent": "OMNIA-App"
          },
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 3. Servir el Frontend Prémium de ~/omnia-android/omnia-web/
      return await env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
