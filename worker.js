export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método no permitido.", { status: 405 });
    }

    if (!env.ASSETS) {
      return new Response("Error: ASSETS no está configurado.", {
        status: 500
      });
    }

    if (
      url.pathname === "/" ||
      url.pathname === "/index.html" ||
      url.pathname === "/products" ||
      url.pathname.startsWith("/products/")
    ) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", url), request)
      );
    }

    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      return env.ASSETS.fetch(
        new Request(new URL("/admin/index.html", url), request)
      );
    }

    return env.ASSETS.fetch(request);
  }
};
