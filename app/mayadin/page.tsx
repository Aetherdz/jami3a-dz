import Link from "next/link";
import type { Metadata } from "next";
import { fieldSummaries, stats } from "@/lib/majors";
import { families } from "@/lib/families";
import { fieldById, formulaText } from "@/lib/fields";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";

export const metadata: Metadata = {
  title: "الميادين الخمسة عشر — معدلات القبول 2026",
  description:
    "خمسة عشر ميدان تكوين في الجزائر، مقسّمة إلى علوم وتكنولوجيا وصحة، لغات وآداب، وعلوم إنسانية واقتصاد: كل ميدان بصيغة ترتيبه وعدد تخصصاته.",
  alternates: { canonical: "/mayadin" },
};

export default function FieldsPage() {
  const summaries = fieldSummaries();
  const byId = new Map(summaries.map((item) => [item.id, item]));

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "الميادين" }]} />
        </div>

        <PageTitle
          eyebrow="الدليل"
          title="خمسة عشر ميدانًا، مرتّبة كما يقرأها الطالب"
          lead="ابدأ بالعائلة التي تناسب شعبتك، ثم الميدان، ثم التخصص، ثم المؤسسة. لا نعرض 4185 سطرًا في صفحة واحدة."
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={stats.fields} label="ميدانًا" />
              <Stat value={stats.programs} label="تخصصًا" />
              <Stat value={stats.institutions} label="مؤسسة" />
            </div>
          }
        />

        <div className="py-8">
          {families.map((family, familyIndex) => (
            <section key={family.id} className={familyIndex > 0 ? "mt-12" : ""}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-strong pb-3">
                <div>
                  <p className="eyebrow">العائلة {familyIndex + 1}</p>
                  <h2 className="mt-1 font-display text-[24px] font-bold text-ink">{family.ar}</h2>
                </div>
                <p className="num text-[11px] text-muted">
                  {family.fieldIds.reduce((sum, id) => sum + (byId.get(id)?.programs ?? 0), 0)} تخصصًا
                </p>
              </div>
              <p className="mt-3 max-w-prose text-[12.5px] leading-6 text-muted">{family.lead}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {family.fieldIds.map((id) => {
                  const field = fieldById[id];
                  const summary = byId.get(id);
                  const main = summary?.main.slice(0, 3) ?? [];
                  return (
                    <div key={id} className="flex flex-col border border-line bg-surface">
                      <div className="border-b border-line p-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-display text-[18px] font-bold text-ink">
                            <Link href={`/mayadin/${id}`} className="hover:text-brand">
                              {field.ar}
                            </Link>
                          </h3>
                          <span className="num rounded-card border border-line px-1.5 py-0.5 text-[10px] text-muted">
                            {field.letter}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-5 text-muted">{field.summary}</p>
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted/70">الترتيب</p>
                        <p dir="ltr" className="num mt-1 overflow-x-auto whitespace-nowrap text-[11px] text-ink">
                          {formulaText[field.formula].ar}
                        </p>
                        {field.technicalFormula && field.technicalFormula !== field.formula && (
                          <p className="mt-1 text-[10px] leading-4 text-muted">
                            تقني رياضي: {formulaText[field.technicalFormula].short}
                          </p>
                        )}
                      </div>

                      <ul className="mt-auto border-t border-line">
                        {main.map((program) => (
                          <li key={program.slug} className="border-b border-line/60 last:border-0">
                            <Link
                              href={`/takhasus/${program.slug}`}
                              className="flex items-baseline justify-between gap-2 px-4 py-2 hover:bg-raised"
                            >
                              <span className="min-w-0 truncate text-[11.5px] text-ink">{program.ar}</span>
                              <span className="num shrink-0 text-[10px] text-muted">{program.institutions}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={`/mayadin/${id}`}
                            className="flex items-center justify-between px-4 py-2 text-[11.5px] font-semibold text-brand hover:bg-raised"
                          >
                            <span>
                              {summary?.programs ?? 0} تخصصًا · {summary?.institutions ?? 0} مؤسسة
                            </span>
                            <span aria-hidden>←</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-line-strong py-6">
          <p className="max-w-prose text-[12px] leading-6 text-muted">
            ترتيب الميادين هنا تنظيمي فقط، ولا يعني أفضلية. الميدان لا يضمن تخصصًا: داخل كل ميدان تجد تخصصات بحدود دنيا
            مختلفة تمامًا، من 10.00 إلى أرقام مرتفعة في المدارس العليا والطب.
          </p>
        </div>
      </div>
    </Shell>
  );
}
