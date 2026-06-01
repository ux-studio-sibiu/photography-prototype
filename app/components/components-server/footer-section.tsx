import "./footer-section.scss";
import Link from "next/link";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

export type FooterSectionProps = {
  brand?: string;
  tagline?: string;
  columns?: FooterColumn[];
  email?: string;
  phone?: string;
  location?: string;
  social?: FooterLink[];
};

// ─── Mock data (replace with Sanity later) ──────────────────────────────
const MOCK_COLUMNS: FooterColumn[] = [
  {
    title: "Work",
    links: [
      { label: "Portfolio", href: "#" },
      { label: "Series", href: "#" },
      { label: "Prints", href: "#" },
      { label: "Archive", href: "#" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", href: "#" },
      { label: "Process", href: "#" },
      { label: "Press", href: "#" },
      { label: "Journal", href: "#" },
    ],
  },
];

const MOCK_SOCIAL: FooterLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export default function FooterSection({
  brand = "Photography",
  tagline = "Capturing moments, one frame at a time.",
  columns = MOCK_COLUMNS,
  email = "hello@photography.studio",
  phone = "+40 700 000 000",
  location = "Sibiu, Romania",
  social = MOCK_SOCIAL,
}: FooterSectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer id="nsc--footer" className="clearfix">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name text-uppercase">{brand}</span>
          <p className="brand-tagline">{tagline}</p>
        </div>

        <nav className="footer-nav">
          {columns.map((col) => (
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

          <div className="footer-col">
            <span className="col-title">Follow</span>
            <ul>
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="footer-link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>
          © {year} {brand}
        </span>
        <span className="footer-muted">All rights reserved.</span>
      </div>
    </footer>
  );
}
