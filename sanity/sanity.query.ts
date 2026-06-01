import { groq } from "next-sanity";
import client from "./sanity.client";
import { SiteInfoType, PortfolioCategoryType } from "@/types";
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
      }`,
      {},
    );
  },
  ["generalInfo"],
  { revalidate: revalidateInterval, tags: ["general-info"] },
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
