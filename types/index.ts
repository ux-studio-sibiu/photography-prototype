export type SiteInfoType = {
  _id: string;
  coverTitle: string;
  coverSubtitle: string;
  coverImages: { url: string; lqip?: string }[];
  email?: string;
  phoneNumber?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    pinterest?: string;
  };
};

/** A gallery reference resolved to the bits the UI needs. */
export type GalleryRef = {
  slug?: string;
  name?: string;
  coverUrl?: string;
  images?: string[];
};

export type PortfolioSubItem = {
  _key?: string;
  name: string;
  gallery?: GalleryRef;
};

export type PortfolioCategoryType = {
  _id: string;
  name: string;
  description?: string;
  index?: number;
  /** The linked gallery (resolved from a reference), if any. */
  gallery?: GalleryRef;
  /** Optional nested entries; when present the category is an expandable group. */
  subItems?: PortfolioSubItem[];
};

import type { PortableTextBlock } from "@portabletext/types";

export type GalleryItem = {
  _type?: string;
  // Image item
  url?: string;
  width?: number;
  height?: number;
  /** Low-quality image placeholder (base64) for blur-up. */
  lqip?: string;
  description?: PortableTextBlock[];
  // Text item
  text?: PortableTextBlock[];
};

export type GalleryColumn = {
  weight: number;
  photos: GalleryItem[];
};

export type GalleryType = {
  _id: string;
  name: string;
  slug: { current: string };
  gap?: number;
  columns: GalleryColumn[];
};

export type DayStatus = "occupied" | "free";

export type DayRecord = {
  _key?: string;
  date: string;
  status: DayStatus;
  note?: string;
};

export type AvailabilityType = {
  _id: string;
  days: DayRecord[];
};
