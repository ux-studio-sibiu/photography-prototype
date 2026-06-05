import "./icon-button.scss";

export interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function CloseButton({ onClick, className, ariaLabel }: CloseButtonProps) {
  return (
    <button
      type="button"
      className={`icon-btn icon-btn--close ${className || ""}`}
      onClick={onClick}
      aria-label={ariaLabel || "Close"}
    >
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6l20 20M26 6L6 26" />
      </svg>
    </button>
  );
}
