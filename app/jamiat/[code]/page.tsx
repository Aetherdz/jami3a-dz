import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fieldById, type FieldId } from "@/lib/fields";
import { institutions, numeric, programs } from "@/lib/majors";
import { typeLabel } from "@/lib/institution";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";

type Params = { code: string };

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { code } = await params;
  const institution = institutions.find((item) => item.code === code);
  if (!institution) return {};
  return {
    title: `${institution.ar} — التخصصات والمعدلات المنشورة 2026`,
    description: `التخصصات التي نشرت لها ${institution.ar} (${institution.name}) حدًّا أدنى في ملف معدلات القبول 2026، مع أعمدة الأولويات أ1 وأ2 وأ3.`,
    alternates: { canonical: `/jamiat/${institution.code}` },
  };
}

export default async function InstitutionPage({ params }: { params: Promise<Params> }) {
  const { code } = await params;
  const institution = institutions.find((item) => item.code === code);
  if (!institution) notFound();

  const list = programs
    .filter((program) => program.rows.some((row) => row.e === code))
    .sort((a, b) => a.field.id.localeCompare(b.field.id) || a.ar.localeCompare(b.ar, "ar"));

  const grouped = new Map<FieldId, typeof list>();
  for (const program of list) {
    const bucket = grouped.get(program.field.id);
    if (bucket) bucket.push(program);
    else grouped.set(program.field.id, [program]);
  }

  const numericRows = list.flatMap((program) => program.rows.filter((row) => row.e === code)).filter((row) => row.v.some((value) => numeric(value) !== null)).length;

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs
            items={[
              { href: "/", label: "الرئيسية" },
              { href: "/jamiat", label: "الجامعات" },
              { label: institution.ar },
            ]}
          />
        </div>

        <PageTitle
          eyebrow={`${typeLabel[institution.type] ?? "مؤسسة"}${institution.wilaya ? ` · ${institution.wilaya}` : ""} · الرمز ${institution.code}`}
          title={institution.ar}
          lead={
            <>
              <span className="block uppercase tracking-wide text-[11px] text-muted/80">{institution.name}</span>
              <span className="mt-2 block">
                نشرت هذه المؤسسة {list.length} تخصصًا في ملف 2026، منها {numericRows} برقم عددي. الأرقام أدناه هي حدود
                الأولويات الثلاثة كما وردت في الملف، دون تعديل.
              </span>
            </>
          }
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={list.length} label="تخصصًا" />
              <Stat value={grouped.size} label="ميدانًا" />
              <Stat value={numericRows} label="برقم منشور" />
            </div>
          }
        />

        <div className="py-6">
          {[...grouped.entries()].map(([fieldId, items]) => (
            <section key={fieldId} className="mb-8">
              <div className="flex items-baseline justify-between gap-2 border-b border-line-strong pb-2">
                <h2 className="font-display text-[19px] font-bold text-ink">
                  <Link href={`/mayadin/${fieldId}`} className="hover:text-brand">
                    {fieldById[fieldId].ar}
                  </Link>
                </h2>
                <span className="num text-[10.5px] text-muted">{items.length} تخصصًا</span>
              </div>
              <ul>
                {items.map((program) => {
                  const row = program.rows.find((item) => item.e === code)!;
                  return (
                    <li key={program.slug} className="border-b border-line/70">
                      <Link href={`/takhasus/${program.slug}`} className="group flex items-baseline justify-between gap-4 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate text-[12.5px] font-semibold text-ink group-hover:text-brand">
                            {program.ar}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] uppercase tracking-wide text-muted/70">
                            {program.fr}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-baseline gap-2">
                          {[0, 1, 2].map((index) => {
                            const value = row.v[index];
                            const number = numeric(value);
                            return (
                              <span key={index} className="w-11 text-left">
                                {number !== null ? (
                                  <span className="num text-[12px] font-semibold text-ink">{number.toFixed(2)}</span>
                                ) : (
                                  <span className="text-[10.5px] text-muted/60">{value ?? "—"}</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="border-t border-line-strong py-6 text-[11px] leading-6 text-muted">
          أ1 / أ2 / أ3 هي أعمدة الأولويات في الملف الرسمي. «NC» تعني أن الفيلير لم تُشبَع، و«--» تعني أنه لم يُوجَّه أي حامل
          بكالوريا في تلك الأولوية.{" "}
          <Link href="/kayfa" className="text-brand hover:underline">
            الشرح الكامل
          </Link>
        </p>
      </div>
    </Shell>
  );
}
