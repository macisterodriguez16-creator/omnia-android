const API_BACKEND = "https://omnia-api.macisterodriguez16.workers.dev";
const SESSION_COOKIE = "omnia_admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function sessionKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function createSession(secret) {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const key = await sessionKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(expires)
  );
  return `${expires}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function validSession(request, secret) {
  if (!secret || secret.length < 32) return false;

  const cookies = request.headers.get("Cookie") || "";
  const entry = cookies.split(";").map(v => v.trim())
    .find(v => v.startsWith(`${SESSION_COOKIE}=`));

  if (!entry) return false;

  const token = entry.slice(SESSION_COOKIE.length + 1);
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return false;

  try {
    const key = await sessionKey(secret);
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature),
      new TextEncoder().encode(expires)
    );
  } catch {
    return false;
  }
}

function sameOrigin(request, url) {
  return request.headers.get("Origin") === url.origin;
}

function loginPage(message = "") {
  return new Response(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OMNIA — Acceso administrativo</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101114;color:#f5f5f5;font-family:Arial,sans-serif;padding:20px}
main{width:100%;max-width:390px;padding:32px;background:#1b1d22;border:1px solid #34363d;border-radius:16px}
.brand{text-align:center;font-size:38px;margin-bottom:8px}
h1{text-align:center;font-size:21px;margin:0 0 8px}
p{text-align:center;color:#aaa;font-size:14px;margin:0 0 26px}
label{display:block;font-size:13px;margin-bottom:8px}
input{width:100%;padding:14px;border-radius:8px;border:1px solid #454750;background:#111318;color:white;font-size:16px}
button{width:100%;margin-top:18px;padding:14px;border:0;border-radius:8px;background:#fff;color:#111;font-weight:bold;font-size:15px;cursor:pointer}
#error{color:#ff7777;min-height:20px;margin-top:14px;font-size:13px;text-align:center}
</style>
</head>
<body>
<main>
<div class="brand">∞</div>
<h1>OMNIA CONTROL CENTER</h1>
<p>Inicia sesión para continuar</p>
<form id="login">
<label for="password">Contraseña de administrador</label>
<input id="password" type="password" autocomplete="current-password" required autofocus>
<button type="submit">Iniciar sesión</button>
<div id="error" role="alert">${message}</div>
</form>
</main>
<script>
document.getElementById("login").addEventListener("submit", async event => {
  event.preventDefault();
  const error = document.getElementById("error");
  const button = event.target.querySelector("button");
  button.disabled = true;
  error.textContent = "Verificando acceso...";
  try {
    const response = await fetch("/admin-login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: document.getElementById("password").value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo iniciar sesión.");
    location.replace("/admin/");
  } catch (e) {
    error.textContent = e.message;
    button.disabled = false;
  }
});
</script>
</body>
</html>`, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}

async function proxyAdmin(request, env, url) {
  if (!await validSession(request, env.SESSION_SECRET)) {
    return json({ error: "Sesión no válida. Inicia sesión nuevamente." }, 401);
  }

  if (!env.ADMIN_SECRET) {
    return json({ error: "Falta configurar ADMIN_SECRET en el Worker." }, 500);
  }

  const apiPath = url.pathname.slice("/admin-api".length);
  const isProducts = apiPath === "/api/admin/products" ||
    apiPath.startsWith("/api/admin/products/");

  const isPrintifySync =
    apiPath === "/api/sync/printify-all" && request.method === "POST";

  if (!isProducts && !isPrintifySync) {
    return json({ error: "Ruta administrativa no permitida." }, 404);
  }

  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    return json({ error: "Método no permitido." }, 405);
  }

  const target = new URL(API_BACKEND);
  target.pathname = apiPath;
  target.search = url.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${env.ADMIN_SECRET}`);
  headers.set("X-Admin-Secret", env.ADMIN_SECRET);

  const contentType = request.headers.get("Content-Type");
  const accept = request.headers.get("Accept");
  if (contentType) headers.set("Content-Type", contentType);
  if (accept) headers.set("Accept", accept);

  const init = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = request.body;
  }

  return fetch(new Request(target.toString(), init));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (!env.ASSETS) {
      return new Response("Error: ASSETS no está configurado.", { status: 500 });
    }

    if (path === "/admin-login" && request.method === "POST") {
      if (!sameOrigin(request, url)) {
        return json({ error: "Solicitud no permitida." }, 403);
      }

      if (!env.PANEL_PASSWORD || !env.SESSION_SECRET ||
          env.SESSION_SECRET.length < 32) {
        return json({ error: "El acceso administrativo no está configurado." }, 500);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Solicitud inválida." }, 400);
      }

      const supplied = typeof body.password === "string" ? body.password : "";
      if (supplied !== env.PANEL_PASSWORD) {
        return json({ error: "Contraseña incorrecta." }, 401);
      }

      const token = await createSession(env.SESSION_SECRET);
      return json({ success: true }, 200, {
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`
      });
    }

    if (path === "/admin-logout" && request.method === "POST") {
      if (!sameOrigin(request, url)) {
        return json({ error: "Solicitud no permitida." }, 403);
      }

      return json({ success: true }, 200, {
        "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`
      });
    }

    if (path.startsWith("/admin-api/")) {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204 });
      }
      return proxyAdmin(request, env, url);
    }

    if (path === "/admin" || path === "/admin/" ||
        path === "/admin/index.html") {
      if (!await validSession(request, env.SESSION_SECRET)) {
        return loginPage();
      }

      const adminUrl = new URL("/admin/index.html", url);
      return env.ASSETS.fetch(new Request(adminUrl, request));
    }

    if (path.startsWith("/admin/")) {
      if (!await validSession(request, env.SESSION_SECRET)) {
        return new Response("No autorizado.", {
          status: 401,
          headers: { "Cache-Control": "no-store" }
        });
      }
      return env.ASSETS.fetch(request);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204 });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método no permitido.", { status: 405 });
    }

    if (
      path === "/" ||
      path === "/index.html" ||
      path === "/products" ||
      path.startsWith("/products/")
    ) {
      return env.ASSETS.fetch(
        new Request(new URL("/index.html", url), request)
      );
    }

    return env.ASSETS.fetch(request);
  }
};
