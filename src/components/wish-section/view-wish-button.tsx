type ViewWishesButtonProps = {
  href?: string; // renders a link, e.g. "#wish-list"
  onClick?: () => void; // or a button
  expanded?: boolean; // when it controls a list that can open
  className?: string;
};

const base =
  "group flex w-full items-center gap-3 rounded-full border-2 border-lime-200 bg-white/70 py-2.5 pl-3 pr-2.5 text-left transition hover:border-lime-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark";

export default function ViewWishesButton({
  href,
  onClick,
  expanded,
  className = "",
}: ViewWishesButtonProps) {
  const label = "Xem những lời chúc phúc khác.";

  const content = (
    <>
      <span className={`text-ink min-w-0 flex-1 truncate font-semibold`}>
        {label}
      </span>

      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-100 text-olive-700 transition group-hover:bg-lime-200"
      >
        <svg
          viewBox="0 0 24 24"
          className={`size-5 transition-transform duration-300 ${
            expanded ? "rotate-180" : "group-hover:translate-y-0.5"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${base} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={`${base} ${className}`}
    >
      {content}
    </button>
  );
}
