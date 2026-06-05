export type SiteInfoType = {
  _id: string;
  coverTitle: string;
  coverSubtitle: string;
  coverImages: { url: string }[];
  email?: string;
  phoneNumber?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    pinterest?: string;
  };
};

export type PortfolioCategoryType = {
  _id: string;
  name: string;
  description?: string;
  index?: number;
  photos: { url: string }[];
};

import type { PortableTextBlock } from "@portabletext/types";

export type GalleryItem = {
  _type?: string;
  // Image item
  url?: string;
  width?: number;
  height?: number;
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
