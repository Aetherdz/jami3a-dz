"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Track } from "@/lib/majors";

export type ProgramListItem = {
  slug: string;
  ar: string;
  fr: string;
  institutions: number;
  theme: string;
  track: Track;
};

const trackOrder: Track[] = ["licence", "teaching", "school", "continuing", "professional", "distance"];

const trackNames: Record<Track, { short: string; note?: string }> = {
  licence: { short: "ليسانس جامعية" },
  teaching: {
    short: "مدارس الأساتذة",
    note: "مسارات تكوين أساتذة التعليم (ابتدائي، متوسط، ثانوي) في المدارس العليا للأساتذة؛ بعضها يشترط مقابلة أو اختبارًا.",
  },
  school: {
    short: "مدارس عليا",
    note: "تكوين داخل مدارس عليا وطنية، بأعداد مقاعد محدودة.",
  },
  continuing: { short: "تكوين مستمر", note: "تكوين موجه للموظفين أو لحاملي شهادات سابقة، بصفة منفصلة عن التكوين العادي." },
  professional: { short: "تكوين مهني", note: "تكوينات مهنية قصيرة أو مدمجة مع الجامعة، بمسارات محددة." },
  distance: { short: "عن بعد", note: "تكوين عن بعد، غالبًا بحدود دنيا مختلفة عن الحضوري." },
};

const initialPerTheme = 6;

export function ProgramList({ items }: { items: ProgramListItem[] }) {
  const tracks = useMemo(() => {
    const counts = new Map<Track, number>();
    for (const item of items) counts.set(item.track, (counts.get(item.track) ?? 0) + 1);
    return trackOrder.filter((track) => counts.has(track));
  }, [items]);

  const [track, setTrack] = useState<Track>(() => (tracks.includes("licence") ? "licence" : tracks[0] ?? "licence"));
  const [open, setOpen] = useState<Set<string>>(new Set());

  const themes = useMemo(() => {
    const map = new Map<string, ProgramListItem[]>();
    for (const item of items) {
      if (item.track !== track) continue;
      const bucket = map.get(item.theme);
      if (bucket) bucket.push(item);
      else map.set(item.theme, [item]);
    }
    return [...map.entries()]
      .map(([theme, list]) => ({
        theme,
        programs: list.sort((a, b) => b.institutions - a.institutions || a.ar.localeCompare(b.ar, "ar")),
      }))
      .sort((a, b) => b.programs.length - a.programs.length || a.theme.localeCompare(b.theme, "ar"));
  }, [items, track]);

  const countFor = (value: Track) => items.filter((item) => item.track === value).length;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line py-4">
        {tracks.map((value) => {
          const active = value === track;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTrack(value);
                setOpen(new Set());
              }}
              aria-pressed={active}
              className={`inline-flex h-11 items-center rounded-card border px-4 text-[14px] font-medium transition-colors sm:h-9 ${
                active
                  ? "border-ink bg-ink text-bg"
                  : "border-line-strong bg-transparent text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {trackNames[value].short}
              <span className={`num mr-1.5 text-[12.5px] ${active ? "text-bg/70" : "text-muted/70"}`}>
                {countFor(value)}
              </span>
            </button>
          );
        })}
      </div>

      {trackNames[track].note && (
        <p className="border-b border-line bg-surface px-4 py-3 text-[13.5px] leading-6 text-muted">
          {trackNames[track].note}
        </p>
      )}

      {themes.length === 0 && (
        <p className="py-10 text-center text-[15px] text-muted">لا توجد تخصصات منشورة في هذا المسار.</p>
      )}

      <div className="divide-y divide-line">
        {themes.map(({ theme, programs }) => {
          const expanded = open.has(`${track}|${theme}`);
          const visible = expanded ? programs : programs.slice(0, initialPerTheme);
          return (
            <section key={theme} className="py-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-[20.5px] font-bold text-ink">{theme}</h2>
                <span className="num text-[13px] text-muted">{programs.length} تخصصًا</span>
              </div>

              <ul className="mt-2">
                {visible.map((program) => (
                  <li key={program.slug} className="border-b border-line/70 last:border-0">
                    <Link href={`/takhasus/${program.slug}`} className="group flex items-baseline justify-between gap-4 py-2.5">
                      <span className="min-w-0">
                        <span className="block truncate text-[16px] font-semibold text-ink group-hover:text-brand">
                          {program.ar}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] uppercase tracking-wide text-muted/80">
                          {program.fr}
                        </span>
                      </span>
                      <span className="num shrink-0 text-[15px] text-muted">{program.institutions} مؤسسة</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {programs.length > initialPerTheme && (
                <button
                  type="button"
                  onClick={() =>
                    setOpen((current) => {
                      const next = new Set(current);
                      const key = `${track}|${theme}`;
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    })
                  }
                  className="mt-2 text-[14px] font-medium text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
                >
                  {expanded ? "أقل" : `عرض الباقي (${programs.length - initialPerTheme})`}
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
