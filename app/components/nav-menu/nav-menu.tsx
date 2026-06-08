"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      router.push('/');
    }
  };

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
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="nav-menu-item">
              <Link
                href={item.href}
                className={`nav-menu-link ${isActive ? "active" : ""}`}
                onClick={(e) => {
                  // Drop focus so the tapped link doesn't retain a sticky
                  // focus/hover style on touch devices.
                  e.currentTarget.blur();
                  setIsOpen(false);
                  // In-page "Portofoliu" anchor also opens the portfolio
                  // sidebar (mobile) and scrolls it into view.
                  if (item.href === "#gallery") {
                    window.dispatchEvent(new Event("nsc:open-portfolio"));
                  }
                  if (isActive) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
