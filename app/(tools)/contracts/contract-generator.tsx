"use client";

import { useMemo, useState } from "react";
import type { ContractTemplateType, ContractVariable } from "@/types";
import { ContractDocument } from "@/app/components/contract/contract-document";

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "contract"
  );
}

/** Build the initial value map for a template from each variable's default. */
function initialValues(template: ContractTemplateType): Record<string, string> {
  const next: Record<string, string> = {};
  for (const variable of template.variables ?? []) {
    next[variable.key] = variable.defaultValue ?? "";
  }
  return next;
}

function VariableField({
  variable,
  value,
  onChange,
}: {
  variable: ContractVariable;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `var-${variable.key}`;
  const label = (
    <label htmlFor={id}>
      {variable.label}
      {variable.required ? <span className="required"> *</span> : null}
      <code>{`{${variable.key}}`}</code>
    </label>
  );

  if (variable.type === "multiline") {
    return (
      <div className="field">
        {label}
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  const inputType =
    variable.type === "date"
      ? "date"
      : variable.type === "number" || variable.type === "currency"
        ? "number"
        : "text";

  return (
    <div className="field">
      {label}
      <input
        id={id}
        type={inputType}
        step={variable.type === "currency" ? "0.01" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ContractGenerator({
  templates,
}: {
  templates: ContractTemplateType[];
}) {
  const [templateId, setTemplateId] = useState(templates[0]?._id ?? "");
  // Outline elements in the preview to inspect spacing (screen only).
  const [debug, setDebug] = useState(false);
  // Live form edits, keyed by template id.
  const [draftByTemplate, setDraftByTemplate] = useState<
    Record<string, Record<string, string>>
  >({});
  // The values currently rendered into the preview / download. Only synced from
  // the draft when the user clicks “Update preview”, so typing never re-renders
  // the (expensive) PDF.
  const [committedByTemplate, setCommittedByTemplate] = useState<
    Record<string, Record<string, string>>
  >({});

  const template = useMemo(
    () => templates.find((t) => t._id === templateId),
    [templates, templateId],
  );

  // Stable per-template default maps so unedited value references stay constant
  // between renders — that's what keeps the memoized PDF from regenerating.
  const initialByTemplate = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const t of templates) map[t._id] = initialValues(t);
    return map;
  }, [templates]);

  const values = template
    ? (draftByTemplate[template._id] ?? initialByTemplate[template._id])
    : {};
  const committed = template
    ? (committedByTemplate[template._id] ?? initialByTemplate[template._id])
    : {};
  const isDirty = values !== committed;

  const setValue = (key: string, value: string) => {
    if (!template) return;
    setDraftByTemplate((prev) => ({
      ...prev,
      [template._id]: {
        ...(prev[template._id] ?? initialByTemplate[template._id]),
        [key]: value,
      },
    }));
  };

  const updatePreview = () => {
    if (!template) return;
    setCommittedByTemplate((prev) => ({ ...prev, [template._id]: values }));
  };

  if (templates.length === 0) {
    return (
      <div className="contract-empty">
        <h1>Contract Generator</h1>
        <p>
          No contract templates yet. Create one in the{" "}
          <a href="/studio" target="_blank" rel="noreferrer">
            Sanity Studio
          </a>{" "}
          under “Contract Templates”, then reload this page.
        </p>
      </div>
    );
  }

  // Export via the browser's print-to-PDF. Set the document title first so the
  // "Save as PDF" dialog suggests a sensible filename, then restore it.
  const handlePrint = () => {
    if (!template) return;
    const prev = document.title;
    document.title = slugify(template.title);
    const restore = () => {
      document.title = prev;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <div className="contract-generator">
      <aside className="panel">
        <h1>Contract Generator</h1>

        <div className="field">
          <label htmlFor="template-select">Template</label>
          <select
            id="template-select"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {template?.description ? (
          <p className="template-desc">{template.description}</p>
        ) : null}

        <div className="fields">
          {(template?.variables ?? []).map((variable) => (
            <VariableField
              key={variable._key ?? variable.key}
              variable={variable}
              value={values[variable.key] ?? ""}
              onChange={(v) => setValue(variable.key, v)}
            />
          ))}
          {(template?.variables ?? []).length === 0 ? (
            <p className="hint">This template has no variables to fill in.</p>
          ) : null}
        </div>

        <div className="actions">
          <button
            type="button"
            className={`update-btn${isDirty ? " is-dirty" : ""}`}
            onClick={updatePreview}
            disabled={!isDirty}
          >
            {isDirty ? "Update preview" : "Preview up to date"}
          </button>

          <button
            type="button"
            className="download-btn"
            onClick={handlePrint}
          >
            Download PDF
          </button>
        </div>

        {isDirty ? (
          <p className="stale-hint">
            The preview and download reflect your last update. Click “Update
            preview” to apply your latest changes.
          </p>
        ) : null}

        <label className="debug-toggle">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
          Debug layout (preview only)
        </label>
      </aside>

      <section className="preview">
        {template ? (
          <div className="preview-scroll">
            <ContractDocument
              template={template}
              values={committed}
              debug={debug}
            />
          </div>
        ) : (
          <p className="preview-status">Loading preview…</p>
        )}
      </section>
    </div>
  );
}
