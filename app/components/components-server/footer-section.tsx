import "./footer-section.scss";
import Link from "next/link";
import { getGalleryLinks, getGeneralInfo } from "@/sanity/sanity.query";
import { SOCIAL_ICONS } from "../social-links/social-links";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

export type FooterSectionProps = {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  email?: string;
  phone?: string;
  location?: string;
};

// Primary navigation (mirrors the top nav) plus pages that exist but aren't
// linked anywhere else in the UI yet.
const EXPLORE_COLUMN: FooterColumn = {
  title: "Explore",
  links: [
    // Top navigation
    { label: "Despre mine", href: "/about" },
    { label: "Portofoliu", href: "/#gallery" },
    { label: "Calendar", href: "/calendar" },
    { label: "Contact", href: "/contact" },
    // Not surfaced elsewhere yet
    { label: "Contracte", href: "/contracts" },
    { label: "Showcase", href: "/white" },
    { label: "Studio", href: "/studio" },
  ],
};

export default async function FooterSection({
  brand = "Photography",
  tagline = "Capturing moments, one frame at a time.",
  columns,
  email = "hello@photography.studio",
  phone = "+40 700 000 000",
  location = "Sibiu, Romania",
}: FooterSectionProps) {
  const year = new Date().getFullYear();

  // Build the Galleries column from Sanity (falls back to empty list).
  const galleries = await getGalleryLinks();
  const galleriesColumn: FooterColumn = {
    title: "Galleries",
    links: (galleries ?? [])
      .filter((g) => g.slug)
      .map((g) => ({
        label: g.name || "Untitled",
        href: `/gallery/${g.slug}`,
      })),
  };

  const resolvedColumns = columns ?? [EXPLORE_COLUMN, galleriesColumn];

  // Social links from Sanity — only the ones that are filled in.
  const info = await getGeneralInfo();
  const social = info?.social ?? {};
  const socialLinks = (
    [
      { key: "facebook", label: "Facebook", href: social.facebook },
      { key: "pinterest", label: "Pinterest", href: social.pinterest },
      { key: "instagram", label: "Instagram", href: social.instagram },
    ] as const
  ).filter((s) => s.href && s.href.trim());

  return (
    <footer id="nsc--footer" className="clearfix">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name text-uppercase">{brand}</span>
          <p className="brand-tagline">{tagline}</p>
        </div>

        <nav className="footer-nav">
          {resolvedColumns.map((col) => (
            <div className="footer-col" key={col.title}>
              <span className="col-title">{col.title}</span>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <span className="col-title">Contact</span>
            <ul>
              <li>
                <a href={`mailto:${email}`} className="footer-link">
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="footer-link"
                >
                  {phone}
                </a>
              </li>
              <li className="footer-muted">{location}</li>
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div className="footer-col">
              <span className="col-title">Follow</span>
              <ul>
                {socialLinks.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="footer-link footer-social"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className="footer-social-icon">
                        {SOCIAL_ICONS[item.key]}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>

    </footer>
  );
}
