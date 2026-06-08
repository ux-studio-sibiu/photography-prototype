"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  name: string;
  description: string;
}

/**
 * Mobile presentation of the testimonials: one card per slide in a swiper with
 * clickable pagination dots (mirrors the mobile gallery). Desktop uses the grid
 * in the parent component.
 */
export default function TestimonialsMobile({
  items,
}: {
  items: Testimonial[];
}) {
  if (items.length === 0) return null;

  return (
    <Swiper
      className="testimonials-swiper"
      modules={[Pagination]}
      slidesPerView={1}
      // Gap keeps neighbouring slides clear of the padded shadow area.
      spaceBetween={48}
      loop={items.length > 1}
      pagination={{ clickable: true }}
      speed={300}
    >
      {items.map((t, i) => (
        <SwiperSlide key={i}>
          <figure className="testimonials-card">
            <blockquote className="testimonials-quote">
              {t.description}
            </blockquote>
            <figcaption className="testimonials-name">{t.name}</figcaption>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
