import { groq } from "next-sanity";
import client from "./sanity.client";
import {
  SiteInfoType,
  PortfolioCategoryType,
  GalleryType,
  AvailabilityType,
  ContractTemplateType,
} from "@/types";
import { unstable_cache } from "next/cache";

// 3s in dev, 1h otherwise
const revalidateInterval = process.env.NODE_ENV === "development" ? 3 : 3 * 3600;

// Shared projection for a referenced gallery resolved to UI fields.
const GALLERY_REF = groq`{
  "slug": slug.current,
  name,
  "coverUrl": (columns[].photos[_type == "image"].asset->url)[0],
  "images": columns[].photos[_type == "image"].asset->url
}`;

// Shared projection for a gallery's full content (columns + image/text items).
const GALLERY_FIELDS = groq`
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
      "lqip": asset->metadata.lqip,
      description,
      text,
    },
  }
`;

export const getGeneralInfo = unstable_cache(
  async (): Promise<SiteInfoType> => {
    return client.fetch(
      groq`*[_type == "general-info"][0]{
        _id,
        coverTitle,
        coverSubtitle,
        "coverImages": coverImages[]{ "url": asset->url, "lqip": asset->metadata.lqip },
        email,
        phoneNumber,
        social,
        "testimonials": testimonials.items[]{ name, description },
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
        "gallery": gallery->${GALLERY_REF},
        "subItems": subItems[]{
          _key,
          name,
          "gallery": gallery->${GALLERY_REF},
        },
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
      groq`*[_type == "gallery" && slug.current == $slug][0]{ ${GALLERY_FIELDS} }`,
      { slug },
    );
  },
  ["gallery"],
  { revalidate: revalidateInterval, tags: ["gallery"] },
);

export const getAllGalleries = unstable_cache(
  async (): Promise<GalleryType[]> => {
    return client.fetch(
      groq`*[_type == "gallery"]{ ${GALLERY_FIELDS} }`,
      {},
    );
  },
  ["galleriesAll"],
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

// Shared projection for a contract template resolved to UI fields.
const CONTRACT_TEMPLATE_FIELDS = groq`
  _id,
  title,
  description,
  variables[]{
    _key,
    key,
    label,
    type,
    defaultValue,
    required,
  },
  body,
  pageSize,
  accentColor,
  "logoUrl": logo.asset->url,
  headerText,
  footerText
`;

export const getContractTemplates = unstable_cache(
  async (): Promise<ContractTemplateType[]> => {
    return client.fetch(
      groq`*[_type == "contractTemplate"] | order(title asc){ ${CONTRACT_TEMPLATE_FIELDS} }`,
      {},
    );
  },
  ["contractTemplates"],
  { revalidate: revalidateInterval, tags: ["contractTemplate"] },
);

export const getContractTemplateById = unstable_cache(
  async (id: string): Promise<ContractTemplateType | null> => {
    return client.fetch(
      groq`*[_type == "contractTemplate" && _id == $id][0]{ ${CONTRACT_TEMPLATE_FIELDS} }`,
      { id },
    );
  },
  ["contractTemplate"],
  { revalidate: revalidateInterval, tags: ["contractTemplate"] },
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
