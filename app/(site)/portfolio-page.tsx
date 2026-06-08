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
    .filter((c) => c.gallery?.coverUrl)
    .map((c) => ({
      src: c.gallery!.coverUrl!,
      images: c.gallery!.images, // looping slideshow when the gallery has >1 image
      title: c.name || "Untitled",
    }));

  return (
    <main id="nsc--main">
      <CoverSection />
      <ZoomGallery items={items} />
      <FooterSection />
    </main>
  );
}
