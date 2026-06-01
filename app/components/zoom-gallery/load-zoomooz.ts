// Loads jQuery + Zoomooz once, on the client, and resolves with the jQuery
// instance that has the `.zoomTo()` plugin attached.
//
// Mirrors the script tags used by vue-playground/app/pages/zoom.vue.

const JQUERY_SRC =
  "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
const ZOOMOOZ_SRC =
  "https://cdn.jsdelivr.net/gh/jaukia/zoomooz@master/jquery.zoomooz.js";

type JQueryStatic = any;

let cachedPromise: Promise<JQueryStatic> | null = null;

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error(`Failed to load ${src}`)),
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false; // preserve execution order
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () =>
      reject(new Error(`Failed to load ${src}`)),
    );
    document.head.appendChild(script);
  });
}

export function loadZoomooz(): Promise<JQueryStatic> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadZoomooz called on the server"));
  }

  const win = window as unknown as { jQuery?: JQueryStatic };
  if (win.jQuery?.fn?.zoomTo) return Promise.resolve(win.jQuery);

  if (!cachedPromise) {
    cachedPromise = loadScript(JQUERY_SRC, "nsc-jquery")
      .then(() => loadScript(ZOOMOOZ_SRC, "nsc-zoomooz"))
      .then(() => {
        if (!win.jQuery?.fn?.zoomTo) {
          throw new Error("Zoomooz failed to attach to jQuery");
        }
        return win.jQuery;
      })
      .catch((err) => {
        cachedPromise = null; // allow retry on next mount
        throw err;
      });
  }

  return cachedPromise;
}
