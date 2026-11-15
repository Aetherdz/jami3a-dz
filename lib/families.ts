/**
 * Three families hold the fifteen fields. The point is to never greet a
 * candidate with 261 program names: the home page shows three doors, each
 * field page shows themes, and only the program page shows institutions.
 */
import type { FieldId } from "./fields";

export type Family = {
  id: "science" | "letters" | "society";
  ar: string;
  short: string;
  lead: string;
  fieldIds: FieldId[];
};

export const families: Family[] = [
  {
    id: "science",
    ar: "العلوم والتكنولوجيا والصحة",
    short: "علوم",
    lead: "الطب والصحة، علوم الطبيعة والحياة، الرياضيات والإعلام الآلي، الهندسة بفروعها والهندسة المعمارية. تفتحها الشعب العلمية والتقنية، ومعظمها يُرتَّب بمعدل موزون.",
    fieldIds: ["sante", "snv", "stu", "mi", "st", "sm", "arch"],
  },
  {
    id: "letters",
    ar: "اللغات والآداب",
    short: "لغات",
    lead: "الإنجليزية والفرنسية والألمانية والإسبانية، الترجمة، اللغة والأدب العربي، واللغة الأمازيغية. مفتوحة لكل الشعب، وبعضها يُرتَّب بعلامة اللغة.",
    fieldIds: ["lang", "arabic", "amazigh"],
  },
  {
    id: "society",
    ar: "العلوم الإنسانية والاجتماعية والاقتصاد",
    short: "مجتمع",
    lead: "الحقوق والعلوم السياسية، العلوم الإنسانية والاجتماعية والإسلامية، الاقتصاد والتسيير والتجارة، الفنون، والعلوم الرياضية. الترتيب على المعدل العام في أغلبها.",
    fieldIds: ["shs", "dsp", "segc", "arts", "staps"],
  },
];

export const familyByField: Record<string, Family> = Object.fromEntries(
  families.flatMap((family) => family.fieldIds.map((id) => [id, family])),
);
