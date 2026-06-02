"use client";

import { useEffect, useMemo, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { loadZoomooz } from "./load-zoomooz";
import ZoomCardSwiper from "./zoom-card-swiper";
import "./zoom-gallery.scss";

export type ZoomItem = {
  src: string | StaticImageData;
  title: string;
  /**
   * Full set of images for this card. When more than one is provided, the card
   * shows a looping slideshow (autoplaying while zoomed); otherwise it's a
   * single static image (`src`).
   */
  images?: (string | StaticImageData)[];
  /** small decorative corner number */
  num?: number | string;
  /** render the card rotated 180° (like the vue "UPSIDE DOWN" card) */
  flip?: boolean;
  /** override the alt text (defaults to title) */
  alt?: string;
};

export type ZoomGalleryProps = {
  items: ZoomItem[];
  /**
   * Indices `i` where `items[i]` and `items[i + 1]` share a single grid cell,
   * side by side (the vue layout's "pair" card). Each listed index consumes
   * the following item too.
   */
  pairStarts?: number[];
  /** how much of the viewport a zoomed card fills (0–1). Default 0.85 */
  zoomTargetSize?: number;
  className?: string;
};

type Cell =
  | { kind: "single"; index: number }
  | { kind: "pair"; indices: [number, number] };

/**
 * Build the ordered list of grid cells from a flat items array + pair config.
 * `data-idx` always equals the item's index in `items`, and items render in
 * index order, so DOM order === data-idx order (scroll navigation relies on it).
 */
function buildCells(count: number, pairStarts: number[]): Cell[] {
  const pairSet = new Set(pairStarts);
  const cells: Cell[] = [];
  for (let i = 0; i < count; i++) {
    if (pairSet.has(i) && i + 1 < count) {
      cells.push({ kind: "pair", indices: [i, i + 1] });
      i++; // skip the consumed item
    } else {
      cells.push({ kind: "single", index: i });
    }
  }
  return cells;
}

/**
 * Smoothly scrolls the gallery section flush to the top of the viewport (it is
 * 100vh, so it ends up filling the screen) and resolves once the scroll has
 * settled. If it's already in place, resolves immediately. We scroll *before*
 * zooming so a card never zooms into a half-visible container.
 */
function scrollIntoPlace(section: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    // Already aligned to the top (within a small tolerance)? Zoom right away.
    if (Math.abs(section.getBoundingClientRect().top) < 2) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("scrollend", finish);
      clearInterval(poll);
      clearTimeout(cap);
      resolve();
    };

    // `scrollend` fires when a smooth scroll completes (modern browsers).
    window.addEventListener("scrollend", finish);

    // Fallback: poll until the scroll position stabilises, in case `scrollend`
    // is unsupported or no scroll is actually needed.
    let lastY = window.scrollY;
    let stable = 0;
    const poll = setInterval(() => {
      const y = window.scrollY;
      if (y === lastY) {
        if (++stable >= 3) finish();
      } else {
        stable = 0;
        lastY = y;
      }
    }, 50);

    // Hard cap so we never block the zoom indefinitely.
    const cap = setTimeout(finish, 1000);

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/**
 * Resolves once the gallery's layout has settled: all its images have finished
 * loading (so grid cells have their final sizes) and the browser next goes idle.
 * We defer loading jQuery + Zoomooz until then so the (~300KB) scripts don't
 * compete with image decoding / LCP.
 *
 * Deliberately avoids `requestAnimationFrame` — it's frozen in hidden/background
 * tabs, which would stall the whole gallery until the tab is focused. We lean on
 * `requestIdleCallback` for the idle defer, with a `setTimeout` safety net that
 * still fires in hidden tabs so initialisation is always guaranteed.
 */
function whenLayoutReady(root: HTMLElement, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const settle = () => {
      if (signal.cancelled) return resolve();

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      const ric = (
        window as unknown as {
          requestIdleCallback?: (cb: () => void, o?: object) => void;
        }
      ).requestIdleCallback;
      if (ric) ric(finish, { timeout: 1200 });
      // Safety net: guarantees resolution even when idle callbacks are throttled
      // (hidden tabs) or unsupported.
      setTimeout(finish, 1200);
    };

    const imgs = Array.from(root.querySelectorAll("img"));
    let remaining = imgs.filter((img) => !img.complete).length;
    if (remaining === 0) {
      settle();
      return;
    }

    imgs.forEach((img) => {
      if (img.complete) return;
      const onDone = () => {
        img.removeEventListener("load", onDone);
        img.removeEventListener("error", onDone);
        remaining -= 1;
        if (remaining === 0) settle();
      };
      img.addEventListener("load", onDone);
      img.addEventListener("error", onDone);
    });
  });
}

export default function ZoomGallery({
  items,
  pairStarts = [],
  zoomTargetSize = 0.85,
  className = "",
}: ZoomGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cells = useMemo(
    () => buildCells(items.length, pairStarts),
    [items.length, pairStarts],
  );

  useEffect(() => {
    const signal = { cancelled: false };
    const cleanups: Array<() => void> = [];

    const root = rootRef.current;
    if (!root) return;

    // Wait for the grid to finish laying out, then load + init Zoomooz.
    whenLayoutReady(root, signal)
      .then(() => (signal.cancelled ? null : loadZoomooz()))
      .then(($) => {
        if (!$ || signal.cancelled) return;

        const container = root.querySelector<HTMLElement>(".zoom-container");
        if (!container) return;

        // Zoomooz zooms by transforming `settings.root` (default `<body>`)
        // inside its parent. We pin it to our `.zoomContainer` so only the
        // gallery transforms — the `.zoomViewport` parent clips it — instead
        // of scaling the whole page.
        const $container = $(container);

        const $targets = $(root).find(".zoom-target");
        const cards = $targets.toArray() as HTMLElement[];
        if (cards.length === 0) return;

        let zoomed = false;

        // Scroll lock: pin the page at its current offset instead of toggling
        // `overflow` (which clamps scrollTop to 0 and jumps to the top). Pinning
        // `position: fixed` keeps the scroll position and — with the reserved
        // scrollbar gutter on <html> — keeps the page width unchanged.
        let scrollLocked = false;
        let lockedScrollY = 0;
        const lockScroll = () => {
          if (scrollLocked) return;
          scrollLocked = true;
          lockedScrollY = window.scrollY;
          const s = document.body.style;
          s.position = "fixed";
          s.top = `-${lockedScrollY}px`;
          s.left = "0";
          s.right = "0";
          s.width = "100%";
        };
        const unlockScroll = () => {
          if (!scrollLocked) return;
          scrollLocked = false;
          const s = document.body.style;
          s.position = "";
          s.top = "";
          s.left = "";
          s.right = "";
          s.width = "";
          // The site root has `scroll-behavior: smooth`, which would make this
          // restore animate (drop to top, then glide back). Force it instant.
          const html = document.documentElement;
          const prevBehavior = html.style.scrollBehavior;
          html.style.scrollBehavior = "auto";
          window.scrollTo(0, lockedScrollY);
          html.style.scrollBehavior = prevBehavior;
        };

        // Back button — appended to <html> so Zoomooz's transforms don't move it.
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "zoom-back-btn";
        btn.style.display = "none";
        btn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> return';
        document.documentElement.appendChild(btn);
        cleanups.push(() => {
          btn.remove();
          unlockScroll();
        });

        const showBtn = () => {
          btn.style.display = "flex";
        };
        const hideBtn = () => {
          btn.style.display = "none";
        };

        const zoomToIdx = (idx: number) => {
          const card = cards[idx];
          if (!card) return;
          zoomed = true;
          $targets.removeClass("is-zoomed");
          $(card).addClass("is-zoomed");
          $container.addClass("is-zooming"); // fades + disables the other cards
          lockScroll(); // block page scroll without losing position
          showBtn();
          $(card).zoomTo({
            root: $container,
            targetsize: zoomTargetSize,
            duration: 600,
            easing: "ease",
          });
        };

        const zoomOut = () => {
          if (!zoomed) return;
          zoomed = false;
          hideBtn();
          $targets.removeClass("is-zoomed");
          $container.removeClass("is-zooming");
          unlockScroll();
          $container.zoomTo({
            root: $container,
            targetsize: 1.0,
            duration: 500,
            easing: "ease",
          });
        };

        // Click a card → bring the gallery fully into view, then zoom in.
        // Click background → zoom out.
        $targets.on("click", function (this: HTMLElement, evt: Event) {
          evt.stopPropagation();
          const idx = parseInt(this.dataset.idx || "0", 10);
          scrollIntoPlace(root).then(() => {
            if (!signal.cancelled) zoomToIdx(idx);
          });
        });
        $container.on("click", zoomOut);
        cleanups.push(() => {
          $targets.off("click");
          $container.off("click");
        });

        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          zoomOut();
        });

        const onKeydown = (e: KeyboardEvent) => {
          if (e.key === "Escape") zoomOut();
        };
        window.addEventListener("keydown", onKeydown);
        cleanups.push(() => window.removeEventListener("keydown", onKeydown));
      })
      .catch((err) => {
        // Non-fatal: the gallery still renders as a static grid.
        console.error("[ZoomGallery]", err);
      });

    return () => {
      signal.cancelled = true;
      cleanups.forEach((fn) => fn());
    };
    // zoomTargetSize is read fresh inside; re-run if the item set changes.
  }, [items, zoomTargetSize]);

  const renderTarget = (index: number) => {
    const item = items[index];
    if (!item) return null;
    return (
      <div
        key={index}
        className={`zoom-target${item.flip ? " flip" : ""}`}
        data-idx={index}
      >
        {/* Media layer — the Swiper's inner translate transform is contained
            here; every overlay below is a sibling so it never inherits it. */}
        <div className="zoom-card-media">
          {item.images && item.images.length > 1 ? (
            <ZoomCardSwiper images={item.images} alt={item.alt ?? item.title} />
          ) : (
            <Image
              src={item.src}
              alt={item.alt ?? item.title}
              className="zoom-card-img"
              fill
              sizes="(max-width: 768px) 90vw, 80vw"
            />
          )}
        </div>

        {/* Hover-only "view" affordance. */}
        <div className="zoom-card-overlay" aria-hidden="true">
          <svg
            className="zoom-card-open"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        {item.num != null && <span className="zoom-card-num">{item.num}</span>}
        <span className="zoom-card-caption">{item.title}</span>
      </div>
    );
  };

  return (
    <section className={`nsc--zoom-gallery ${className}`.trim()} ref={rootRef}>
      {/* `zoomViewport` / `zoomContainer` are Zoomooz's required class names —
          they tell the plugin which element clips and which one transforms,
          so it zooms the gallery rather than the whole <body>. */}
      <div className="zoom-viewport zoomViewport">
        <div className="zoom-container zoomContainer">
          <div className="zoom-grid">
            {cells.map((cell, ci) =>
              cell.kind === "pair" ? (
                <div key={`pair-${ci}`} className="zoom-card zoom-card-pair">
                  {renderTarget(cell.indices[0])}
                  {renderTarget(cell.indices[1])}
                </div>
              ) : (
                <div key={`cell-${ci}`} className="zoom-card">
                  {renderTarget(cell.index)}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
