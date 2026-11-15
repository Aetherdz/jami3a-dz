/** Institution grouping, derived from the published name only. */
export const typeOrder = ["university", "centre", "ecole", "normale", "annexe", "institut", "national", "other"] as const;

export type InstitutionType = (typeof typeOrder)[number];

export const typeLabel: Record<string, string> = {
  university: "جامعات",
  centre: "مراكز جامعية",
  ecole: "مدارس وطنية وعليا",
  normale: "مدارس عليا للأساتذة",
  annexe: "ملحقات",
  institut: "معاهد",
  national: "تنسيق وطني",
  other: "مؤسسات أخرى",
};

export function typeOf(name: string): InstitutionType {
  const upper = name.toUpperCase();
  if (upper.includes("RECRUTEMENT NATIONAL")) return "national";
  if (upper.startsWith("ANNEXE")) return "annexe";
  if (upper.includes("ECOLE NORMALE")) return "normale";
  if (
    upper.includes("ECOLE NATIONALE") ||
    upper.includes("ECOLE SUPERIEURE") ||
    upper.includes("ECOLE POLYTECHNIQUE")
  ) {
    return "ecole";
  }
  if (upper.includes("C. UNIV") || upper.includes("CENTRE UNIVERSITAIRE")) return "centre";
  if (upper.includes("INSTITUT")) return "institut";
  if (upper.includes("UNIV")) return "university";
  return "other";
}
