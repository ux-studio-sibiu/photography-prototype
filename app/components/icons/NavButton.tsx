import { ReactNode } from "react";
import "./icon-button.scss";

export interface NavButtonProps {
  direction: "prev" | "next";
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function NavButton({
  direction,
  onClick,
  className,
  ariaLabel,
}: NavButtonProps) {
  return (
    <button
      type="button"
      className={`icon-btn icon-btn--nav icon-btn--nav-${direction} ${className || ""}`}
      onClick={onClick}
      aria-label={ariaLabel || (direction === "prev" ? "Previous" : "Next")}
      style={direction === "next" ? { transform: "scaleX(-1)" } : undefined}
    >
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" />
      </svg>
    </button>
  );
}
