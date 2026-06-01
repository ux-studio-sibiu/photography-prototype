export type SiteInfoType = {
  _id: string;
  coverTitle: string;
  coverSubtitle: string;
  coverImages: { url: string }[];
};

export type PortfolioCategoryType = {
  _id: string;
  name: string;
  description?: string;
  index?: number;
  photos: { url: string }[];
};
