/**
 * The mark: a gate — the one image every campus shares. Cream on the deep
 * navy tile, a copper inner arch and ground rule. No text, so it holds at
 * 16px as a favicon and at 64px beside the wordmark.
 */
export function Mark({ tone = "dark", className = "h-8 w-8" }: { tone?: "dark" | "light"; className?: string }) {
  const tile = tone === "light" ? "#f4efe3" : "#0f1524";
  const arch = tone === "light" ? "#0f1524" : "#f4efe3";

  return (
    <svg viewBox="0 0 64 64" aria-hidden focusable="false" className={className}>
      <rect width="64" height="64" rx="2" fill={tile} />
      <path d="M16 50V32c0-8.8 7.2-16 16-16s16 7.2 16 16v18" fill="none" stroke={arch} strokeWidth="3.5" />
      <path d="M24 50V33c0-4.4 3.6-8 8-8s8 3.6 8 8v17" fill="none" stroke="#c98e63" strokeWidth="2" />
      <rect x="10" y="50" width="44" height="2" fill="#c98e63" />
    </svg>
  );
}
