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

export function ProgramSearch({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 2) return [];
    return index
      .filter((entry) => norm(entry.ar).includes(q) || norm(entry.fr).includes(q))
      .slice(0, 8);
  }, [index, query]);

  return (
    <div className="relative">
      <label htmlFor="program-search" className="eyebrow">ابحث عن تخصص</label>
      <input
        id="program-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="الطب، الإعلام الآلي، الحقوق…"
        className="mt-2 h-12 w-full rounded-card border border-line-strong bg-surface px-4 text-[15px] text-ink outline-none placeholder:text-muted/70 focus:border-brand focus:ring-1 focus:ring-brand"
        autoComplete="off"
      />
      {results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-card border border-line-strong bg-surface">
          {results.map((entry) => (
            <li key={entry.slug} className="border-b border-line last:border-0">
              <Link href={`/takhasus/${entry.slug}`} className="flex items-baseline justify-between gap-3 px-4 py-2.5 hover:bg-raised">
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold text-ink">{entry.ar}</span>
                  <span className="block truncate text-[11px] text-muted">{entry.field}</span>
                </span>
                <span className="num shrink-0 text-[11px] text-muted">{entry.institutions} مؤسسة</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
