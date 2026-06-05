"use client";

import { useState } from "react";
import type { PortfolioCategoryType } from "@/types";
import "./collapsible-sidebar.scss";

interface CollapsibleSidebarProps {
  categories: PortfolioCategoryType[];
}

export default function CollapsibleSidebar({ categories }: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="collapsible-sidebar">
      <button
        className="collapsible-sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>Portfolio</span>
        <svg
          className={`collapsible-icon ${isOpen ? "open" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="10" y1="5" x2="10" y2="15" />
          <line x1="5" y1="10" x2="15" y2="10" />
        </svg>
      </button>

      <div className={`collapsible-sidebar-content ${isOpen ? "open" : ""}`}>
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
      </div>
    </aside>
  );
}
