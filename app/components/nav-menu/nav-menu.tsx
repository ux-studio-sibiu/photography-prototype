"use client";

import { useState } from "react";
import "./nav-menu.scss";

export interface NavMenuItem {
  label: string;
  href: string;
}

interface NavMenuProps {
  items: NavMenuItem[];
  className?: string;
}

export default function NavMenu({
  items,
  className = "",
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`nav-menu ${className}`.trim()}>
      <button
        className="nav-menu-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-menu-list ${isOpen ? "open" : ""}`}>
        {items.map((item) => (
          <li key={item.href} className="nav-menu-item">
            <a href={item.href} className="nav-menu-link">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
