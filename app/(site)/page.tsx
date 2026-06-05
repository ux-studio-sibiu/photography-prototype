import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import GalleryDisplay from "@/app/components/gallery-display/gallery-display";
import NavMenu from "@/app/components/nav-menu/nav-menu";
import SocialLinks from "@/app/components/social-links/social-links";
import { getPortfolioCategories, getGalleryBySlug } from "@/sanity/sanity.query";
import "./page.scss";
import "./gallery-v2/gallery-v2.scss";

export const revalidate = 60; // seconds

export default async function Home() {
  const [categories, gallery] = await Promise.all([
    getPortfolioCategories(),
    getGalleryBySlug("portfolio"),
  ]);

  return (
    <main id="nsc--main">
      <NavMenu
        items={[
          { label: "Despre mine", href: "/about" },
          { label: "Portofoliu", href: "#gallery" },
          { label: "Calendar", href: "/calendar" },
          { label: "Contact", href: "/contact" },
          // { label: "Studio", href: "/gallery/portfolio" },
        ]}
      />
      <CoverSection />
      <div id="gallery" className="gallery-container">
        <aside className="gallery-sidebar">
          <div className="gallery-sidebar-content">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category._id} className="gallery-sidebar-item">
                  {category.name}
                </div>
              ))
            ) : (
              <div className="gallery-sidebar-empty">Portfolio</div>
            )}
          </div>
        </aside>
        <GalleryDisplay gallery={gallery}>
          <SocialLinks />
        </GalleryDisplay>
      </div>

      <FooterSection />
    </main>
  );
}
