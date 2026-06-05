import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import ZoomGallery, {
  type ZoomItem,
} from "@/app/components/zoom-gallery/zoom-gallery";
import { getPortfolioCategories } from "@/sanity/sanity.query";
import "./page.scss";

/** Shared portfolio page body. */
export default async function PortfolioPage() {
  const categories = await getPortfolioCategories();

  const items: ZoomItem[] = (categories ?? [])
    .filter((c) => c?.photos?.[0]?.url)
    .map((c) => {
      const urls = c.photos.filter((p) => p?.url).map((p) => p.url);
      return {
        src: urls[0],
        images: urls, // looping slideshow when the category has >1 photo
        title: c.name || "Untitled",
      };
    });

  return (
    <main id="nsc--main">
      <CoverSection />
      <ZoomGallery items={items} />
      <FooterSection />
    </main>
  );
}
