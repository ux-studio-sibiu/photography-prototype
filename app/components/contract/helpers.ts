import type { ContractVariable } from "@/types";

/** Format a single raw form value according to the variable's type. */
export function formatVariableValue(
  variable: ContractVariable,
  raw: string | undefined,
): string {
  const value = (raw ?? "").trim();
  if (!value) return "";

  switch (variable.type) {
    case "number": {
      const n = Number(value);
      return Number.isFinite(n)
        ? new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 2 }).format(n)
        : value;
    }
    case "currency": {
      const n = Number(value);
      return Number.isFinite(n)
        ? new Intl.NumberFormat("ro-RO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(n)
        : value;
    }
    case "date": {
      const d = new Date(value);
      return Number.isNaN(d.getTime())
        ? value
        : new Intl.DateTimeFormat("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(d);
    }
    default:
      return value;
  }
}

/**
 * Build the map the renderer consumes: variable key → final display string.
 * Empty values fall back to the default, then to a "{label}" placeholder so
 * unfilled fields stay visible in the document.
 */
export function buildResolvedMap(
  variables: ContractVariable[] | undefined,
  values: Record<string, string>,
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const variable of variables ?? []) {
    const formatted = formatVariableValue(variable, values[variable.key]);
    if (formatted) {
      resolved[variable.key] = formatted;
    } else if (variable.defaultValue) {
      resolved[variable.key] = formatVariableValue(
        variable,
        variable.defaultValue,
      );
    } else {
      resolved[variable.key] = `{${variable.label || variable.key}}`;
    }
  }
  return resolved;
}
