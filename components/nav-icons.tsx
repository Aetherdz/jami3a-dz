/**
 * Hairline navigation icons.
 *
 * One grid (24×24), one stroke weight, no fills except the calculator keys, so
 * the mobile bar reads as a set rather than five borrowed glyphs.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export function IconHome({ className = "" }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-5.5h5V21" />
    </svg>
  );
}

export function IconInstitutions({ className = "" }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21h18" />
      <path d="M5 21V9h14v12" />
      <path d="M3 9l9-5 9 5" />
      <path d="M9 12v6M15 12v6" />
    </svg>
  );
}

export function IconCalculator({ className = "" }: Props) {
  return (
    <svg {...base} className={className}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M8.5 7.5h7" />
      <circle cx="9" cy="12.5" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12.5" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.5" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="9" cy="16.5" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="0.85" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16.5" r="0.85" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconProgrammes({ className = "" }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 5.5A1.5 1.5 0 0 1 6 4h4v16H6a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M10 4h8a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20h-8" />
      <path d="M13 8.5h3.5M13 12h3.5" />
    </svg>
  );
}

export function IconLife({ className = "" }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="9.5" cy="8" r="3.25" />
      <path d="M3.5 20c0-3.2 2.7-5.75 6-5.75s6 2.55 6 5.75" />
      <path d="M16.25 5.25a2.6 2.6 0 0 1 0 5.2" />
      <path d="M17.5 14.6c1.9.7 3.2 2.5 3.2 4.75" />
    </svg>
  );
}
