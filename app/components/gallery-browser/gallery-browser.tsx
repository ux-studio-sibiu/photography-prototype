"use client";

import { useEffect, useRef, useState } from "react";
import CollapsibleSidebar from "../collapsible-sidebar/collapsible-sidebar";
import GalleryDisplay from "../gallery-display/gallery-display";
import MobileGallery from "../mobile-gallery/mobile-gallery";
import type { GalleryType, PortfolioCategoryType } from "@/types";

interface GalleryBrowserProps {
  categories: PortfolioCategoryType[];
  /** All linkable galleries, keyed by slug (preloaded on the server). */
  galleries: Record<string, GalleryType>;
  social?: Record<string, string>;
  /** Gallery to show on first render (server-resolved from ?c=). */
  initialSlug?: string;
  /** Canonical default gallery — shown for the clean URL (no ?c=). */
  defaultSlug?: string;
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
  defaultSlug = "portfolio",
}: GalleryBrowserProps) {
  const [active, setActive] = useState(initialSlug);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Sync from the URL on mount and on back/forward navigation.
  useEffect(() => {
    const read = () => {
      const c = new URLSearchParams(window.location.search).get("c");
      setActive(c && galleries[c] ? c : defaultSlug);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [galleries, defaultSlug]);

  const select = (slug: string) => {
    if (!galleries[slug]) return;
    setActive(slug);
    const url =
      slug === defaultSlug
        ? window.location.pathname + window.location.hash
        : `?c=${slug}`;
    window.history.pushState(null, "", url);
    // Bring the gallery to the top of the viewport after switching.
    desktopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const gallery = galleries[active] ?? galleries[defaultSlug] ?? null;

  return (
    <div id="gallery" className="gallery-container">
      <CollapsibleSidebar
        categories={categories}
        activeSlug={active}
        onSelect={select}
      />

      <div className="gallery-desktop" ref={desktopRef}>
        {/* key={active} → clean remount per switch: re-triggers the fade-in
            and the blur-up placeholders (no index-key node reuse). */}
        <GalleryDisplay key={active} gallery={gallery} social={social} />
      </div>

      <div className="gallery-mobile">
        <MobileGallery key={active} gallery={gallery} />
      </div>
    </div>
  );
}
