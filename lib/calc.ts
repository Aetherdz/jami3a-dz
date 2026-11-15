/**
 * Weighted-average arithmetic, kept pure so it can be reasoned about and
 * tested without React.
 *
 * Every published formula is the same skeleton — the bac average twice, plus
 * the field's essential subject(s), divided by three — and falls back to the
 * general average only where the circular says so (the technical stream in
 * SNV/earth/health, Arabic, humanities, law, economics, arts, sport…).
 */
import type { FormulaId, StreamId } from "./fields";
import { streamById } from "./fields";
import type { LangId } from "./rule";

export type Grades = {
  bac: number | null;
  svt?: number | null;
  math?: number | null;
  phys?: number | null;
  tech?: number | null;
  langs?: Partial<Record<LangId, number | null>>;
};

export type Formula = {
  formula: FormulaId;
  technicalFormula: FormulaId;
  essential:
    | { kind: "none" }
    | { kind: "svt" }
    | { kind: "math" }
    | { kind: "math_phys" }
    | { kind: "math_tech" }
    | { kind: "lang"; lang: LangId }
    | { kind: "translation"; langs: LangId[] };
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export function validGrade(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 20;
}

/** Parses one published column: a number, or null for "NC" / "--" / empty. */
export function numeric(value: string | undefined): number | null {
  if (!value || value === "NC" || value === "--") return null;
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export type Score = {
  value: number | null;
  formula: FormulaId;
  /** Missing inputs, in Arabic. Empty when the score is complete. */
  missing: string[];
  general: boolean;
};

/** The formula an actual candidate is ranked on, technical exception included. */
export function effectiveFormula(rule: Formula, stream: StreamId): FormulaId {
  return streamById[stream].technical ? rule.technicalFormula : rule.formula;
}

/**
 * Applies a rule. `null` means "we cannot compute this honestly", never
 * "zero": the UI names the missing grades instead of inventing a number.
 */
export function scoreFor(rule: Formula, stream: StreamId, grades: Grades): Score {
  const formula = effectiveFormula(rule, stream);
  const general = formula === "general";
  const bac = grades.bac;

  if (!validGrade(bac)) return { value: null, formula, missing: ["معدل البكالوريا"], general };

  if (general) return { value: round2(bac), formula, missing: [], general };

  const lang = (id: LangId) => grades.langs?.[id];

  if (formula === "snv") {
    if (!validGrade(grades.svt)) {
      return { value: null, formula, missing: ["علامة علوم الطبيعة والحياة"], general };
    }
    return { value: round2((bac * 2 + grades.svt) / 3), formula, missing: [], general };
  }

  if (formula === "math") {
    if (!validGrade(grades.math)) return { value: null, formula, missing: ["علامة الرياضيات"], general };
    return { value: round2((bac * 2 + grades.math) / 3), formula, missing: [], general };
  }

  if (formula === "math_phys") {
    const missing: string[] = [];
    if (!validGrade(grades.math)) missing.push("علامة الرياضيات");
    if (!validGrade(grades.phys)) missing.push("علامة الفيزياء");
    if (missing.length) return { value: null, formula, missing, general };
    return { value: round2((bac * 2 + (grades.math! + grades.phys!) / 2) / 3), formula, missing: [], general };
  }

  if (formula === "math_tech") {
    const missing: string[] = [];
    if (!validGrade(grades.math)) missing.push("علامة الرياضيات");
    if (!validGrade(grades.tech)) missing.push("علامة مادة التخصص");
    if (missing.length) return { value: null, formula, missing, general };
    return { value: round2((bac * 2 + (grades.math! + grades.tech!) / 2) / 3), formula, missing: [], general };
  }

  if (formula === "lang") {
    const id = rule.essential.kind === "lang" ? rule.essential.lang : "en";
    const value = lang(id);
    if (!validGrade(value)) return { value: null, formula, missing: [`علامة ${langName(id)}`], general };
    return { value: round2((bac * 2 + value) / 3), formula, missing: [], general };
  }

  if (formula === "translation") {
    const ids = rule.essential.kind === "translation" ? rule.essential.langs : (["ar", "fr", "en"] as LangId[]);
    const missing = ids.filter((id) => !validGrade(lang(id))).map((id) => `علامة ${langName(id)}`);
    if (missing.length) return { value: null, formula, missing, general };
    const average = ids.reduce((sum, id) => sum + (lang(id) as number), 0) / ids.length;
    return { value: round2((bac * 2 + average) / 3), formula, missing: [], general };
  }

  return { value: round2(bac), formula: "general", missing: [], general: true };
}

const langNames: Record<LangId, string> = {
  ar: "اللغة العربية",
  am: "اللغة الأمازيغية",
  fr: "اللغة الفرنسية",
  en: "اللغة الإنجليزية",
  de: "اللغة الألمانية",
  es: "اللغة الإسبانية",
  it: "اللغة الإيطالية",
};

function langName(id: LangId): string {
  return langNames[id];
}

export type Bucket = "within" | "edge" | "out" | "unknown";

/**
 * Where a score sits against one published minimum.
 * - within: at or above the lowest number printed for that program somewhere.
 * - edge: less than one point below that number.
 * - out: further below.
 * The published columns are priority-specific, so this is a reading aid, not a
 * prediction: the orientation platform ranks by priority and capacity.
 */
export function bucketFor(score: number | null, minimum: number | null): Bucket {
  if (score === null || minimum === null) return "unknown";
  if (score >= minimum) return "within";
  if (minimum - score <= 1) return "edge";
  return "out";
}

export function margin(score: number | null, minimum: number | null): number | null {
  if (score === null || minimum === null) return null;
  return round2(score - minimum);
}
