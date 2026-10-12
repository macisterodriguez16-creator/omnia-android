// OMNIA Marketplace — Public Frontend Worker

var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método no permitido.", {
        status: 405,
        headers: { "Allow": "GET, HEAD" }
      });
    }

    if (!env.ASSETS) {
      return new Response(
        "OMNIA: no está disponible la vinculación de recursos estáticos ASSETS.",
        {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }
      );
    }

    const pathname = url.pathname;

    // Storefront and product-detail routes
    if (
      pathname === "/" ||
      pathname === "/index.html" ||
      pathname === "/products" ||
      pathname.startsWith("/products/")
    ) {
      const pageUrl = new URL("/index.html", url);
      return env.ASSETS.fetch(new Request(pageUrl, request));
    }

    // Control Center assets
    if (pathname === "/admin" || pathname === "/admin/") {
      return env.ASSETS.fetch(
        new Request(new URL("/admin/index.html", url), request)
      );
    }

    // CSS, JavaScript, images and all other static resources
    return env.ASSETS.fetch(request);
  }
};

export default worker_default;
