import "./testimonials.scss";

interface Testimonial {
  name: string;
  description: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  title?: string;
  className?: string;
}

/** Renders a grid of testimonials. Renders nothing if there are none. */
export default function Testimonials({
  testimonials,
  // title = "Testimonials",
  className = "",
}: TestimonialsProps) {
  const items = (testimonials ?? []).filter(
    (t) => t.name?.trim() || t.description?.trim(),
  );
  if (items.length === 0) return null;

  return (
    <section className={`testimonials ${className}`.trim()}>
      {/* <h2 className="testimonials-title">{title}</h2> */}

      <div className="testimonials-grid">
        {items.map((t, i) => (
          <figure key={i} className="testimonials-card">
            <blockquote className="testimonials-quote">{t.description}</blockquote>
            <figcaption className="testimonials-name">{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
