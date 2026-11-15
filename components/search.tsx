"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchEntry } from "@/lib/majors";

function norm(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase();
}

function words(value: string): string[] {
  return value.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/**
 * Substring matching alone puts noise first: «طب» hits «الطبوغرافي» before
 * «الطب». Rank by where the query lands — a whole word, then a word start
 * (after the Arabic article), then anywhere — and let the shorter, broader
 * programme win the tie.
 */
function rank(entry: SearchEntry, q: string): number {
  const ar = norm(entry.ar);
  const fr = norm(entry.fr);
  const arWords = words(ar);
  const frWords = words(fr);

  const exact = arWords.findIndex((word) => word === q || word.replace(/^ال/, "") === q);
  if (exact >= 0) return exact * 0.1 + ar.length / 1000;

  const startAr = arWords.findIndex((word) => word.startsWith(q) || word.replace(/^ال/, "").startsWith(q));
  if (startAr >= 0) return 10 + startAr * 0.1 + ar.length / 1000;

  if (ar.includes(q)) return 20 + ar.length / 1000;

  const startFr = frWords.findIndex((word) => word.startsWith(q));
  if (startFr >= 0) return 30 + startFr * 0.1 + fr.length / 1000;

  if (fr.includes(q)) return 40 + fr.length / 1000;

  return Number.POSITIVE_INFINITY;
}

export function ProgramSearch({ index, tone = "light" }: { index: SearchEntry[]; tone?: "light" | "dark" }) {
  const [query, setQuery] = useState("");
  const dark = tone === "dark";
  const results = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 2) return [];
    return index
      .map((entry) => ({ entry, score: rank(entry, q) }))
      .filter((item) => Number.isFinite(item.score))
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((item) => item.entry);
  }, [index, query]);

  return (
    <div className="relative">
      <label htmlFor="program-search" className="eyebrow">
        ابحث عن تخصص
      </label>
      <input
        id="program-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="الطب، الإعلام الآلي، الحقوق…"
        className={
          dark
            ? "mt-2 h-12 w-full rounded-card border border-cream/35 bg-transparent px-4 text-[17px] text-cream outline-none placeholder:text-cream/45 focus:border-cream"
            : "mt-2 h-12 w-full rounded-card border border-line-strong bg-surface px-4 text-[17px] text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-1 focus:ring-brand"
        }
        autoComplete="off"
      />
      {results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-card border border-line-strong bg-surface">
          {results.map((entry) => (
            <li key={entry.slug} className="border-b border-line last:border-0">
              <Link href={`/takhasus/${entry.slug}`} className="flex items-baseline justify-between gap-3 px-4 py-2.5 hover:bg-raised">
                <span className="min-w-0">
                  <span className="block truncate text-[16px] font-semibold text-ink">{entry.ar}</span>
                  <span className="block truncate text-[13px] text-muted">{entry.field}</span>
                </span>
                <span className="num shrink-0 text-[13px] text-muted">{entry.institutions} مؤسسة</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
