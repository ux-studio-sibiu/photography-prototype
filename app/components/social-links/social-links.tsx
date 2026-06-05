import { getGeneralInfo } from "@/sanity/sanity.query";
import "./social-links.scss";

// Monochrome icons, inherit currentColor.
export const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.47-4.05 4.17v2.33H7.5V13h2.65v8h3.35Z" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.5 2 4 5.7 4 9c0 2 .76 3.78 2.4 4.44.27.11.5 0 .58-.29l.24-.95c.08-.3.05-.4-.17-.66-.48-.57-.79-1.3-.79-2.34 0-3.02 2.26-5.72 5.88-5.72 3.2 0 4.96 1.96 4.96 4.58 0 3.45-1.53 6.36-3.8 6.36-1.25 0-2.19-1.04-1.89-2.31.36-1.52 1.06-3.16 1.06-4.26 0-.98-.53-1.8-1.62-1.8-1.28 0-2.32 1.33-2.32 3.11 0 1.13.39 1.9.39 1.9l-1.53 6.5c-.46 1.92-.07 4.28-.04 4.51.02.14.2.17.28.07.12-.16 1.66-2.06 2.19-3.96.15-.54.86-3.36.86-3.36.42.81 1.66 1.52 2.98 1.52 3.92 0 6.58-3.57 6.58-8.36C20.96 5.4 17.9 2 12 2Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  ),
};

const PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "pinterest", label: "Pinterest" },
  { key: "instagram", label: "Instagram" },
] as const;

/**
 * Renders the configured social links (from Setări website) as a centered row
 * of icon + label links. Renders nothing if no links are set.
 */
export default async function SocialLinks({
  className = "",
}: {
  className?: string;
}) {
  const info = await getGeneralInfo();
  const social = info?.social ?? {};

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
