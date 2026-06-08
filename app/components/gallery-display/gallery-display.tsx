"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "next-sanity";
import type { GalleryType } from "@/types";
import GalleryModal from "./gallery-modal";
import { isImage, hasRichText } from "./helpers";
import "./gallery-display.scss";

export interface GalleryDisplayProps {
  /** Gallery data, fetched on the server and passed in (no client fetch). */
  gallery: GalleryType | null;
  className?: string;
  /** Social links from Sanity */
  social?: Record<string, string>;
}

/**
 * Displays a gallery's columns + images (data is server-fetched and passed in).
 * Clicking any image opens the lightbox (GalleryModal) for the full column.
 */
function GalleryDisplay({
  gallery,
  className = "",
  social = {},
}: GalleryDisplayProps) {
  const [selectedColumnIdx, setSelectedColumnIdx] = useState<number | null>(null);
  const [openImageIndex, setOpenImageIndex] = useState(0);

  if (!gallery || !gallery.columns || gallery.columns.length === 0) {
    return (
      <div className={`gallery-display gallery-display--empty ${className}`.trim()}>
        <p>Gallery not found or no columns configured</p>
      </div>
    );
  }

  // Calculate total weight and column widths
  const totalWeight = gallery.columns.reduce((sum, col) => sum + (col.weight || 1), 0);
  const numColumns = gallery.columns.length;
  // Per-column share of the inter-column gaps, so columns + gaps = 100%.
  const gapFactor = numColumns > 0 ? (numColumns - 1) / numColumns : 0;
  const columnWidths = gallery.columns.map((col) => ((col.weight || 1) / totalWeight) * 100);

  return (
    <section className={`gallery-display ${className}`.trim()}>
      {/* <h2 className="gallery-display-title">{gallery.name}</h2> */}

      <div
        className="gallery-display-grid"
        style={{
          // Unitless base; the responsive --gap is derived from it in SCSS.
          "--gap-base": `${gallery.gap ?? 30}`,
        } as React.CSSProperties & { "--gap-base": string }}
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
                flex: `0 0 calc(${columnWidths[colIdx]}% - var(--gap) * ${gapFactor})`,
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
                  setOpenImageIndex(Math.max(0, imageIndex));
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
                        placeholder={item.lqip ? "blur" : "empty"}
                        blurDataURL={item.lqip}
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

      {/* Lightbox for the selected column's images */}
      {selectedColumnIdx != null && (
        <GalleryModal
          images={(gallery.columns[selectedColumnIdx].photos ?? []).filter(isImage)}
          initialIndex={openImageIndex}
          galleryName={gallery.name}
          social={social}
          onClose={() => setSelectedColumnIdx(null)}
        />
      )}
    </section>
  );
}

export default GalleryDisplay;
