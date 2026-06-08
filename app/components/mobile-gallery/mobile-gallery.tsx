"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { GalleryType } from "@/types";
import "swiper/css";
import "swiper/css/pagination";
import "./mobile-gallery.scss";

interface MobileGalleryProps {
  gallery: GalleryType | null;
}

const MAX_SLIDES = 4;

/**
 * Split a category's images into swipers of at most 4 slides. A final lone
 * slide is folded into the previous swiper (making it 5) so we never render a
 * swiper that ends with a single orphan image.
 */
function chunkSlides<T>(images: T[]): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < images.length; i += MAX_SLIDES) {
    chunks.push(images.slice(i, i + MAX_SLIDES));
  }
  const last = chunks[chunks.length - 1];
  if (chunks.length > 1 && last.length === 1) {
    chunks.pop();
    chunks[chunks.length - 1].push(last[0]);
  }
  return chunks;
}

export default function MobileGallery({ gallery }: MobileGalleryProps) {
  if (!gallery || !gallery.columns || gallery.columns.length === 0) {
    return (
      <div className="mobile-gallery--empty">
        <p>Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="mobile-gallery">
      {gallery.columns.flatMap((column, colIdx) => {
        const images = (column.photos ?? []).filter((p) => p.url);
        if (images.length === 0) return [];

        // Each category is split into swipers of at most 4 slides (5 only to
        // absorb a trailing orphan), each rendered as its own block.
        return chunkSlides(images).map((chunk, chunkIdx) => (
          <div
            key={`${colIdx}-${chunkIdx}`}
            className="mobile-gallery-category"
          >
            <Swiper
              className="mobile-gallery-swiper"
              modules={[Pagination]}
              slidesPerView={1}
              loop={chunk.length > 1}
              pagination={{ clickable: true }}
              speed={300}
            >
              {chunk.map((image, imgIdx) => (
                <SwiperSlide key={imgIdx}>
                  <div className="mobile-gallery-slide">
                    <Image
                      src={image.url!}
                      alt={`Gallery image ${imgIdx + 1}`}
                      fill
                      className="mobile-gallery-img"
                      sizes="100vw"
                      placeholder={image.lqip ? "blur" : "empty"}
                      blurDataURL={image.lqip}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ));
      })}
    </div>
  );
}
