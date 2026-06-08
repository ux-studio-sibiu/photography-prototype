"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioCategoryType } from "@/types";
import "./collapsible-sidebar.scss";

interface CollapsibleSidebarProps {
  categories: PortfolioCategoryType[];
  /** Slug of the gallery currently shown (for highlighting). */
  activeSlug?: string;
  /** Called with the gallery slug when a linked category is clicked. */
  onSelect?: (slug: string) => void;
}

export default function CollapsibleSidebar({
  categories,
  activeSlug,
  onSelect,
}: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const sidebarRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && sidebarRef.current) {
      setTimeout(() => {
        sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  // Keep the group containing the active gallery expanded.
  useEffect(() => {
    if (!activeSlug) return;
    const parent = categories.find((c) =>
      c.subItems?.some((s) => s.gallery?.slug === activeSlug),
    );
    if (parent) {
      setExpanded((prev) =>
        prev.has(parent._id) ? prev : new Set(prev).add(parent._id),
      );
    }
  }, [activeSlug, categories]);

  const select = (slug: string) => {
    if (onSelect) onSelect(slug);
  };

  // A single clickable gallery entry (leaf category or sub-item).
  const renderLink = (
    key: string,
    name: string,
    slug: string,
    extraClass = "",
  ) => (
    <a
      key={key}
      href={`?c=${slug}`}
      className={`gallery-sidebar-item${slug === activeSlug ? " is-active" : ""}${extraClass}`}
      onClick={(e) => {
        e.preventDefault();
        select(slug);
      }}
    >
      {name}
    </a>
  );

  const renderCategory = (category: PortfolioCategoryType) => {
    const subs = (category.subItems ?? []).filter((s) => s.gallery?.slug);
    const ownSlug = category.gallery?.slug;

    // Expandable group
    if (subs.length > 0) {
      const open = expanded.has(category._id);
      const toggleGroup = () => {
        setExpanded((prev) => {
          const next = new Set(prev);
          next.has(category._id)
            ? next.delete(category._id)
            : next.add(category._id);
          return next;
        });
        if (ownSlug) select(ownSlug); // a parent gallery also shows on click
      };
      return (
        <div key={category._id} className="gallery-sidebar-group">
          <button
            type="button"
            className={`gallery-sidebar-item gallery-sidebar-grouptoggle${
              ownSlug && ownSlug === activeSlug ? " is-active" : ""
            }`}
            aria-expanded={open}
            onClick={toggleGroup}
          >
            <span>{category.name}</span>
            <span className="gallery-sidebar-count">
              {open ? "−" : `+${subs.length}`}
            </span>
          </button>
          <div className={`gallery-sidebar-subitems${open ? " open" : ""}`}>
            {subs.map((s) =>
              renderLink(
                s._key ?? s.name,
                s.name,
                s.gallery!.slug!,
                " is-sub",
              ),
            )}
          </div>
        </div>
      );
    }

    // Leaf with its own gallery
    if (ownSlug) return renderLink(category._id, category.name, ownSlug);

    // Nothing linked yet → inert
    return (
      <span key={category._id} className="gallery-sidebar-item is-inert">
        {category.name}
      </span>
    );
  };

  return (
    <aside className="collapsible-sidebar" ref={sidebarRef}>
      <button
        className="collapsible-sidebar-toggle"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span>Portfolio</span>
        <svg
          className={`collapsible-icon ${isOpen ? "open" : ""}`}
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="15" y1="7.5" x2="15" y2="22.5" />
          <line x1="7.5" y1="15" x2="22.5" y2="15" />
        </svg>
      </button>

      <div className={`collapsible-sidebar-content ${isOpen ? "open" : ""}`}>
        <div className="gallery-sidebar-content">
          {categories && categories.length > 0 ? (
            categories.map(renderCategory)
          ) : (
            <div className="gallery-sidebar-empty">Portfolio</div>
          )}
        </div>
      </div>
    </aside>
  );
}
