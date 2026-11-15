/**
 * Fields, streams and the official weighting rules.
 *
 * The formulas come from the MESRS orientation circular (session 2026, the
 * signed pdf), whose weighting table is reproduced by the ministry's own
 * faculty handouts. Each field names the formula it applies and, where the
 * rule differs for the technical stream, the exception. Nothing here is
 * inferred: a field with no published weighting falls back to the general
 * average.
 */

export type StreamId =
  | "sciences"
  | "math"
  | "tech-math"
  | "tech-phy"
  | "tech-civ"
  | "tech-elec"
  | "tech-mec"
  | "tech-proc"
  | "gestion"
  | "lettres"
  | "langues"
  | "arts";

export type FormulaId = "snv" | "math" | "math_phys" | "math_tech" | "lang" | "translation" | "general";

export type FieldId =
  | "sante"
  | "snv"
  | "stu"
  | "st"
  | "sm"
  | "mi"
  | "arch"
  | "lang"
  | "arabic"
  | "amazigh"
  | "shs"
  | "dsp"
  | "segc"
  | "arts"
  | "staps";

export type Stream = {
  id: StreamId;
  ar: string;
  fr: string;
  /** Scientific streams are the only ones admitted to science fields. */
  scientific: boolean;
  /** Technical streams carry a specialty subject. */
  technical: boolean;
};

export const streams: Stream[] = [
  { id: "sciences", ar: "علوم تجريبية", fr: "Sciences expérimentales", scientific: true, technical: false },
  { id: "math", ar: "رياضيات", fr: "Mathématiques", scientific: true, technical: false },
  { id: "tech-math", ar: "تقني رياضي — رياضيات", fr: "Technique mathématique", scientific: true, technical: true },
  { id: "tech-phy", ar: "تقني رياضي — فيزياء", fr: "Technique physique", scientific: true, technical: true },
  { id: "tech-civ", ar: "تقني رياضي — هندسة مدنية", fr: "Technique génie civil", scientific: true, technical: true },
  { id: "tech-elec", ar: "تقني رياضي — هندسة كهربائية", fr: "Technique électrotechnique", scientific: true, technical: true },
  { id: "tech-mec", ar: "تقني رياضي — هندسة ميكانيكية", fr: "Technique mécanique", scientific: true, technical: true },
  { id: "tech-proc", ar: "تقني رياضي — هندسة الطرائق", fr: "Technique génie des procédés", scientific: true, technical: true },
  { id: "gestion", ar: "تسيير واقتصاد", fr: "Gestion et économie", scientific: false, technical: false },
  { id: "lettres", ar: "آداب وفلسفة", fr: "Lettres et philosophie", scientific: false, technical: false },
  { id: "langues", ar: "لغات أجنبية", fr: "Langues étrangères", scientific: false, technical: false },
  { id: "arts", ar: "فنون", fr: "Arts", scientific: false, technical: false },
];

export const streamById: Record<StreamId, Stream> = Object.fromEntries(
  streams.map((stream) => [stream.id, stream]),
) as Record<StreamId, Stream>;

export type Field = {
  id: FieldId;
  /** First letter of the ministry's filière code (A, B, C…). */
  letter: string;
  ar: string;
  fr: string;
  /** One line, Arabic, explaining what the field actually trains for. */
  summary: string;
  formula: FormulaId;
  /** Exception applied to technical streams when the circular states one. */
  technicalFormula?: FormulaId;
  /** Streams admitted by the circular. Empty = every stream. */
  eligible: StreamId[];
  /** Fields ranked nationally rather than per institution. */
  national?: boolean;
};

const ALL: StreamId[] = streams.map((stream) => stream.id);
const SCIENTIFIC: StreamId[] = streams.filter((stream) => stream.scientific).map((stream) => stream.id);

export const fields: Field[] = [
  {
    id: "sante",
    letter: "P",
    ar: "العلوم الطبية والصحة",
    fr: "Sciences médicales",
    summary: "الطب، الصيدلة، طب الأسنان، والعلوم الصحية: ترتيب وطني على المعدل الموزون بعلامة علوم الطبيعة والحياة.",
    formula: "snv",
    technicalFormula: "general",
    eligible: SCIENTIFIC,
    national: true,
  },
  {
    id: "snv",
    letter: "D",
    ar: "علوم الطبيعة والحياة",
    fr: "Sciences de la nature et de la vie",
    summary: "البيولوجيا والبيوكيمياء والعلوم الفلاحية والبيطرية: المعدل الموزون بعلامة علوم الطبيعة والحياة.",
    formula: "snv",
    technicalFormula: "general",
    eligible: SCIENTIFIC,
  },
  {
    id: "stu",
    letter: "E",
    ar: "علوم الأرض والكون",
    fr: "Sciences de la terre et de l’univers",
    summary: "الجيولوجيا والجغرافيا الفيزيائية وعلوم الأرض: نفس وزن علوم الطبيعة والحياة.",
    formula: "snv",
    technicalFormula: "general",
    eligible: SCIENTIFIC,
  },
  {
    id: "st",
    letter: "A",
    ar: "علوم وتكنولوجيا",
    fr: "Sciences et technologies",
    summary: "الجذع المشترك للهندسة: معدل موزون بمتوسط الرياضيات والفيزياء، ولمادة التخصص في التقني رياضي.",
    formula: "math_phys",
    technicalFormula: "math_tech",
    eligible: SCIENTIFIC,
  },
  {
    id: "sm",
    letter: "B",
    ar: "علوم المادة",
    fr: "Sciences de la matière",
    summary: "الفيزياء والكيمياء وعلوم المادة: متوسط الرياضيات والفيزياء فوق المعدل العام.",
    formula: "math_phys",
    technicalFormula: "math_tech",
    eligible: SCIENTIFIC,
  },
  {
    id: "mi",
    letter: "C",
    ar: "رياضيات وإعلام آلي",
    fr: "Mathématiques et informatique",
    summary: "الرياضيات، الإعلام الآلي، ومدارس الذكاء الاصطناعي: المعدل الموزون بعلامة الرياضيات.",
    formula: "math",
    technicalFormula: "math",
    eligible: SCIENTIFIC,
  },
  {
    id: "arch",
    letter: "N",
    ar: "هندسة معمارية وعمران",
    fr: "Architecture, urbanisme et métiers de la ville",
    summary: "المعمارية والعمران: متوسط الرياضيات والفيزياء، مع اختبار أو مقابلة في بعض المؤسسات.",
    formula: "math_phys",
    technicalFormula: "math_phys",
    eligible: SCIENTIFIC,
  },
  {
    id: "lang",
    letter: "H",
    ar: "اللغات الأجنبية",
    fr: "Langues étrangères",
    summary: "الإنجليزية، الفرنسية، الإسبانية، الألمانية…: المعدل الموزون بعلامة اللغة المطلوبة.",
    formula: "lang",
    eligible: ALL,
  },
  {
    id: "arabic",
    letter: "L",
    ar: "اللغة والأدب العربي",
    fr: "Langue et littérature arabes",
    summary: "الأدب العربي والعلوم الإسلامية: الترتيب على المعدل العام للبكالوريا.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "amazigh",
    letter: "M",
    ar: "اللغة والثقافة الأمازيغية",
    fr: "Langue et culture amazighes",
    summary: "اللغة الأمازيغية وآدابها: الترتيب على المعدل العام.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "shs",
    letter: "I",
    ar: "العلوم الإنسانية والاجتماعية",
    fr: "Sciences humaines et sociales",
    summary: "علم النفس، علم الاجتماع، التاريخ، الإعلام والاتصال: المعدل العام.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "dsp",
    letter: "G",
    ar: "الحقوق والعلوم السياسية",
    fr: "Droit et sciences politiques",
    summary: "الحقوق والعلوم السياسية: المعدل العام، مع أولويات حسب الشعبة.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "segc",
    letter: "F",
    ar: "العلوم الاقتصادية والتسيير",
    fr: "Sciences économiques, de gestion et commerciales",
    summary: "الاقتصاد، التسيير، والعلوم التجارية: المعدل العام.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "arts",
    letter: "K",
    ar: "الفنون",
    fr: "Arts",
    summary: "الفنون البصرية والسمعية البصرية: المعدل العام، وبعض المسارات بمقابلة.",
    formula: "general",
    eligible: ALL,
  },
  {
    id: "staps",
    letter: "J",
    ar: "النشاطات البدنية والرياضية",
    fr: "STAPS",
    summary: "علوم وتقنيات النشاطات البدنية والرياضية: المعدل العام مع اختبارات بدنية.",
    formula: "general",
    eligible: ALL,
  },
];

export const fieldByLetter: Record<string, Field> = Object.fromEntries(
  fields.map((field) => [field.letter, field]),
);
export const fieldById: Record<FieldId, Field> = Object.fromEntries(
  fields.map((field) => [field.id, field]),
) as Record<FieldId, Field>;

export function isEligible(field: Field, stream: StreamId): boolean {
  return field.eligible.includes(stream);
}

/** One Arabic sentence listing the streams admitted to a field. */
export function eligibleText(field: Field): string {
  if (field.eligible.length === streams.length) return "كل الشعب";
  const scientific = field.eligible.every((id) => streamById[id].scientific);
  if (scientific && field.eligible.length >= 8) {
    return "الشعب العلمية والتقنية: علوم تجريبية، رياضيات، تقني رياضي بفروعه";
  }
  return field.eligible.map((id) => streamById[id].ar).join("، ");
}

/** Plain-language statement of the weighting, used in cards and the calculator. */
export const formulaText: Record<FormulaId, { ar: string; short: string }> = {
  snv: { ar: "(المعدل × 2 + علوم الطبيعة والحياة) ÷ 3", short: "علوم الطبيعة والحياة" },
  math: { ar: "(المعدل × 2 + الرياضيات) ÷ 3", short: "الرياضيات" },
  math_phys: { ar: "(المعدل × 2 + (الرياضيات + الفيزياء) ÷ 2) ÷ 3", short: "الرياضيات والفيزياء" },
  math_tech: { ar: "(المعدل × 2 + (الرياضيات + مادة التخصص) ÷ 2) ÷ 3", short: "الرياضيات ومادة التخصص" },
  lang: { ar: "(المعدل × 2 + علامة اللغة) ÷ 3", short: "علامة اللغة" },
  translation: { ar: "(المعدل × 2 + متوسط ثلاث لغات) ÷ 3", short: "ثلاث لغات" },
  general: { ar: "المعدل العام للبكالوريا", short: "المعدل العام" },
};
