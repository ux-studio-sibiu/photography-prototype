import "./testimonials.scss";
import TestimonialsMobile from "./testimonials-mobile";

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

      {/* Desktop: grid. Mobile: swiper with dots (see TestimonialsMobile). */}
      <div className="testimonials-grid testimonials-desktop">
        {items.map((t, i) => (
          <figure key={i} className="testimonials-card">
            <blockquote className="testimonials-quote">{t.description}</blockquote>
            <figcaption className="testimonials-name">{t.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="testimonials-mobile">
        <TestimonialsMobile items={items} />
      </div>
    </section>
  );
}
