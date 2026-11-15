"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { scoreFor, type Grades } from "@/lib/calc";
import { fields, isEligible, streams, streamById, type StreamId } from "@/lib/fields";
import { langLabel, ruleFor, type LangId } from "@/lib/rule";
import type { CalcEntry } from "@/lib/majors";

type FieldScore = {
  id: string;
  ar: string;
  formula: string;
  value: number | null;
  missing: string[];
  general: boolean;
  langBreakdown?: { label: string; value: number | null }[];
};

type Match = {
  entry: CalcEntry;
  score: number;
  delta: number;
  bucket: "within" | "edge";
  track: string;
};

const emptyGrades = {
  bac: "",
  svt: "",
  math: "",
  phys: "",
  tech: "",
};

const langIds: LangId[] = ["ar", "fr", "en", "de", "es", "it", "am"];

function toNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number.parseFloat(value.replace(",", "."));
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 20) return null;
  return parsed;
}

export function Calculator({ entries }: { entries: CalcEntry[] }) {
  const [stream, setStream] = useState<StreamId>("sciences");
  const [raw, setRaw] = useState(emptyGrades);
  const [langs, setLangs] = useState<Record<string, string>>({});
  const [showAllMatches, setShowAllMatches] = useState(false);

  const info = streamById[stream];
  const technical = info.technical;

  const grades: Grades = useMemo(
    () => ({
      bac: toNumber(raw.bac),
      svt: toNumber(raw.svt),
      math: toNumber(raw.math),
      phys: toNumber(raw.phys),
      tech: toNumber(raw.tech),
      langs: Object.fromEntries(langIds.map((id) => [id, toNumber(langs[id] ?? "")])) as Grades["langs"],
    }),
    [langs, raw],
  );

  const fieldScores: FieldScore[] = useMemo(() => {
    return fields
      .filter((field) => isEligible(field, stream))
      .map((field) => {
        if (field.id === "lang") {
          const breakdown = (["fr", "en", "de", "es"] as LangId[]).map((lang) => ({
            label: langLabel[lang],
            value: scoreFor(ruleFor("lang", lang === "fr" ? "FRANCAIS" : lang === "en" ? "ANGLAIS" : lang === "de" ? "ALLEMANDE" : "ESPAGNOLE"), stream, grades).value,
          }));
          const best = breakdown.filter((item) => item.value !== null).sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0];
          return {
            id: field.id,
            ar: field.ar,
            formula: "(المعدل × 2 + علامة اللغة) ÷ 3",
            value: best?.value ?? null,
            missing: best ? [] : ["علامة لغة"],
            general: false,
            langBreakdown: breakdown,
          };
        }
        const rule = ruleFor(field.id, "");
        const score = scoreFor(rule, stream, grades);
        return {
          id: field.id,
          ar: field.ar,
          formula: rule.text,
          value: score.value,
          missing: score.missing,
          general: score.general,
        };
      });
  }, [grades, stream]);

  const completed = fieldScores.filter((item) => item.value !== null).length;
  const bestScore = fieldScores.reduce((best, item) => (item.value !== null && item.value > best ? item.value : best), 0);

  const matches: Match[] = useMemo(() => {
    if (!bestScore) return [];
    const results: Match[] = [];
    for (const entry of entries) {
      const field = fields.find((item) => item.id === entry.fieldId);
      if (!field || !isEligible(field, stream)) continue;
      const rule = ruleFor(entry.fieldId, entry.fr);
      if (rule.essential.kind === "translation" && !["langues", "lettres"].includes(stream)) continue;
      const score = scoreFor(rule, stream, grades);
      if (score.value === null || entry.low === null) continue;
      const delta = Math.round((score.value - entry.low) * 100) / 100;
      if (delta < -1) continue;
      results.push({
        entry,
        score: score.value,
        delta,
        bucket: delta >= 0 ? "within" : "edge",
        track: entry.track,
      });
    }
    return results.sort((a, b) => {
      const order = (item: Match) => (item.bucket === "within" ? 0 : 1);
      return order(a) - order(b) || Math.abs(a.delta) - Math.abs(b.delta);
    });
  }, [bestScore, entries, grades, stream]);

  const within = matches.filter((item) => item.bucket === "within");
  const edge = matches.filter((item) => item.bucket === "edge");

  /** At most two entries per theme keep the list readable. */
  function capPerTheme(list: Match[], limit: number): Match[] {
    const seen = new Map<string, number>();
    const output: Match[] = [];
    for (const item of list) {
      const key = `${item.entry.fieldId}|${item.entry.theme}`;
      const count = seen.get(key) ?? 0;
      if (count >= 2) continue;
      seen.set(key, count + 1);
      output.push(item);
      if (output.length >= limit) break;
    }
    return output;
  }

  const visibleWithin = capPerTheme(within, showAllMatches ? 40 : 10);
  const visibleEdge = capPerTheme(edge, 6);

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:gap-10">
      {/* ---------------------------- inputs ---------------------------- */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="border border-line-strong bg-surface p-5">
          <label htmlFor="stream" className="eyebrow">
            شعبتك في البكالوريا
          </label>
          <select
            id="stream"
            value={stream}
            onChange={(event) => setStream(event.target.value as StreamId)}
            className="mt-2 h-11 w-full rounded-card border border-line-strong bg-bg px-3 text-[13.5px] font-medium text-ink outline-none focus:border-brand"
          >
            <optgroup label="الشعب العلمية">
              {streams.filter((item) => item.scientific).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ar}
                </option>
              ))}
            </optgroup>
            <optgroup label="الشعب الأدبية والاقتصادية">
              {streams.filter((item) => !item.scientific).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.ar}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="mt-4">
            <label htmlFor="bac" className="eyebrow">
              معدل البكالوريا
            </label>
            <input
              id="bac"
              inputMode="decimal"
              type="number"
              min={0}
              max={20}
              step={0.01}
              value={raw.bac}
              onChange={(event) => setRaw({ ...raw, bac: event.target.value })}
              placeholder="14.20"
              className="num mt-2 h-12 w-full rounded-card border border-line-strong bg-bg px-3 text-[19px] font-semibold text-ink outline-none focus:border-brand"
            />
          </div>

          <div className="mt-4 space-y-3">
            {info.scientific && !technical && (
              <>
                <GradeInput id="math" label="الرياضيات" value={raw.math} onChange={(value) => setRaw({ ...raw, math: value })} />
                <GradeInput id="phys" label="الفيزياء" value={raw.phys} onChange={(value) => setRaw({ ...raw, phys: value })} />
                <GradeInput id="svt" label="علوم الطبيعة والحياة" value={raw.svt} onChange={(value) => setRaw({ ...raw, svt: value })} />
              </>
            )}
            {technical && (
              <>
                <GradeInput id="math" label="الرياضيات" value={raw.math} onChange={(value) => setRaw({ ...raw, math: value })} />
                <GradeInput id="tech" label="مادة التخصص (التكنولوجيا)" value={raw.tech} onChange={(value) => setRaw({ ...raw, tech: value })} />
                <GradeInput id="phys" label="الفيزياء" value={raw.phys} onChange={(value) => setRaw({ ...raw, phys: value })} />
              </>
            )}
            {!info.scientific && (
              <>
                {(["fr", "en", "de", "es", "it"] as LangId[]).map((lang) => (
                  <GradeInput
                    key={lang}
                    id={`lang-${lang}`}
                    label={`علامة ${langLabel[lang]}`}
                    value={langs[lang] ?? ""}
                    onChange={(value) => setLangs({ ...langs, [lang]: value })}
                  />
                ))}
                {stream === "lettres" && (
                  <GradeInput
                    id="lang-ar"
                    label="علامة اللغة العربية"
                    value={langs.ar ?? ""}
                    onChange={(value) => setLangs({ ...langs, ar: value })}
                  />
                )}
              </>
            )}
          </div>

          <p className="mt-4 border-t border-line pt-3 text-[11px] leading-5 text-muted">
            العلامات اختيارية حسب الميدان: كلما أكملت مادة، حسبنا بها. الحقول الناقصة تظهر باسمها ولا تُقدَّر.
          </p>
        </div>
      </div>

      {/* ---------------------------- results ---------------------------- */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-strong pb-3">
          <h2 className="font-display text-[21px] font-bold text-ink">معدلاتك الموزونة</h2>
          <span className="num text-[11px] text-muted">
            {completed} من {fieldScores.length} ميدانًا محسوبًا
          </span>
        </div>

        <ul className="mt-1 grid gap-px bg-line sm:grid-cols-2">
          {fieldScores.map((item) => (
            <li key={item.id} className="bg-bg p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-[12.5px] font-semibold text-ink">{item.ar}</span>
                <span className={`num shrink-0 font-display text-[20px] font-bold ${item.value !== null ? "text-brand" : "text-muted/40"}`}>
                  {item.value !== null ? item.value.toFixed(2) : "—"}
                </span>
              </div>
              <p className="mt-1 text-[10.5px] leading-5 text-muted" dir="auto">
                {item.formula}
              </p>
              {item.value === null && item.missing.length > 0 && (
                <p className="mt-1 text-[10.5px] text-muted/80">ينقص: {item.missing.join("، ")}</p>
              )}
              {item.langBreakdown && (
                <p className="num mt-1 text-[10.5px] text-muted">
                  {item.langBreakdown
                    .filter((line) => line.value !== null)
                    .map((line) => `${line.label} ${line.value!.toFixed(2)}`)
                    .join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[11px] leading-5 text-muted">
          الصيغ مأخوذة من جدول المنشور الوزاري. الشعبة التقنية تُرتَّب على المعدل العام في ميادين علوم الطبيعة والحياة وعلوم الأرض والصحة.
        </p>

        {/* ---------------------------- matches ---------------------------- */}
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-strong pb-3">
            <h2 className="font-display text-[21px] font-bold text-ink">تخصصات قريبة من معدلك</h2>
            <span className="num text-[11px] text-muted">
              {within.length} داخل المدى · {edge.length} على الحد
            </span>
          </div>

          {!bestScore ? (
            <p className="py-8 text-[13px] text-muted">أدخل معدل البكالوريا أولًا.</p>
          ) : matches.length === 0 ? (
            <p className="py-8 text-[13px] text-muted">
              لا يوجد تخصص منشور يقع في مدى معدلك بهذه الشعبة. جرّب مراجعة العلامات أو الشعبة.
            </p>
          ) : (
            <>
              {[
                { title: "داخل المدى المنشور", items: visibleWithin, note: "معدلك الموزون ≥ أدنى رقم منشور للتخصص في مؤسسة واحدة على الأقل." },
                { title: "على الحد (أقل من نقطة)", items: visibleEdge, note: "بينك وبين أدنى رقم منشور أقل من نقطة واحدة." },
              ].map((group) =>
                group.items.length ? (
                  <div key={group.title} className="mt-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[12px] font-semibold text-ink">{group.title}</h3>
                      <span className="num text-[10.5px] text-muted">{group.items.length} في العرض</span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-5 text-muted">{group.note}</p>
                    <ul className="mt-2 divide-y divide-line">
                      {group.items.map((item) => (
                        <li key={`${item.entry.slug}-${item.bucket}`}>
                          <Link
                            href={`/takhasus/${item.entry.slug}`}
                            className="group flex items-baseline justify-between gap-3 py-2.5"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold text-ink group-hover:text-brand">
                                {item.entry.ar}
                              </span>
                              <span className="mt-0.5 block truncate text-[10.5px] text-muted">
                                {item.entry.fieldAr} · {item.entry.theme}
                                {item.track !== "licence" && " · مسار خاص"}
                              </span>
                            </span>
                            <span className="shrink-0 text-left">
                              <span className={`num block text-[12px] font-semibold ${item.delta >= 0 ? "text-brand" : "text-ink"}`}>
                                {item.delta >= 0 ? "+" : ""}
                                {item.delta.toFixed(2)}
                              </span>
                              <span className="num block text-[10px] text-muted">حد {item.entry.low!.toFixed(2)}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}

              {within.length > visibleWithin.length && (
                <button
                  type="button"
                  onClick={() => setShowAllMatches((value) => !value)}
                  className="mt-4 text-[12px] font-medium text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
                >
                  {showAllMatches ? "أقل" : `عرض المزيد (${within.length - visibleWithin.length})`}
                </button>
              )}

              <p className="mt-6 border-t border-line pt-3 text-[11px] leading-6 text-muted">
                الفارق محسوب بين معدلك الموزون و<strong className="font-semibold text-ink">أدنى</strong> رقم منشور للتخصص.
                الملف المنشور يعرض ثلاثة أعمدة حسب الأولوية (أ1/أ2/أ3)، ولا نعرف أي عمود ينطبق على شعبتك قبل بطاقة التكوين،
                لذلك هذه المقارنة استرشادية وليست ضمانًا. الترتيب النهائي على أرضية الوزارة.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function GradeInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const parsed = toNumber(value);
  const invalid = value.trim() !== "" && parsed === null;
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[11px] text-muted">
        <span>{label}</span>
        {invalid && <span className="text-[10px] text-ink">بين 0 و20</span>}
      </label>
      <input
        id={id}
        inputMode="decimal"
        type="number"
        min={0}
        max={20}
        step={0.01}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`num mt-1 h-10 w-full rounded-card border bg-bg px-3 text-[14px] text-ink outline-none focus:border-brand ${
          invalid ? "border-ink" : "border-line-strong"
        }`}
      />
    </div>
  );
}
