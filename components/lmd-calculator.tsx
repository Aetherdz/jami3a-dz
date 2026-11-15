"use client";

import { useMemo, useState } from "react";

type Unit = {
  id: number;
  name: string;
  credits: string;
  coef: string;
  mark: string;
};

const blank = (id: number): Unit => ({ id, name: "", credits: "6", coef: "2", mark: "" });

function toNumber(value: string): number | null {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * LMD arithmetic only: the semester average is the coefficient-weighted mean
 * of the unit marks, and the credits are those of the units at 10 or above —
 * unless the semester average itself reaches 10, in which case compensation
 * carries the whole semester. No rule is assumed beyond that: the module
 * names, their credits and their coefficients come from the faculty's own
 * « بطاقة التكوين », which the student enters.
 */
export function LmdCalculator() {
  const [units, setUnits] = useState<Unit[]>([blank(1), blank(2), blank(3)]);
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const nextId = useMemo(() => Math.max(...units.map((unit) => unit.id), 0) + 1, [units]);

  const filled = units.filter((unit) => unit.mark.trim() !== "");
  const totalCoef = filled.reduce((sum, unit) => sum + (toNumber(unit.coef) ?? 0), 0);
  const totalCredits = filled.reduce((sum, unit) => sum + (toNumber(unit.credits) ?? 0), 0);
  const weighted = filled.reduce((sum, unit) => sum + (toNumber(unit.mark) ?? 0) * (toNumber(unit.coef) ?? 0), 0);
  const creditWeighted = filled.reduce((sum, unit) => sum + (toNumber(unit.mark) ?? 0) * (toNumber(unit.credits) ?? 0), 0);

  const average = totalCoef > 0 ? round(weighted / totalCoef) : null;
  const creditAverage = totalCredits > 0 ? round(creditWeighted / totalCredits) : null;
  const compensated = average !== null && average >= 10;
  const acquired = compensated
    ? totalCredits
    : filled
        .filter((unit) => (toNumber(unit.mark) ?? 0) >= 10)
        .reduce((sum, unit) => sum + (toNumber(unit.credits) ?? 0), 0);

  const first = toNumber(s1);
  const second = toNumber(s2);
  const annual = first !== null && second !== null ? round((first + second) / 2) : null;

  const update = (id: number, patch: Partial<Unit>) =>
    setUnits((current) => current.map((unit) => (unit.id === id ? { ...unit, ...patch } : unit)));

  const field =
    "h-11 w-full rounded-card border border-line-strong bg-surface px-3 text-[17px] text-ink outline-none focus:border-brand";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-strong pb-2">
          <h2 className="font-display text-[24px] font-bold text-ink">وحدات السداسي</h2>
          <span className="num text-[15px] text-muted">{filled.length} وحدة بعلامة</span>
        </div>

        <ul className="divide-y divide-line">
          {units.map((unit, index) => (
            <li key={unit.id} className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-[1fr_5rem_5rem_5rem_2.5rem] sm:items-end">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor={`unit-${unit.id}`} className="mb-1 block text-[14px] font-medium text-muted">
                  الوحدة {index + 1}
                </label>
                <input
                  id={`unit-${unit.id}`}
                  value={unit.name}
                  onChange={(event) => update(unit.id, { name: event.target.value })}
                  placeholder="الرياضيات، مدخل إلى القانون…"
                  className={`${field} placeholder:text-muted/60`}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor={`credits-${unit.id}`} className="mb-1 block text-[14px] font-medium text-muted">
                  الأرصدة
                </label>
                <input
                  id={`credits-${unit.id}`}
                  value={unit.credits}
                  onChange={(event) => update(unit.id, { credits: event.target.value })}
                  inputMode="numeric"
                  className={`${field} num text-center`}
                />
              </div>
              <div>
                <label htmlFor={`coef-${unit.id}`} className="mb-1 block text-[14px] font-medium text-muted">
                  المعامل
                </label>
                <input
                  id={`coef-${unit.id}`}
                  value={unit.coef}
                  onChange={(event) => update(unit.id, { coef: event.target.value })}
                  inputMode="numeric"
                  className={`${field} num text-center`}
                />
              </div>
              <div>
                <label htmlFor={`mark-${unit.id}`} className="mb-1 block text-[14px] font-medium text-muted">
                  العلامة /20
                </label>
                <input
                  id={`mark-${unit.id}`}
                  value={unit.mark}
                  onChange={(event) => update(unit.id, { mark: event.target.value })}
                  inputMode="decimal"
                  placeholder="—"
                  className={`${field} num text-center placeholder:text-muted/60`}
                />
              </div>
              <button
                type="button"
                onClick={() => setUnits((current) => (current.length > 1 ? current.filter((item) => item.id !== unit.id) : current))}
                className="col-span-2 h-11 rounded-card border border-line text-[15px] text-muted hover:border-ink hover:text-ink sm:col-span-1 sm:border-0"
                aria-label={`حذف الوحدة ${index + 1}`}
              >
                حذف
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 border-t border-line-strong pt-4">
          <button
            type="button"
            onClick={() => setUnits((current) => [...current, blank(nextId)])}
            className="h-11 rounded-card border border-ink bg-ink px-5 text-[16px] font-semibold text-bg hover:border-brand hover:bg-brand"
          >
            إضافة وحدة
          </button>
          <p className="self-center text-[14.5px] leading-6 text-muted">
            المعامل والرصيد مكتوبان في بطاقة التكوين؛ العلامة هي معدل الوحدة كما ظهر لك.
          </p>
        </div>
      </div>

      <aside className="border border-line-strong bg-surface p-5 lg:sticky lg:top-24">
        <p className="eyebrow">النتيجة</p>
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-[14.5px] text-muted">المعدل الفصلي حسب المعاملات</p>
            <p className="num mt-1 font-display text-[42px] font-bold leading-none text-ink">
              {average !== null ? average.toFixed(2) : "—"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <p className="text-[14.5px] text-muted">بالأرصدة</p>
              <p className="num mt-1 text-[22px] font-semibold text-ink">
                {creditAverage !== null ? creditAverage.toFixed(2) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[14.5px] text-muted">الأرصدة المحصّلة</p>
              <p className="num mt-1 text-[22px] font-semibold text-ink">
                {filled.length ? `${acquired} / ${totalCredits}` : "—"}
              </p>
            </div>
          </div>
          <p className="border-t border-line pt-3 text-[15px] leading-7 text-muted">
            {average === null
              ? "أدخل علامة وحدة واحدة على الأقل."
              : compensated
                ? "المعدل ≥ 10.00: السداسي مكتسب بالأرصدة كلها (تعويض بين الوحدات)."
                : "المعدل < 10.00: تُحتسب أرصدة الوحدات التي بلغت 10.00 فقط."}
          </p>
        </div>

        <div className="mt-6 border-t border-line pt-4">
          <p className="eyebrow">المعدل السنوي</p>
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label htmlFor="s1" className="mb-1 block text-[14px] font-medium text-muted">
                السداسي 1
              </label>
              <input id="s1" value={s1} onChange={(event) => setS1(event.target.value)} inputMode="decimal" placeholder="—" className={`${field} num text-center placeholder:text-muted/60`} />
            </div>
            <div className="flex-1">
              <label htmlFor="s2" className="mb-1 block text-[14px] font-medium text-muted">
                السداسي 2
              </label>
              <input id="s2" value={s2} onChange={(event) => setS2(event.target.value)} inputMode="decimal" placeholder="—" className={`${field} num text-center placeholder:text-muted/60`} />
            </div>
          </div>
          <p className="num mt-3 text-[17px] text-ink">
            {annual !== null ? `${annual.toFixed(2)} / 20` : "—"}
          </p>
        </div>
      </aside>
    </div>
  );
}
