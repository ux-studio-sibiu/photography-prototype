"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import { PortableText } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { NavButton, CloseButton } from "../icons";
import SocialLinksClient from "../social-links/social-links-client";
import type { GalleryType, GalleryItem } from "@/types";
import "swiper/css";
import "./gallery-display.scss";

export interface GalleryDisplayProps {
  /** Gallery data, fetched on the server and passed in (no client fetch). */
  gallery: GalleryType | null;
  className?: string;
  /** Social links from Sanity */
  social?: Record<string, string>;
}

const isImage = (item: GalleryItem) => item._type === "image" && !!item.url;

// True only when the rich text actually contains visible characters.
const hasRichText = (blocks?: PortableTextBlock[]) =>
  Array.isArray(blocks) &&
  blocks.some((b) =>
    b._type === "block"
      ? ((b.children as Array<{ text?: string }> | undefined) ?? []).some(
          (c) => c.text?.trim(),
        )
      : true,
  );

/**
 * Displays a gallery's columns + images (data is server-fetched and passed in).
 * Clicking any image opens a swiper modal for viewing the full column.
 */
function GalleryDisplay({
  gallery,
  className = "",
  social = {},
}: GalleryDisplayProps) {
  const [selectedColumnIdx, setSelectedColumnIdx] = useState<number | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    if (selectedColumnIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedColumnIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedColumnIdx]);

  if (!gallery || !gallery.columns || gallery.columns.length === 0) {
    return (
      <div className={`gallery-display gallery-display--empty ${className}`.trim()}>
        <p>Gallery not found or no columns configured</p>
      </div>
    );
  }

  const column =
    selectedColumnIdx != null ? gallery.columns[selectedColumnIdx] : null;

  // Calculate total weight and column widths
  const totalWeight = gallery.columns.reduce((sum, col) => sum + (col.weight || 1), 0);
  const numColumns = gallery.columns.length;
  const gap = gallery.gap || 30;
  const columnWidths = gallery.columns.map((col) => ((col.weight || 1) / totalWeight) * 100);

  return (
    <section className={`gallery-display ${className}`.trim()}>
      {/* <h2 className="gallery-display-title">{gallery.name}</h2> */}

      <div
        className="gallery-display-grid"
        style={{
          "--gap": `${gallery.gap || 30}px`,
        } as React.CSSProperties & { "--gap": string }}
      >
        {gallery.columns.map((column, colIdx) => {
          // Images-only list drives the modal swiper; track each image's index
          // within it so a grid click opens the correct slide.
          const items = column.photos ?? [];
          const columnImages = items.filter(isImage);

          return (
            <div
              key={colIdx}
              className="gallery-display-column"
              style={{
                flex: `0 0 calc(${columnWidths[colIdx]}% - ${((numColumns - 1) * gap) / numColumns}px)`,
              }}
            >
              {items.map((item, idx) => {
                // Standalone text block
                if (item._type === "textBlock") {
                  if (!hasRichText(item.text)) return null;
                  return (
                    <div
                      key={idx}
                      className="gallery-display-text has-portable-text"
                    >
                      <PortableText value={item.text!} />
                    </div>
                  );
                }

                // Image item
                if (!isImage(item)) return null;
                const imageIndex = columnImages.indexOf(item);
                const open = () => {
                  setSelectedColumnIdx(colIdx);
                  setActiveImageIdx(Math.max(0, imageIndex));
                };

                return (
                  <figure key={idx} className="gallery-display-figure">
                    <div
                      className="gallery-display-item"
                      onClick={open}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") open();
                      }}
                      aria-label={`View image ${imageIndex + 1}`}
                    >
                      <Image
                        src={item.url!}
                        alt={`${gallery.name} image ${imageIndex + 1}`}
                        width={item.width ?? 1000}
                        height={item.height ?? 1000}
                        className="gallery-display-img"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Hover overlay with eye icon */}
                      <div className="gallery-display-overlay" aria-hidden="true">
                        <svg
                          className="gallery-display-icon"
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
                    </div>

                    {hasRichText(item.description) && (
                      <figcaption className="gallery-display-caption has-portable-text">
                        <PortableText value={item.description!} />
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Swiper modal */}
      {column && selectedColumnIdx != null && (
        <>
          <div className="gallery-display-backdrop" />

          <div className="gallery-display-modal">
            <div className="gallery-display-modal-content">
              <NavButton
                direction="prev"
                onClick={() => swiper?.slidePrev()}
              />

              <div className="gallery-display-detail">
                <Swiper
                  className="gallery-display-swiper"
                  modules={[]}
                  loop
                  slidesPerView={1}
                  allowTouchMove={false}
                  speed={0}
                  initialSlide={activeImageIdx}
                  onSwiper={setSwiper}
                  onSlideChange={(s) => setActiveImageIdx(s.realIndex)}
                >
                  {(column.photos ?? []).filter(isImage).map((photo, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="gallery-display-modal-img-wrapper">
                        <div className="gallery-display-modal-img-box">
                          <Image
                            src={photo.url!}
                            alt={`${gallery.name} image ${idx + 1}`}
                            className="gallery-display-modal-img"
                            fill
                            sizes="80vw"
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

                <CloseButton onClick={() => setSelectedColumnIdx(null)} />
              </div>

              <NavButton
                direction="next"
                onClick={() => swiper?.slideNext()}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default GalleryDisplay;
