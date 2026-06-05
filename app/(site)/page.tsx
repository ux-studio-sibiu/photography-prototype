import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import GalleryDisplay from "@/app/components/gallery-display/gallery-display";
import MobileGallery from "@/app/components/mobile-gallery/mobile-gallery";
import NavMenu from "@/app/components/nav-menu/nav-menu";
import MobileSocialLinks from "@/app/components/social-links/mobile-social-links";
import CollapsibleSidebar from "@/app/components/collapsible-sidebar/collapsible-sidebar";
import {
  getPortfolioCategories,
  getGalleryBySlug,
  getGeneralInfo,
} from "@/sanity/sanity.query";
import "./page.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const [categories, gallery, info] = await Promise.all([
    getPortfolioCategories(),
    getGalleryBySlug("portfolio"),
    getGeneralInfo(),
  ]);

  return (
    <main id="nsc--main">
      <NavMenu
        items={[
          { label: "Despre mine", href: "/about" },
          { label: "Portofoliu", href: "#gallery" },
          { label: "Calendar", href: "/calendar" },
          { label: "Contact", href: "/contact" },
        ]}
      />
      <MobileSocialLinks social={info?.social} />
      <CoverSection />

      <div id="gallery" className="gallery-container">
        <CollapsibleSidebar categories={categories ?? []} />

        <div className="gallery-desktop">
          <GalleryDisplay gallery={gallery} social={info?.social} />
        </div>

        <div className="gallery-mobile">
          <MobileGallery gallery={gallery} />
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
