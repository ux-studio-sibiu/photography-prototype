"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { GalleryType } from "@/types";
import "swiper/css";
import "./mobile-gallery.scss";

interface MobileGalleryProps {
  gallery: GalleryType | null;
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
      {gallery.columns.map((column, colIdx) => {
        const images = column.photos?.filter((p) => p.url) || [];
        if (images.length === 0) return null;

        return (
          <div key={colIdx} className="mobile-gallery-category">
            {/* <h3 className="mobile-gallery-title">{column.weight || `Category ${colIdx + 1}`}</h3> */}
            <Swiper
              className="mobile-gallery-swiper"
              slidesPerView={1}
              loop={images.length > 1}
              pagination={{ clickable: true }}
              speed={300}
            >
              {images.map((image, imgIdx) => (
                <SwiperSlide key={imgIdx}>
                  <div className="mobile-gallery-slide">
                    <Image
                      src={image.url}
                      alt={`Gallery image ${imgIdx + 1}`}
                      fill
                      className="mobile-gallery-img"
                      sizes="100vw"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );
      })}
    </div>
  );
}
