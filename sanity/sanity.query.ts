import { groq } from "next-sanity";
import client from "./sanity.client";
import {
  SiteInfoType,
  PortfolioCategoryType,
  GalleryType,
  AvailabilityType,
} from "@/types";
import { unstable_cache } from "next/cache";

// 3s in dev, 1h otherwise
const revalidateInterval = process.env.NODE_ENV === "development" ? 3 : 3 * 3600;

export const getGeneralInfo = unstable_cache(
  async (): Promise<SiteInfoType> => {
    return client.fetch(
      groq`*[_type == "general-info"][0]{
        _id,
        coverTitle,
        coverSubtitle,
        "coverImages": coverImages[]{ "url": asset->url },
        email,
        phoneNumber,
        social,
      }`,
      {},
    );
  },
  ["generalInfo"],
  { revalidate: 10, tags: ["general-info"] },
);

export const getPortfolioCategories = unstable_cache(
  async (): Promise<PortfolioCategoryType[]> => {
    return client.fetch(
      groq`*[_type == "portfolio-category"] | order(index asc){
        _id,
        name,
        description,
        index,
        "photos": photos[]{ "url": asset->url },
      }`,
      {},
    );
  },
  ["portfolioCategories"],
  { revalidate: revalidateInterval, tags: ["portfolio-category"] },
);

export const getGalleryBySlug = unstable_cache(
  async (slug: string): Promise<GalleryType | null> => {
    return client.fetch(
      groq`*[_type == "gallery" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        gap,
        "columns": columns[]{
          weight,
          "photos": photos[]{
            _type,
            "url": asset->url,
            "width": asset->metadata.dimensions.width,
            "height": asset->metadata.dimensions.height,
            description,
            text,
          },
        },
      }`,
      { slug },
    );
  },
  ["gallery"],
  { revalidate: revalidateInterval, tags: ["gallery"] },
);

export const getAllGallerySlugs = unstable_cache(
  async (): Promise<Array<{ slug: string }>> => {
    return client.fetch(
      groq`*[_type == "gallery"]{
        "slug": slug.current,
      }`,
      {},
    );
  },
  ["gallerySlugs"],
  { revalidate: revalidateInterval, tags: ["gallery"] },
);

export const getGalleryLinks = unstable_cache(
  async (): Promise<Array<{ name: string; slug: string }>> => {
    return client.fetch(
      groq`*[_type == "gallery"] | order(name asc){
        name,
        "slug": slug.current,
      }`,
      {},
    );
  },
  ["galleryLinks"],
  { revalidate: revalidateInterval, tags: ["gallery"] },
);

export const getAvailability = unstable_cache(
  async (): Promise<AvailabilityType | null> => {
    return client.fetch(
      groq`*[_type == "availability"][0]{
        _id,
        "days": days[]{
          date,
          status,
          note,
        },
      }`,
      {},
    );
  },
  ["availability"],
  { revalidate: revalidateInterval, tags: ["availability"] },
);
