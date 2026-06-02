"use client";
import "swiper/css";
import "./motion-gallery.scss";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import Image, { type StaticImageData } from "next/image";

export type MotionItem = {
  title: string;
  images: (string | StaticImageData)[];
};

/**
 * Click-to-zoom gallery using Framer Motion shared-element (`layoutId`)
 * transitions. The detail is a normal element, so controls + a thumbnail rail
 * can sit outside the image with plain flexbox (no portal).
 */
export default function MotionGallery({ items }: { items: MotionItem[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(0);
  const item = selected != null ? items[selected] : null;

  useEffect(() => {
    if (selected == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const open = (i: number) => {
    setActive(0);
    setSelected(i);
  };
  const close = () => setSelected(null);

  return (
    <section className="mg">
      {/* Grid scales up + fades as a detail opens → "the page zooms in" feel. */}
      <motion.div
        className="mg-grid"
        animate={{
          scale: selected != null ? 1.1 : 1,
          opacity: selected != null ? 0 : 1,
        }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ pointerEvents: selected != null ? "none" : "auto" }}
      >
        {items.map((it, i) => (
          <motion.button
            key={i}
            layoutId={`mg-card-${i}`}
            type="button"
            className="mg-card"
            onClick={() => open(i)}
          >
            <Image
              src={it.images[0]}
              alt={it.title}
              className="mg-img"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <span className="mg-caption">{it.title}</span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {item && selected != null && (
          <>
            <motion.div
              className="mg-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />

            <div className="mg-overlay">
              {/* Split-view left panel: large thumbnails (2 columns). */}
              <div className="mg-rail">
                {item.images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`mg-thumb${idx === active ? " is-active" : ""}`}
                    aria-label={`Image ${idx + 1}`}
                    onClick={() => swiper?.slideToLoop(idx)}
                  >
                    <Image src={src} alt="" className="mg-thumb-img" fill sizes="260px" />
                  </button>
                ))}
              </div>

              {/* Main stage: arrows flank the morphing detail. */}
              <div
                className="mg-main"
                onClick={(e) => {
                  if (e.target === e.currentTarget) close();
                }}
              >
                <button
                  type="button"
                  className="mg-nav mg-nav-prev"
                  aria-label="Previous"
                  onClick={() => swiper?.slidePrev()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>

                <motion.div
                  layoutId={`mg-card-${selected}`}
                  className="mg-detail"
                >
                  <Swiper
                    className="mg-swiper"
                    modules={[Autoplay]}
                    loop
                    slidesPerView={1}
                    allowTouchMove={false}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    onSwiper={setSwiper}
                    onSlideChange={(s) => setActive(s.realIndex)}
                  >
                    {item.images.map((src, idx) => (
                      <SwiperSlide key={idx}>
                        <Image
                          src={src}
                          alt={item.title}
                          className="mg-img"
                          fill
                          sizes="80vw"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <span className="mg-detail-caption">{item.title}</span>

                  <button
                    type="button"
                    className="mg-close"
                    aria-label="Close"
                    onClick={close}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </motion.div>

                <button
                  type="button"
                  className="mg-nav mg-nav-next"
                  aria-label="Next"
                  onClick={() => swiper?.slideNext()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
