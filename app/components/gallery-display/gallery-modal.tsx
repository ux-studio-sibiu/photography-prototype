"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { PortableText } from "next-sanity";
import { NavButton, CloseButton } from "../icons";
import SocialLinksClient from "../social-links/social-links-client";
import type { GalleryItem } from "@/types";
import { hasRichText } from "./helpers";
import "swiper/css";

// Image URLs already loaded in the lightbox this session — lets us reveal an
// already-seen image immediately instead of waiting on its load event.
const loadedSrcs = new Set<string>();

/** Full-bleed modal image. Reports when it has loaded (or errored). */
function ModalImage({
  src,
  alt,
  onReady,
}: {
  src: string;
  alt: string;
  onReady?: () => void;
}) {
  const done = () => {
    loadedSrcs.add(src);
    onReady?.();
  };

  return (
    <Image
      src={src}
      alt={alt}
      className="gallery-display-modal-img"
      fill
      sizes="80vw"
      onLoad={done}
      onError={done}
    />
  );
}

interface GalleryModalProps {
  /** Images of the selected column (already filtered to displayable images). */
  images: GalleryItem[];
  /** Slide to open on. */
  initialIndex: number;
  galleryName: string;
  social?: Record<string, string>;
  onClose: () => void;
}

/** Full-screen swiper lightbox for a column's images. */
export default function GalleryModal({
  images,
  initialIndex,
  galleryName,
  social = {},
  onClose,
}: GalleryModalProps) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  // Swiper positions to initialSlide only after it inits; hide until then so we
  // don't flash slide 0 before it jumps to the opened image.
  const [swiperReady, setSwiperReady] = useState(false);
  // Hold the reveal until the opened image has loaded, so it appears fully
  // (instant — no fade), matching how prev/next images (preloaded off-screen)
  // already look. Already-seen images reveal immediately.
  const initialSrc = images[initialIndex]?.url ?? "";
  const [imageReady, setImageReady] = useState(() => loadedSrcs.has(initialSrc));

  const ready = swiperReady && imageReady;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="gallery-display-backdrop" />

      <div className="gallery-display-modal">
        <div className="gallery-display-modal-content">
          <NavButton direction="prev" onClick={() => swiper?.slidePrev()} />

          <div className="gallery-display-detail">
            <Swiper
              className={`gallery-display-swiper${ready ? " is-ready" : ""}`}
              modules={[]}
              loop
              slidesPerView={1}
              allowTouchMove={false}
              speed={0}
              initialSlide={initialIndex}
              onSwiper={(s) => {
                setSwiper(s);
                // Reveal after one frame (settles any init re-measure while hidden).
                requestAnimationFrame(() => {
                  s.update();
                  setSwiperReady(true);
                });
              }}
            >
              {images.map((photo, idx) => (
                <SwiperSlide key={idx}>
                  <div className="gallery-display-modal-img-wrapper">
                    <div className="gallery-display-modal-img-box">
                      <ModalImage
                        src={photo.url!}
                        alt={`${galleryName} image ${idx + 1}`}
                        onReady={
                          idx === initialIndex
                            ? () => setImageReady(true)
                            : undefined
                        }
                      />
                    </div>
                    {hasRichText(photo.description) && (
                      <div className="gallery-display-modal-caption has-portable-text">
                        <PortableText value={photo.description!} />
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="gallery-display-modal-social">
              <SocialLinksClient social={social} />
            </div>

            <CloseButton onClick={onClose} />
          </div>

          <NavButton direction="next" onClick={() => swiper?.slideNext()} />
        </div>
      </div>
    </>
  );
}
