importScripts("/assets/history/config.js?v=2025-04-15");
importScripts("/assets/history/worker.js?v=2025-04-15");
importScripts("/assets/mathematics/bundle.js?v=2025-04-15");
importScripts("/assets/mathematics/config.js?v=2025-04-15");
importScripts(__uv$config.sw || "/assets/mathematics/sw.js?v=2025-04-15");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

self.addEventListener("fetch", event => {
  event.respondWith(
    (async () => {
      try {
        if (await dynamic.route(event)) {
          try {
            return await dynamic.fetch(event);
          } catch (error) {
            console.error("Dynamic fetch error:", error);
            // Fallback to UltraViolet
            if (event.request.url.startsWith(`${location.origin}/a/`)) {
              return await uv.fetch(event);
            }
            return await fetch(event.request);
          }
        }
      } catch (error) {
        console.error("Dynamic route error:", error);
      }

      if (event.request.url.startsWith(`${location.origin}/a/`)) {
        return await uv.fetch(event);
      }

      return await fetch(event.request);
    })(),
  );
});
