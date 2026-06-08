import "./testimonials-row.scss";

interface Testimonial {
  name: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface TestimonialsRowProps {
  testimonials?: Testimonial[];
  /** Figures shown in the green panel on the left. */
  stats?: Stat[];
  className?: string;
}

// Default figures (photography-specific). Override via the `stats` prop.
const DEFAULT_STATS: Stat[] = [
  { value: "74", label: "Clients & Partners" },
  { value: "214", label: "Photographed Properties" },
  { value: "255", label: "Events" },
];

/**
 * Full-width, horizontal testimonials: a green figures panel on the left and a
 * row of testimonial cards on the right.
 */
export default function TestimonialsRow({
  testimonials,
  stats = DEFAULT_STATS,
  className = "",
}: TestimonialsRowProps) {
  const items = (testimonials ?? []).filter(
    (t) => t.name?.trim() || t.description?.trim(),
  );
  if (items.length === 0 && stats.length === 0) return null;

  return (
    <section className={`testimonials-row ${className}`.trim()}>
      <aside className="testimonials-row-stats">
        <p className="testimonials-row-stats-title">In numbers</p>
        <div className="testimonials-row-stats-list">
          {stats.map((s, i) => (
            <div key={i} className="testimonials-row-stat">
              <span className="testimonials-row-stat-value">{s.value}</span>
              <span className="testimonials-row-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="testimonials-row-cards">
        {items.slice(0, 3).map((t, i) => (
          <figure key={i} className="testimonials-row-card">
            <span className="testimonials-row-mark" aria-hidden="true">
              &#10078;
            </span>
            <blockquote className="testimonials-row-quote">
              {t.description}
            </blockquote>
            <figcaption className="testimonials-row-name">{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
