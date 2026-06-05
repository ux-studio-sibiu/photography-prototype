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
