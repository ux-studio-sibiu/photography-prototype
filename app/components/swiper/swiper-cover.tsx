"use client";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./swiper-cover.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import Image from "next/image";

export default function SwiperCover({ images }: { images: { url: string }[] }) {
  return (
    <Swiper
      className="nsc--swiper-cover"
      modules={[EffectFade, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      loop={true}
      slidesPerView={1}
      allowTouchMove={false}
      pagination={{ clickable: true }}
    >
      {images?.map((src, idx) => (
        <SwiperSlide key={idx}>
          <Image
            src={src.url}
            className="object-cover"
            alt={`cover ${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="100vw"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
