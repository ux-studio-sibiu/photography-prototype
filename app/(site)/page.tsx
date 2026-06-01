import CoverSection from "@/app/components/components-server/cover-section";
import FooterSection from "@/app/components/components-server/footer-section";
import ZoomGallery, {
  type ZoomItem,
} from "@/app/components/zoom-gallery/zoom-gallery";
import { getPortfolioCategories } from "@/sanity/sanity.query";
import "./page.scss";

// Placeholder images (web-prototypes/photography/images).
import apartmentWindow from "@/images/Apartment-Window-Pripyat-2004.jpg";
import fearOfGod1 from "@/images/Fear-of-God-V_I.jpg";
import fearOfGod6 from "@/images/Fear-of-God-VI-VI.jpg";
import highway from "@/images/Highway-Development-II-Los-Angeles-2005.jpg";
import pathway from "@/images/Pathway-Pripyat-Ukraine-2004.jpg";
import schoolLibrary from "@/images/School-Library-Pripyat-Ukraine-2004.jpg";
import winonaRyder from "@/images/Winona-Ryder-V-Los-Angeles-USA.jpg";

export const revalidate = 60; // seconds

const galleryItems: ZoomItem[] = [
  { src: apartmentWindow, title: "Apartment Window, Pripyat", num: 7 },
  { src: highway, title: "Highway Development, Los Angeles", num: 3 },
  { src: schoolLibrary, title: "School Library, Pripyat", num: 10 },
  { src: pathway, title: "Pathway, Pripyat", num: 5, flip: true },
  { src: fearOfGod1, title: "Fear of God I" }, // pair (with next)
  { src: fearOfGod6, title: "Fear of God VI" }, // pair
  { src: winonaRyder, title: "Winona Ryder, Los Angeles", num: 2 },
];

export default async function Home() {
  // One gallery card per portfolio category, using the category's first photo.
  const categories = await getPortfolioCategories();

  const sanityItems: ZoomItem[] = (categories ?? [])
    .filter((c) => c?.photos?.[0]?.url)
    .map((c) => ({
      src: c.photos[0].url,
      title: c.name || "Untitled",
    }));

  // Fall back to the placeholder set while Sanity has no portfolio content yet,
  // so the gallery still renders something to iterate on.
  const usingSanity = sanityItems.length > 0;
  const items = usingSanity ? sanityItems : galleryItems;
  const pairStarts = usingSanity ? [] : [4];

  return (
    <main id="nsc--main">
      <CoverSection />
      <ZoomGallery items={items} pairStarts={pairStarts} />
      <FooterSection />
    </main>
  );
}
