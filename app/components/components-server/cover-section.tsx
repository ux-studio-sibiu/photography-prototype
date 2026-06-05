import "./cover-section.scss";
import { SiteInfoType } from "@/types";
import { getGeneralInfo } from "@/sanity/sanity.query";
import SwiperCover from "../swiper/swiper-cover";
import SocialLinks from "../social-links/social-links";

export default async function CoverSection() {
  const generalInfo: SiteInfoType = await getGeneralInfo();

  const images = generalInfo?.coverImages || [];
  const title = generalInfo?.coverTitle || "Photography";
  const subtitle = generalInfo?.coverSubtitle || "";

  return (
    <div id="nsc--cover-section" className="overlay">
      {/* background slideshow */}
      {images.length > 0 && <SwiperCover images={images} />}

      <div className="cover-content">
        <h1 className="cover-title text-uppercase">{title}</h1>
        {subtitle && <h2 className="cover-subtitle">{subtitle}</h2>}
        <SocialLinks className="cover-social" />
      </div>
    </div>
  );
}
