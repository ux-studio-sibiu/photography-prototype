import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import MotionGallery, {
  type MotionItem,
} from "@/app/components/motion-gallery/motion-gallery";
import { getPortfolioCategories } from "@/sanity/sanity.query";
import "../page.scss";
import "../white/white.scss"; // light theme (cover + footer + body bg)

// Placeholder images (web-prototypes/photography/images).
import apartmentWindow from "@/images/Apartment-Window-Pripyat-2004.jpg";
import fearOfGod1 from "@/images/Fear-of-God-V_I.jpg";
import fearOfGod6 from "@/images/Fear-of-God-VI-VI.jpg";
import highway from "@/images/Highway-Development-II-Los-Angeles-2005.jpg";
import pathway from "@/images/Pathway-Pripyat-Ukraine-2004.jpg";
import schoolLibrary from "@/images/School-Library-Pripyat-Ukraine-2004.jpg";
import winonaRyder from "@/images/Winona-Ryder-V-Los-Angeles-USA.jpg";

export const revalidate = 60; // seconds

const placeholderItems: MotionItem[] = [
  { title: "Pripyat", images: [apartmentWindow, schoolLibrary, pathway] },
  { title: "Fear of God", images: [fearOfGod1, fearOfGod6] },
  { title: "Los Angeles", images: [highway, winonaRyder] },
];

export default async function GalleryV2() {
  const categories = await getPortfolioCategories();

  const sanityItems: MotionItem[] = (categories ?? [])
    .filter((c) => c?.photos?.[0]?.url)
    .map((c) => ({
      title: c.name || "Untitled",
      images: c.photos.filter((p) => p?.url).map((p) => p.url),
    }));

  const items = sanityItems.length > 0 ? sanityItems : placeholderItems;

  return (
    <main id="nsc--main" className="theme-white">
      <CoverSection />
      <MotionGallery items={items} />
      <FooterSection />
    </main>
  );
}
