import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ContractTemplateType } from "@/types";
import { buildResolvedMap } from "./helpers";
import { buildContractComponents } from "./portable-text-components";
import "./contract-document.scss";

/**
 * HTML rendering of a contract — the single source of truth for both the
 * on-screen preview and the printed PDF (via window.print()). Styled entirely
 * with real CSS in contract-document.scss, so the full layout toolbox is
 * available (@page, break-inside, grid, web fonts, etc.).
 */
export function ContractDocument({
  template,
  values,
  debug = false,
}: {
  template: ContractTemplateType;
  values: Record<string, string>;
  /** Outline every element to inspect spacing/boxes (screen only). */
  debug?: boolean;
}) {
  const accentColor = template.accentColor || "#1a1a1a";
  const resolved = buildResolvedMap(template.variables, values);
  const components = buildContractComponents(resolved);
  const body = (template.body as PortableTextBlock[] | undefined) ?? [];

  return (
    <article
      className={`contract-doc${debug ? " is-debug" : ""}`}
      style={{ "--accent": accentColor } as React.CSSProperties}
    >
      {template.headerText || template.logoUrl ? (
        <div className="contract-header">
          {template.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="contract-logo" src={template.logoUrl} alt="" />
          ) : (
            <span />
          )}
          {template.headerText ? (
            <span className="contract-header-text">{template.headerText}</span>
          ) : null}
        </div>
      ) : null}

      <header className="contract-titleblock">
        <h1 className="contract-title">{template.title}</h1>
        <span className="contract-title-rule" />
      </header>

      <div className="contract-body">
        <PortableText value={body} components={components} />
      </div>

      {template.footerText ? (
        <footer className="contract-footer">{template.footerText}</footer>
      ) : null}
    </article>
  );
}
