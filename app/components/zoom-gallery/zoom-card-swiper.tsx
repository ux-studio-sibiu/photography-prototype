"use client";
import "swiper/css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import Image, { type StaticImageData } from "next/image";

const ZOOM_SETTLE_MS = 650; // > Zoomooz zoom-in duration, so the rect is final

type Box = { left: number; top: number; width: number; height: number };

/**
 * In-card slideshow (Swiper, lazy-mounted only while zoomed). The slides live
 * inside the Zoomooz-zoomed card, but the controls (prev/next + dots) are
 * rendered in a `position: fixed` portal OUTSIDE the transform — so they're
 * pixel-crisp and can sit beside / below the image instead of on top of it.
 * Positions are measured from the zoomed card's rect (after the zoom settles).
 */
export default function ZoomCardSwiper({
  images,
  alt,
}: {
  images: (string | StaticImageData)[];
  alt: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const [theme, setTheme] = useState("");
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const target = rootRef.current?.closest(".zoom-target");
    if (!target) return;
    const r = target.getBoundingClientRect();
    setBox({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const target = root?.closest(".zoom-target");
    if (!target) return;

    setTheme(root?.closest(".theme-white") ? "theme-white" : "");

    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      const isZ = target.classList.contains("is-zoomed");
      setZoomed(isZ);
      if (isZ) {
        settleTimer = setTimeout(measure, ZOOM_SETTLE_MS);
      } else {
        setBox(null);
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(target, { attributes: true, attributeFilter: ["class"] });
    sync();
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [measure]);

  // ── Fixed control overlay, portaled out of the zoom transform ──
  const controls =
    zoomed && box && typeof document !== "undefined"
      ? createPortal(
          (() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const midY = box.top + box.height / 2;
            const prevLeft = Math.max(8, box.left - 52);
            const nextLeft = Math.min(vw - 52, box.left + box.width + 12);
            const dotsTop = Math.min(box.top + box.height + 18, vh - 26);
            const dotsLeft = box.left + box.width / 2;
            const stop = (e: React.MouseEvent) => e.stopPropagation();

            return (
              <div className={`zoom-controls ${theme}`.trim()}>
                <button
                  type="button"
                  className="zoom-ctrl zoom-ctrl-prev"
                  style={{ left: prevLeft, top: midY }}
                  aria-label="Previous"
                  onClick={(e) => {
                    stop(e);
                    swiperRef.current?.slidePrev();
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="zoom-ctrl zoom-ctrl-next"
                  style={{ left: nextLeft, top: midY }}
                  aria-label="Next"
                  onClick={(e) => {
                    stop(e);
                    swiperRef.current?.slideNext();
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div
                  className="zoom-dots"
                  style={{ left: dotsLeft, top: dotsTop }}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`zoom-dot${i === active ? " is-active" : ""}`}
                      aria-label={`Go to image ${i + 1}`}
                      onClick={(e) => {
                        stop(e);
                        swiperRef.current?.slideToLoop(i);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })(),
          document.body,
        )
      : null;

  return (
    <div className="zoom-card-stage" ref={rootRef}>
      {/* Always present: the click-to-zoom target is a plain image. */}
      <Image
        src={images[0]}
        alt={alt}
        className="zoom-card-img"
        fill
        sizes="(max-width: 768px) 90vw, 80vw"
      />

      {/* Swiper appears only once zoomed — never during the zoom-in click. */}
      {zoomed && (
        <div className="zoom-card-swiper">
          <Swiper
            modules={[Autoplay]}
            loop
            slidesPerView={1}
            allowTouchMove={false}
            autoplay={{ delay: 12000, disableOnInteraction: false }}
            onSwiper={(sw) => {
              swiperRef.current = sw;
            }}
            onSlideChange={(sw) => setActive(sw.realIndex)}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <Image
                  src={src}
                  alt={alt}
                  className="zoom-card-img"
                  fill
                  sizes="80vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {controls}
    </div>
  );
}
