"use client";

import { SOCIAL_ICONS } from "./social-links";
import "./social-links.scss";

const PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "pinterest", label: "Pinterest" },
  { key: "instagram", label: "Instagram" },
] as const;

interface SocialLinksClientProps {
  social?: Record<string, string>;
  className?: string;
}

export default function SocialLinksClient({
  social = {},
  className = "",
}: SocialLinksClientProps) {
  const links = PLATFORMS.map((p) => ({ ...p, href: social[p.key] })).filter(
    (p) => p.href && p.href.trim(),
  );

  if (links.length === 0) return null;

  return (
    <div className={`social-links ${className}`.trim()}>
      {links.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className="social-links-item"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="social-links-icon">{SOCIAL_ICONS[item.key]}</span>
          {item.label}
        </a>
      ))}
    </div>
  );
}
