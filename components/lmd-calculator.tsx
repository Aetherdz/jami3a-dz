"use client";

import { useMemo, useState } from "react";
import { curricula, curriculumById, curriculumGroups } from "@/lib/curricula";

type Unit = {
  id: number;
  name: string;
  credits: string;
  coef: string;
  mark: string;
};

type Semester = "s1" | "s2";

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
 * carries the whole semester.
 *
 * The preset lists in lib/curricula.ts are the usual first-year layout of the
 * national programme; they fill the rows so nobody has to type six module
 * names from memory, and every field stays editable for the differences the
 * student's own « بطاقة التكوين » carries.
 */
export function LmdCalculator() {
  const [units, setUnits] = useState<Unit[]>([blank(1), blank(2), blank(3)]);
  const [selected, setSelected] = useState<string | null>(null);
  const [semester, setSemester] = useState<Semester>("s1");
  const [pickerOpen, setPickerOpen] = useState(true);
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

  const apply = (id: string, term: Semester = semester) => {
    const preset = curriculumById[id];
    if (!preset) return;
    setSelected(id);
    setSemester(term);
    setPickerOpen(false);
    setUnits(
      preset[term].map((item, index) => ({
        id: index + 1,
        name: item.name,
        credits: String(item.credits),
        coef: String(item.coef),
        mark: "",
      })),
    );
  };

  const clear = () => {
    setSelected(null);
    setSemester("s1");
    setPickerOpen(true);
    setUnits([blank(1), blank(2), blank(3)]);
  };

  const active = selected ? curriculumById[selected] : null;
  const totalPresetCredits = units.reduce((sum, unit) => sum + (toNumber(unit.credits) ?? 0), 0);

  const field =
    "h-11 w-full rounded-card border border-line-strong bg-surface px-3 text-[17px] text-ink outline-none focus:border-brand";

  return (
    <div>
      <section className="mb-8 border border-line-strong bg-surface">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="eyebrow">البداية</p>
            <h2 className="mt-1 font-display text-[22px] font-bold text-ink">
              {active && !pickerOpen ? active.name : "اختر تخصصك"}
            </h2>
            <p className="mt-1 max-w-prose text-[15.5px] leading-7 text-muted">
              {active && !pickerOpen
                ? `${curricula.length} تخصصًا في القائمة؛ غيّر تخصصك أو بدّل السداسي، ثم أدخل علاماتك.`
                : `${curricula.length} تخصصًا، كل واحد بوحدات سنته الأولى كما تُدرَّس عادة في البرنامج الوطني. تختار، فتظهر الوحدات بأرصدتها ومعاملاتها، ثم تدخل علاماتك فقط.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen((open) => !open)}
            aria-expanded={pickerOpen}
            className="h-11 shrink-0 rounded-card border border-line-strong bg-bg px-4 text-[14px] text-ink hover:border-ink sm:h-9"
          >
            {pickerOpen ? "إخفاء القائمة" : "تغيير التخصص"}
          </button>
        </div>

        {pickerOpen && (
        <div className="space-y-3 px-4 py-4 sm:px-5">
          {curriculumGroups.map((group) => (
            <div key={group.field} className="flex flex-wrap items-center gap-2">
              <p className="w-full text-[13.5px] font-semibold text-muted sm:w-44">{group.field}</p>
              {group.items.map((item) => {
                const isActive = item.id === selected;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => apply(item.id)}
                    aria-pressed={isActive}
                    className={`flex min-h-11 items-center rounded-card border px-3.5 py-2 text-start text-[13.5px] leading-5 transition-colors sm:min-h-9 ${
                      isActive
                        ? "border-ink bg-ink font-semibold text-bg"
                        : "border-line-strong bg-bg text-ink hover:border-ink"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] text-muted">السداسي</span>
            {(["s1", "s2"] as const).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => (active ? apply(active.id, term) : setSemester(term))}
                aria-pressed={semester === term}
                className={`h-11 rounded-card border px-4 text-[14px] transition-colors sm:h-9 ${
                  semester === term
                    ? "border-ink bg-ink font-semibold text-bg"
                    : "border-line-strong bg-bg text-ink hover:border-ink"
                }`}
              >
                {term === "s1" ? "الأول" : "الثاني"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={clear}
            className="h-11 rounded-card border border-line-strong bg-bg px-4 text-[14px] text-ink hover:border-ink sm:h-9"
          >
            ابدأ فارغًا
          </button>
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-strong pb-2">
            <h2 className="font-display text-[24px] font-bold text-ink">
              وحدات السداسي
              {active && (
                <span className="ms-2 text-[17px] font-semibold text-muted">
                  {active.name} · {semester === "s1" ? "الأول" : "الثاني"}
                </span>
              )}
            </h2>
            <span className="num text-[15px] text-muted">
              {filled.length} بعلامة · {totalPresetCredits} رصيدًا
            </span>
          </div>

          <ul className="divide-y divide-line">
            {units.map((unit, index) => (
              <li
                key={unit.id}
                className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-[1fr_5rem_5rem_5rem_2.5rem] sm:items-end"
              >
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
                  onClick={() =>
                    setUnits((current) => (current.length > 1 ? current.filter((item) => item.id !== unit.id) : current))
                  }
                  className="col-span-2 h-11 rounded-card border border-line-strong bg-surface text-[15px] text-ink hover:border-ink sm:col-span-1 sm:border-0 sm:bg-transparent"
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
              {active
                ? "هذه وحدات نموذجية: صحّح الاسم أو الرصيد أو المعامل إن اختلف عن بطاقة تكوين مؤسستك."
                : "اختر تخصصك أعلاه، أو أدخل وحداتك كما هي في بطاقة التكوين."}
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
                <input
                  id="s1"
                  value={s1}
                  onChange={(event) => setS1(event.target.value)}
                  inputMode="decimal"
                  placeholder="—"
                  className={`${field} num text-center placeholder:text-muted/60`}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="s2" className="mb-1 block text-[14px] font-medium text-muted">
                  السداسي 2
                </label>
                <input
                  id="s2"
                  value={s2}
                  onChange={(event) => setS2(event.target.value)}
                  inputMode="decimal"
                  placeholder="—"
                  className={`${field} num text-center placeholder:text-muted/60`}
                />
              </div>
            </div>
            <p className="num mt-3 text-[17px] text-ink">{annual !== null ? `${annual.toFixed(2)} / 20` : "—"}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
