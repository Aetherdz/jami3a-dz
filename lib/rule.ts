/**
 * One rule per program: which formula ranks it, and which subject(s) it needs.
 *
 * The circular fixes the weighting per field, with a handful of exceptions that
 * are decided by the program itself (the language of a language degree, the
 * three languages of a translation degree, the non-weighted languages such as
 * Turkish or Russian). Resolving the rule here keeps the calculator honest:
 * every number it prints can name the exact formula behind it.
 */
import { fieldById, formulaText, type FieldId, type FormulaId } from "./fields";

export type LangId = "ar" | "am" | "fr" | "en" | "de" | "es" | "it";

export const langLabel: Record<LangId, string> = {
  ar: "العربية",
  am: "الأمازيغية",
  fr: "الفرنسية",
  en: "الإنجليزية",
  de: "الألمانية",
  es: "الإسبانية",
  it: "الإيطالية",
};

export type Essential =
  | { kind: "none" }
  | { kind: "svt" }
  | { kind: "math" }
  | { kind: "math_phys" }
  | { kind: "math_tech" }
  | { kind: "lang"; lang: LangId }
  | { kind: "translation"; langs: LangId[] };

export type Rule = {
  fieldId: FieldId;
  /** Formula for the streams that are ranked on a weighting. */
  formula: FormulaId;
  /** Formula for the technical stream when the circular gives it another one. */
  technicalFormula: FormulaId;
  /** What the candidate must type in, if anything. */
  essential: Essential;
  /** Arabic rendering of the formula actually applied. */
  text: string;
  general: boolean;
};

function translationLangs(name: string): LangId[] {
  const upper = name.toUpperCase();
  const langs: LangId[] = [];
  if (upper.includes("ARABE")) langs.push("ar");
  if (upper.includes("FRANCAIS")) langs.push("fr");
  if (upper.includes("ANGLAIS")) langs.push("en");
  if (upper.includes("AMAZIGH")) langs.push("am");
  if (upper.includes("ESPAGNOLE")) langs.push("es");
  if (upper.includes("ALLEMANDE")) langs.push("de");
  if (upper.includes("ITALIEN")) langs.push("it");
  return langs.length ? langs : ["ar", "fr", "en"];
}

function formulaSentence(formula: FormulaId, essential: Essential): string {
  if (formula === "lang" && essential.kind === "lang") {
    return `(المعدل × 2 + ${langLabel[essential.lang]}) ÷ 3`;
  }
  if (formula === "translation" && essential.kind === "translation") {
    const names = essential.langs.map((lang) => langLabel[lang]).join(" + ");
    return `(المعدل × 2 + (${names}) ÷ 3) ÷ 3`;
  }
  return formulaText[formula].ar;
}

/**
 * Rules the circular states explicitly, by field letter and, inside the
 * language field, by the language named in the program.
 */
export function ruleFor(fieldId: FieldId, name: string): Rule {
  const field = fieldById[fieldId];
  const upper = name.toUpperCase();

  const make = (
    formula: FormulaId,
    essential: Essential,
    technicalFormula: FormulaId = formula,
  ): Rule => ({
    fieldId,
    formula,
    technicalFormula,
    essential,
    text: formulaSentence(formula, essential),
    general: formula === "general",
  });

  switch (fieldId) {
    case "sante":
    case "snv":
    case "stu":
      // Scientific and mathematical streams only; the technical stream is
      // ranked on the general average (priority a2 in the 2026 circular).
      return make("snv", { kind: "svt" }, "general");

    case "st":
      // Common core and engineering programmes: maths and physics; a technical
      // candidate is weighed with the specialty subject instead of physics.
      return make("math_phys", { kind: "math_phys" }, "math_tech");

    case "sm":
    case "arch":
      // Matter sciences and architecture keep maths + physics for everyone,
      // technical stream included.
      return make("math_phys", { kind: "math_phys" });

    case "mi":
      return make("math", { kind: "math" });

    case "lang":
      if (upper.includes("TRADUCTION")) {
        return make("translation", { kind: "translation", langs: translationLangs(name) });
      }
      if (upper.includes("FRANCAIS")) {
        return make("lang", { kind: "lang", lang: "fr" });
      }
      if (upper.includes("ANGLAIS")) {
        return make("lang", { kind: "lang", lang: "en" });
      }
      if (upper.includes("ALLEMANDE")) {
        return make("lang", { kind: "lang", lang: "de" });
      }
      if (upper.includes("ESPAGNOLE")) {
        return make("lang", { kind: "lang", lang: "es" });
      }
      // Italian, Russian, Chinese, Turkish: general average.
      return make("general", { kind: "none" });

    default:
      // Arabic, Amazigh, humanities, law, economics, arts, sport.
      return make("general", { kind: "none" });
  }
}

/** Short subject line shown under a program name. */
export function essentialLabels(essential: Essential): string[] {
  switch (essential.kind) {
    case "none":
      return ["المعدل العام"];
    case "svt":
      return ["علوم الطبيعة والحياة"];
    case "math":
      return ["الرياضيات"];
    case "math_phys":
      return ["الرياضيات", "الفيزياء"];
    case "math_tech":
      return ["الرياضيات", "مادة التخصص"];
    case "lang":
      return [langLabel[essential.lang]];
    case "translation":
      return essential.langs.map((lang) => langLabel[lang]);
  }
}

export function isTranslation(rule: Rule): boolean {
  return rule.essential.kind === "translation";
}

export { fieldById };
