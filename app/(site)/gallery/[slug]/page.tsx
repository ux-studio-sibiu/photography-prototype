import { Metadata } from "next";
import GalleryDisplay from "@/app/components/gallery-display/gallery-display";
import FooterSection from "@/app/components/components-server/footer-section";
import SocialLinks from "@/app/components/social-links/social-links";
import { getGalleryBySlug, getAllGallerySlugs } from "@/sanity/sanity.query";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllGallerySlugs();
  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  return {
    title: gallery?.name || "Gallery",
    description: `View the ${gallery?.name || "gallery"}`,
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  return (
    <main id="nsc--main">
      <GalleryDisplay gallery={gallery}>
        <SocialLinks />
      </GalleryDisplay>
      <FooterSection />
    </main>
  );
}
