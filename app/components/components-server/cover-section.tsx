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
   
      {images.length > 0 && <SwiperCover images={images} />}

      {/* <blockquote className="cover-quote">
        Photography teaches you to slow down and pay attention. The most
        meaningful moments are often the ones that would otherwise go unnoticed.
      </blockquote> */}

      <div className="cover-content">
        <h1 className="cover-title text-uppercase">{title}</h1>
        {subtitle && <h2 className="cover-subtitle">{subtitle}</h2>}
        <SocialLinks className="cover-social" />
      </div>
    </div>
  );
}
