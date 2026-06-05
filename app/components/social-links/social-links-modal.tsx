'use client';

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'pinterest', label: 'Pinterest' },
] as const;

export function SocialLinksModal({ social, className = '' }: { social?: any; className?: string }) {
  if (!social) return null;

  const links = PLATFORMS.map((p) => ({ ...p, href: social[p.key] })).filter((p) => p.href && p.href.trim());

  if (links.length === 0) return null;

  return (
    <div className={`social-links-modal ${className}`.trim()}>
      {links.map((item) => (
        <a key={item.key} href={item.href} target="_blank" rel="noreferrer noopener" className="social-links-modal-link">
          {item.label}
        </a>
      ))}
    </div>
  );
}
