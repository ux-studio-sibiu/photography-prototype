"use client";

import { useEffect, useState } from "react";
import CollapsibleSidebar from "../collapsible-sidebar/collapsible-sidebar";
import GalleryDisplay from "../gallery-display/gallery-display";
import MobileGallery from "../mobile-gallery/mobile-gallery";
import type { GalleryType, PortfolioCategoryType } from "@/types";

interface GalleryBrowserProps {
  categories: PortfolioCategoryType[];
  /** All linkable galleries, keyed by slug (preloaded on the server). */
  galleries: Record<string, GalleryType>;
  social?: Record<string, string>;
  /** Gallery shown on first load (and when the URL has no ?c=). */
  initialSlug?: string;
}

/**
 * Sidebar + gallery on one screen. Clicking a category swaps the gallery in
 * place (no navigation) and reflects the choice in the URL (?c=slug) so the
 * view is shareable and the back button works. Galleries are preloaded, so
 * swaps are instant.
 */
export default function GalleryBrowser({
  categories,
  galleries,
  social,
  initialSlug = "portfolio",
}: GalleryBrowserProps) {
  const [active, setActive] = useState(initialSlug);

  // Sync from the URL on mount and on back/forward navigation.
  useEffect(() => {
    const read = () => {
      const c = new URLSearchParams(window.location.search).get("c");
      setActive(c && galleries[c] ? c : initialSlug);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [galleries, initialSlug]);

  const select = (slug: string) => {
    if (!galleries[slug]) return;
    setActive(slug);
    const url =
      slug === initialSlug
        ? window.location.pathname + window.location.hash
        : `?c=${slug}`;
    window.history.pushState(null, "", url);
  };

  const gallery = galleries[active] ?? galleries[initialSlug] ?? null;

  return (
    <div id="gallery" className="gallery-container">
      <CollapsibleSidebar
        categories={categories}
        activeSlug={active}
        onSelect={select}
      />

      <div className="gallery-desktop">
        <GalleryDisplay gallery={gallery} social={social} />
      </div>

      <div className="gallery-mobile">
        <MobileGallery gallery={gallery} />
      </div>
    </div>
  );
}
