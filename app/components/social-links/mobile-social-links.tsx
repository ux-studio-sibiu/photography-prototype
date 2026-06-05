import { SOCIAL_ICONS } from "./social-links";
import "./mobile-social-links.scss";

const PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "pinterest", label: "Pinterest" },
  { key: "instagram", label: "Instagram" },
] as const;

interface MobileSocialLinksProps {
  social?: Record<string, string>;
}

export default function MobileSocialLinks({ social = {} }: MobileSocialLinksProps) {
  const links = PLATFORMS.map((p) => ({ ...p, href: social[p.key] })).filter(
    (p) => p.href && p.href.trim(),
  );

  if (links.length === 0) return null;

  return (
    <div className="mobile-social-links">
      {links.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className="mobile-social-links-icon"
          target="_blank"
          rel="noreferrer noopener"
          aria-label={item.label}
        >
          {SOCIAL_ICONS[item.key]}
        </a>
      ))}
    </div>
  );
}
