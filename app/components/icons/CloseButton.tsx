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
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" fill="currentColor" stroke="#000000" strokeWidth="0.5" />
      </svg>
    </button>
  );
}
