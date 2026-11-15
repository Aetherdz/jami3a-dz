/**
 * The published minimums, organised the way a candidate actually reads them.
 *
 * `data/minimums.json` is the ministry's 2026 table, row by row, exactly as
 * printed: institution code, institution name, filière code, filière name and
 * the three published priority columns. Nothing is normalised away — "NC"
 * (filière not saturated) and "--" (nobody was oriented in that priority) stay
 * visible, because hiding them would turn "no data" into a fake number.
 *
 * On top of the raw rows we build three layers that keep the list readable:
 *   1. a canonical program name (the local "pour bacheliers X" suffix is a
 *      quota, not a different program),
 *   2. a track (academic licence, teacher-training school, grande école,
 *      continuing education, professionalising, distance),
 *   3. a theme inside the field, used to split long fields into small sections.
 */
import raw from "@/data/minimums.json";
import trendsRaw from "@/data/trends.json";
import institutionsRaw from "@/data/institutions.json";
import { programNamesAr } from "@/content/names";
import { fieldById, fieldByLetter, type Field, type FieldId } from "./fields";
import { ruleFor, type Rule } from "./rule";
import { numeric } from "./calc";

export { numeric };

export type Row = {
  /** Institution code (U12, C16, C99…). */
  e: string;
  en: string;
  /** Filière code; its first letter identifies the field. */
  f: string;
  /** Filière name exactly as published. */
  n: string;
  /** Up to three published columns: a1, a2, a3 — numbers, "NC" or "--". */
  v: string[];
};

export type Source = {
  title: string;
  url: string;
  publisher: string;
  session: string;
  readOn: string;
  rows: number;
};

export const source = raw.source as Source;
export const rows = raw.rows as Row[];

export type Track =
  | "licence"
  | "teaching"
  | "school"
  | "continuing"
  | "professional"
  | "distance";

export const trackLabel: Record<Track, string> = {
  licence: "ليسانس جامعية",
  teaching: "مدارس عليا للأساتذة",
  school: "مدرسة عليا",
  continuing: "تكوين مستمر",
  professional: "تكوين مهني",
  distance: "تكوين عن بعد",
};

/**
 * The ministry prints a local quota as a suffix: "ARABE (P.E.P) -- pour
 * bacheliers ADRAR". The suffix names a wilaya, not another program, so the
 * whole tail goes — matching only up to "bacheliers" would leave "ADRAR" behind
 * and turn one program into fifty-eight.
 */
const QUOTA = /\s*--\s*pour bacheliers\b.*$/i;

export function canonicalName(name: string): string {
  return name
    .replace(QUOTA, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function trackOf(name: string): Track {
  const upper = name.toUpperCase();
  if (/\(P\.E\.[SMP]\)/.test(upper) || upper.includes("PROFESSEUR DE L ENSEIGNEMENT")) return "teaching";
  if (upper.startsWith("FB ")) return "school";
  if (upper.includes("FORMATION CONTINUE")) return "continuing";
  if (upper.includes("FORMATIONS PROFESSIONNALISANTES")) return "professional";
  if (upper.includes("A DISTANCE")) return "distance";
  return "licence";
}

/* -------------------------------------------------------------------------- */
/* Themes                                                                      */
/* -------------------------------------------------------------------------- */

type ThemeRule = { match: RegExp; theme: string };

/**
 * Ordered keyword rules, one list per field. The first match wins; the last
 * rule of each field is the catch-all. These only cut a long field into
 * sections — they never change a published name or a number.
 */
const themes: Partial<Record<FieldId, ThemeRule[]>> = {
  st: [
    { match: /^SCIENCES ET TECHNOLOGIES$/, theme: "الجذع المشترك" },
    { match: /CIVIL|TRAVAUX PUBLICS|TRANSPORTS|CONSTRUCTION/, theme: "الهندسة المدنية والنقل" },
    { match: /ELECTRO|ELECTRONIQUE|AUTOMATIQUE|TELECOM|CIRCUIT|COMMUNICATION|GENIE ELECTRIQUE/, theme: "الكهرباء والإلكترونيك والتحكم" },
    { match: /MECANIQUE|AERONAUTIQUE|OPTIQUE|INDUSTRIEL|METALLURGIE|MARITIME/, theme: "الميكانيك والصناعة" },
    { match: /PROCEDES|ENERGIE|PETROCHIM|HYDROCARBURE|MINIER|NANOSCIENCE|HYGIENE|TECHNOLOGIES DE L INFORMATION/, theme: "الطرائق والطاقات والمناجم" },
    { match: /.*/, theme: "تكوينات أخرى" },
  ],
  sm: [
    { match: /QUANTIQUE|MOLECULE|NANOSCIENCE/, theme: "الفيزياء والكيمياء المتقدمة" },
    { match: /CHIMIE/, theme: "الكيمياء" },
    { match: /PHYSIQUE|MATIERE/, theme: "علوم المادة" },
    { match: /.*/, theme: "تكوينات أخرى" },
  ],
  mi: [
    { match: /INTELLIGENCE ARTIFICIELLE|CYBER|DONNEES|STATISTIQUE/, theme: "الذكاء الاصطناعي والمعطيات" },
    { match: /INFORMATIQUE/, theme: "الإعلام الآلي" },
    { match: /MATHEMATIQUES/, theme: "الرياضيات" },
    { match: /.*/, theme: "تكوينات أخرى" },
  ],
  snv: [
    { match: /ALIMENTAIRE/, theme: "العلوم الغذائية" },
    { match: /AGRONOMIQUE|FORET|AGRICULTURE|MER ET/, theme: "العلوم الفلاحية" },
    { match: /BIOLOG|ECOLOGIE|HYDROBIOLOGIE|BIOTECHNOLOGIE/, theme: "البيولوجيا والبيئة" },
    { match: /.*/, theme: "علوم الطبيعة والحياة" },
  ],
  stu: [
    { match: /GEOGRAPHIE/, theme: "الجغرافيا وتهيئة الإقليم" },
    { match: /GEOPHYSIQUE|VILLES/, theme: "الجيوفيزياء والمدن" },
    { match: /.*/, theme: "الجيولوجيا" },
  ],
  arch: [
    { match: /ARCHITECTURE$|ARCHITECTURE \(/, theme: "الهندسة المعمارية" },
    { match: /URBANISME|GESTION DES TECHNIQUES|VILLE/, theme: "العمران وتسيير المدن" },
    { match: /.*/, theme: "مهن المدينة والترميم" },
  ],
  sante: [
    { match: /VETERINAIRE/, theme: "العلوم البيطرية" },
    { match: /MEDECINE|PHARMACIE/, theme: "الطب والصيدلة" },
    { match: /.*/, theme: "العلوم الصحية" },
  ],
  lang: [
    { match: /TRADUCTION/, theme: "الترجمة" },
    { match: /ANGLAIS/, theme: "الإنجليزية" },
    { match: /FRANCAIS/, theme: "الفرنسية" },
    { match: /ESPAGNOLE|ALLEMANDE/, theme: "الإسبانية والألمانية" },
    { match: /.*/, theme: "لغات أخرى" },
  ],
  arabic: [{ match: /.*/, theme: "اللغة والأدب العربي" }],
  amazigh: [{ match: /.*/, theme: "اللغة والثقافة الأمازيغية" }],
  shs: [
    { match: /ISLAMIQUE/, theme: "العلوم الإسلامية" },
    { match: /INFORMATION ET COMMUNICATION|BIBLIOTHECONOMIE|COMMUNICATION/, theme: "الإعلام والاتصال" },
    { match: /HISTOIRE|GEOGRAPHIE|ARCHEOLOGIE/, theme: "التاريخ والجغرافيا" },
    { match: /PHILOSOPHIE/, theme: "الفلسفة" },
    { match: /SOCIALE|SOCIOLOGIE|LOISIR|JEUNES/, theme: "العلوم الاجتماعية" },
    { match: /.*/, theme: "العلوم الإنسانية" },
  ],
  dsp: [
    { match: /POLITIQUE/, theme: "العلوم السياسية" },
    { match: /.*/, theme: "الحقوق" },
  ],
  segc: [
    { match: /FINANC|COMPTAB|TRADING|MARCHES/, theme: "المالية والمحاسبة" },
    { match: /COMMER|MARKETING|NEGOCIATION|AFFAIRES|MANAGEMENT|TRANSIT/, theme: "التجارة والتسيير" },
    { match: /.*/, theme: "العلوم الاقتصادية والتسيير" },
  ],
  arts: [
    { match: /MUSIQUE/, theme: "الموسيقى" },
    { match: /DESSIN|ARTS VISUELS|EDUCATION ARTISTIQUE/, theme: "الفنون البصرية" },
    { match: /SPECTACLE|COMEDIEN|SCENARIO|AUDIOVISUEL|CINEMA/, theme: "الفنون الدرامية والسمعية البصرية" },
    { match: /.*/, theme: "التصميم الرقمي" },
  ],
  staps: [
    { match: /ACTIVITES PHYSIQUES/, theme: "العلوم والتقنيات الرياضية" },
    { match: /.*/, theme: "التربية البدنية والرياضية" },
  ],
};

export function themeOf(fieldId: FieldId, name: string): string {
  const upper = name.toUpperCase();
  const rules = themes[fieldId];
  if (!rules) return "تكوينات أخرى";
  for (const rule of rules) {
    if (rule.match.test(upper)) return rule.theme;
  }
  return "تكوينات أخرى";
}

/* -------------------------------------------------------------------------- */
/* Programs                                                                    */
/* -------------------------------------------------------------------------- */

export type Program = {
  slug: string;
  /** Canonical published French name (quota suffix removed). */
  fr: string;
  /** Arabic label when curated, otherwise the French label. */
  ar: string;
  translated: boolean;
  field: Field;
  theme: string;
  track: Track;
  rule: Rule;
  rows: Row[];
  institutions: number;
  /** Rows that carry at least one numeric minimum. */
  withNumbers: number;
  low: number | null;
  high: number | null;
  median: number | null;
  /** Rows published with a local "pour bacheliers X" quota. */
  localQuota: boolean;
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/** Lowest published number in a row, the most generous reading of it. */
export function rowLow(row: Row): number | null {
  const values = row.v.map(numeric).filter((value): value is number => value !== null);
  return values.length ? Math.min(...values) : null;
}

/** Highest published number in a row, the strictest reading of it. */
export function rowHigh(row: Row): number | null {
  const values = row.v.map(numeric).filter((value): value is number => value !== null);
  return values.length ? Math.max(...values) : null;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
}

function build(): Program[] {
  const grouped = new Map<string, { field: Field; fr: string; rows: Row[] }>();

  for (const row of rows) {
    const field = fieldByLetter[row.f[0]];
    if (!field) continue;
    const fr = canonicalName(row.n);
    const key = `${field.id}|${fr}`;
    const entry = grouped.get(key);
    if (entry) entry.rows.push(row);
    else grouped.set(key, { field, fr, rows: [row] });
  }

  const used = new Set<string>();
  const programs: Program[] = [];

  for (const { field, fr, rows: list } of grouped.values()) {
    const base = slugify(fr) || field.id;
    let slug = base;
    if (used.has(slug)) slug = `${base}-${field.id}`;
    let suffix = 2;
    while (used.has(slug)) slug = `${base}-${field.id}-${suffix++}`;
    used.add(slug);

    const values = list.flatMap((row) => row.v.map(numeric).filter((n): n is number => n !== null));
    const ar = programNamesAr[fr];

    programs.push({
      slug,
      fr,
      ar: ar ?? fr,
      translated: Boolean(ar),
      field,
      theme: themeOf(field.id, fr),
      track: trackOf(fr),
      rule: ruleFor(field.id, fr),
      rows: [...list].sort((a, b) => (rowLow(a) ?? 99) - (rowLow(b) ?? 99) || a.en.localeCompare(b.en, "fr")),
      institutions: new Set(list.map((row) => row.e)).size,
      withNumbers: list.filter((row) => rowLow(row) !== null).length,
      low: values.length ? Math.min(...values) : null,
      high: values.length ? Math.max(...values) : null,
      median: median(values),
      localQuota: list.some((row) => QUOTA.test(row.n)),
    });
  }

  return programs.sort(
    (a, b) =>
      a.field.id.localeCompare(b.field.id) ||
      a.track.localeCompare(b.track) ||
      b.institutions - a.institutions ||
      a.fr.localeCompare(b.fr, "fr"),
  );
}

export const programs: Program[] = build();

export const programBySlug: Record<string, Program> = Object.fromEntries(
  programs.map((program) => [program.slug, program]),
);

export function programsForField(fieldId: FieldId): Program[] {
  return programs.filter((program) => program.field.id === fieldId);
}

export type ThemeGroup = { theme: string; programs: Program[] };

/**
 * Splits a field into theme sections. Academic licences come first, then the
 * teacher-training tracks, then the smaller tracks, so the first screen of a
 * field is never a wall of rows.
 */
export function themesForField(fieldId: FieldId): ThemeGroup[] {
  const list = programsForField(fieldId);
  const map = new Map<string, Program[]>();
  for (const program of list) {
    const key = program.theme;
    const bucket = map.get(key);
    if (bucket) bucket.push(program);
    else map.set(key, [program]);
  }
  return [...map.entries()]
    .map(([theme, items]) => ({ theme, programs: items }))
    .sort((a, b) => b.programs.length - a.programs.length || a.theme.localeCompare(b.theme, "ar"));
}

export type FieldSummary = {
  id: FieldId;
  field: Field;
  programs: number;
  institutions: number;
  /** Programs with at least one published number, excluding teacher tracks. */
  main: Program[];
  teaching: Program[];
  other: Program[];
};

export function fieldSummaries(): FieldSummary[] {
  const byField = new Map<FieldId, Program[]>();
  for (const program of programs) {
    const bucket = byField.get(program.field.id);
    if (bucket) bucket.push(program);
    else byField.set(program.field.id, [program]);
  }
  return [...byField.entries()].map(([id, list]) => {
    const institutions = new Set(list.flatMap((program) => program.rows.map((row) => row.e))).size;
    const main = list.filter((program) => program.track === "licence");
    return {
      id,
      field: fieldById[id],
      programs: list.length,
      institutions,
      main: main.sort((a, b) => b.institutions - a.institutions),
      teaching: list.filter((program) => program.track === "teaching").sort((a, b) => b.institutions - a.institutions),
      other: list
        .filter((program) => program.track !== "licence" && program.track !== "teaching")
        .sort((a, b) => b.institutions - a.institutions),
    };
  });
}

/** The programs every candidate recognises, used on the home page. */
export const popular: Program[] = programs
  .filter((program) => program.track === "licence" && program.withNumbers >= 10)
  .sort((a, b) => b.institutions - a.institutions || (a.median ?? 99) - (b.median ?? 99))
  .slice(0, 12);

export function institutionsFor(program: Program) {
  return program.rows.map((row) => ({
    row,
    low: rowLow(row),
    high: rowHigh(row),
  }));
}

/** Arabic names, wilayas and types, curated once for the published codes. */
export type InstitutionInfo = {
  code: string;
  name: string;
  ar: string;
  wilaya: string | null;
  wilayaCode: string | null;
  type: string;
};

export const institutionInfo: Record<string, InstitutionInfo> = Object.fromEntries(
  (institutionsRaw as InstitutionInfo[]).map((item) => [item.code, item]),
);

/** Institutions that publish at least one program. */
export const institutions = (() => {
  const map = new Map<
    string,
    { code: string; name: string; ar: string; wilaya: string | null; type: string; programs: number; fieldIds: Set<FieldId> }
  >();
  for (const row of rows) {
    const field = fieldByLetter[row.f[0]];
    const info = institutionInfo[row.e];
    const entry = map.get(row.e);
    if (entry) {
      entry.programs += 1;
      if (field) entry.fieldIds.add(field.id);
    } else {
      map.set(row.e, {
        code: row.e,
        name: row.en,
        ar: info?.ar ?? row.en,
        wilaya: info?.wilaya ?? null,
        type: info?.type ?? "other",
        programs: 1,
        fieldIds: new Set(field ? [field.id] : []),
      });
    }
  }
  return [...map.values()].sort((a, b) => a.ar.localeCompare(b.ar, "ar"));
})();

export const wilayas = [...new Set(institutions.map((item) => item.wilaya).filter((name): name is string => Boolean(name)))].sort(
  (a, b) => a.localeCompare(b, "ar"),
);

export type SearchEntry = {
  slug: string;
  ar: string;
  fr: string;
  field: string;
  fieldId: FieldId;
  theme: string;
  track: Track;
  institutions: number;
  low: number | null;
};

/** Compact index handed to the client search, one entry per program. */
export const searchIndex: SearchEntry[] = programs.map((program) => ({
  slug: program.slug,
  ar: program.ar,
  fr: program.fr,
  field: program.field.ar,
  fieldId: program.field.id,
  theme: program.theme,
  track: program.track,
  institutions: program.institutions,
  low: program.low,
}));

/* -------------------------------------------------------------------------- */
/* Trends                                                                      */
/* -------------------------------------------------------------------------- */

export type TrendPoint = { year: number; low: number; median: number; n: number };

export const trendYears: number[] = trendsRaw.years as number[];

export const trendStats = trendsRaw.stats as Record<string, { rows: number; institutions: number; numericRows: number }>;

const trendPrograms = trendsRaw.programs as Record<
  string,
  Record<string, { low: number; median: number; n: number }>
>;

/** Lowest/median published number per session, for one program. */
export function trendFor(program: Program): TrendPoint[] {
  const record = trendPrograms[`${program.field.letter}|${program.fr}`];
  if (!record) return [];
  return Object.entries(record)
    .map(([year, point]) => ({ year: Number(year), low: point.low, median: point.median, n: point.n }))
    .sort((a, b) => a.year - b.year);
}

/**
 * The smallest program record the calculator needs. Rows stay on the server:
 * 4185 of them would triple the client bundle for no benefit.
 */
export type CalcEntry = {
  slug: string;
  ar: string;
  fr: string;
  fieldId: FieldId;
  fieldAr: string;
  theme: string;
  track: Track;
  low: number | null;
  median: number | null;
  withNumbers: number;
};

export const calcIndex: CalcEntry[] = programs.map((program) => ({
  slug: program.slug,
  ar: program.ar,
  fr: program.fr,
  fieldId: program.field.id,
  fieldAr: program.field.ar,
  theme: program.theme,
  track: program.track,
  low: program.low,
  median: program.median,
  withNumbers: program.withNumbers,
}));

export const stats = {
  programs: programs.length,
  institutions: institutions.length,
  rows: rows.length,
  fields: Object.keys(fieldById).length,
  numericRows: rows.filter((row) => rowLow(row) !== null).length,
};
