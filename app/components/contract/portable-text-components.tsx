import type { PortableTextComponents } from "@portabletext/react";

/**
 * Builds the @portabletext/react component map for the contract. The `resolved`
 * map supplies the final display string for each inline `variable` marker
 * (formatting + placeholders handled upstream in helpers.ts).
 *
 * Styling lives in contract-document.scss — these components only assign
 * semantic classes, so the full CSS toolbox controls the look.
 */
export function buildContractComponents(
  resolved: Record<string, string>,
): PortableTextComponents {
  return {
    types: {
      // Inline variable marker → substituted value, bold so it stands out.
      variable: ({ value }: { value: { key?: string } }) => (
        <strong className="c-var">
          {value.key ? (resolved[value.key] ?? `{${value.key}}`) : ""}
        </strong>
      ),
    },
    block: {
      normal: ({ children }) => <p className="c-p">{children}</p>,
      h2: ({ children }) => <h2 className="c-h2">{children}</h2>,
      h3: ({ children }) => <h3 className="c-h3">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="c-quote">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="c-ul">{children}</ul>,
      number: ({ children }) => <ol className="c-ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="c-li">{children}</li>,
      number: ({ children }) => <li className="c-li">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      underline: ({ children }) => <span className="c-u">{children}</span>,
      link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
        <a className="c-link" href={value?.href} target="_blank" rel="noreferrer">
          {children}
        </a>
      ),
    },
  };
}
