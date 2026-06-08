import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import GalleryBrowser from "@/app/components/gallery-browser/gallery-browser";
import NavMenu from "@/app/components/nav-menu/nav-menu";
import MobileSocialLinks from "@/app/components/social-links/mobile-social-links";
import TestimonialsRow from "@/app/components/testimonials/testimonials-row";
import Testimonials from "@/app/components/testimonials/testimonials";
import {
  getPortfolioCategories,
  getAllGalleries,
  getGeneralInfo,
} from "@/sanity/sanity.query";
import type { GalleryType } from "@/types";
import "./page.scss";

export const revalidate = 60; // seconds

const DEFAULT_SLUG = "portfolio";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const [{ c }, categories, galleries, info] = await Promise.all([
    searchParams,
    getPortfolioCategories(),
    getAllGalleries(),
    getGeneralInfo(),
  ]);

  // Key galleries by slug so the browser can swap between them client-side.
  const galleriesBySlug: Record<string, GalleryType> = {};
  (galleries ?? []).forEach((g) => {
    if (g?.slug?.current) galleriesBySlug[g.slug.current] = g;
  });

  // Render the requested gallery (?c=) on the server so it shows immediately —
  // no flash of the default gallery before the client swaps.
  const initialSlug = c && galleriesBySlug[c] ? c : DEFAULT_SLUG;

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

      <GalleryBrowser
        categories={categories ?? []}
        galleries={galleriesBySlug}
        social={info?.social}
        initialSlug={initialSlug}
        defaultSlug={DEFAULT_SLUG}
      />

      {/* <TestimonialsRow testimonials={info?.testimonials} /> */}
      <Testimonials testimonials={info?.testimonials} />

      <FooterSection />
    </main>
  );
}
