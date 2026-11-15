import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eligibleText, fieldById, formulaText } from "@/lib/fields";
import { institutionInfo, programBySlug, programs, programsForField, trendFor } from "@/lib/majors";
import { essentialLabels, langLabel } from "@/lib/rule";
import { familyByField } from "@/lib/families";
import { Shell, Breadcrumbs, PageTitle, FormulaBox, Stat } from "@/components/ui";
import { InstitutionTable } from "@/components/institution-table";

type Params = { slug: string };

/** Rendered on demand and cached: 261 pages with large tables would not fit the
 * build budget, and the content only changes once a session. */
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const program = programBySlug[slug];
  if (!program) return {};
  const low = program.low !== null ? `أدنى معدل منشور ${program.low.toFixed(2)}` : "بلا رقم منشور";
  return {
    title: `${program.ar} — ${program.institutions} مؤسسة ومعدلاتها 2026`,
    description: `${program.ar} (${program.fr}): ${program.institutions} مؤسسة، ${low}، وصيغة الترتيب ${program.rule.text}.`,
    alternates: { canonical: `/takhasus/${program.slug}` },
  };
}

export default async function ProgramPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const program = programBySlug[slug];
  if (!program) notFound();

  const field = program.field;
  const family = familyByField[field.id];
  const related = programsForField(field.id)
    .filter((item) => item.slug !== program.slug && item.track === program.track)
    .sort((a, b) => b.institutions - a.institutions)
    .slice(0, 6);

  const subjects = essentialLabels(program.rule.essential);
  const trend = trendFor(program);
  const first = trend[0];
  const last = trend[trend.length - 1];
  const change = first && last ? Math.round((last.low - first.low) * 100) / 100 : null;

  const tableRows = program.rows.map((row) => {
    const info = institutionInfo[row.e];
    return { code: row.e, name: row.en, v: row.v, ar: info?.ar, wilaya: info?.wilaya ?? undefined };
  });
  const wilayaList = [...new Set(tableRows.map((row) => row.wilaya).filter((name): name is string => Boolean(name)))].sort(
    (a, b) => a.localeCompare(b, "ar"),
  );

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs
            items={[
              { href: "/", label: "الرئيسية" },
              { href: "/mayadin", label: "الميادين" },
              { href: `/mayadin/${field.id}`, label: field.ar },
              { label: program.ar },
            ]}
          />
        </div>

        <PageTitle
          eyebrow={`${field.ar} · ${program.theme}`}
          title={program.ar}
          lead={
            <>
              <span className="block uppercase tracking-wide text-[11px] text-muted/80">{program.fr}</span>
              <span className="mt-2 block">
                {program.institutions} مؤسسة نشرت هذا التخصص في ملف 2026، منها {program.withNumbers} برقم عددي.
                {program.low !== null && ` أدنى قيمة منشورة: ${program.low.toFixed(2)}.`}
              </span>
            </>
          }
          aside={
            <div className="flex flex-wrap border border-line bg-surface">
              <Stat value={program.institutions} label="مؤسسة" />
              <Stat value={program.withNumbers} label="برقم منشور" />
              <Stat value={program.median !== null ? program.median.toFixed(2) : "—"} label="الوسيط" />
            </div>
          }
        />

        <div className="grid gap-6 py-6 md:grid-cols-[1.1fr_1fr]">
          <FormulaBox
            text={program.rule.text}
            note={
              <>
                <p>
                  المواد الأساسية: <strong className="font-semibold text-ink">{subjects.join(" + ")}</strong>
                  {program.rule.essential.kind === "translation" && (
                    <span className="text-muted"> (متوسط ثلاث لغات: {program.rule.essential.langs.map((lang) => langLabel[lang]).join("، ")})</span>
                  )}
                </p>
                {program.rule.technicalFormula !== program.rule.formula && (
                  <p className="mt-1">
                    شعبة تقني رياضي: <span className="num">{formulaText[program.rule.technicalFormula].ar}</span>
                  </p>
                )}
                <p className="mt-1">الشعب المقبولة حسب الميدان: {eligibleText(field)}.</p>
              </>
            }
          />

          <div className="border border-line bg-surface p-4">
            <p className="eyebrow">قراءة الأرقام</p>
            <div className="mt-2 space-y-1.5 text-[11.5px] leading-6 text-muted">
              <p>
                <span className="num font-semibold text-ink">
                  {program.low !== null ? program.low.toFixed(2) : "—"} — {program.high !== null ? program.high.toFixed(2) : "—"}
                </span>{" "}
                هو مدى كل الأرقام المنشورة لهذا التخصص عبر المؤسسات والأولويات.
              </p>
              {program.localQuota && (
                <p>
                  يحتوي الملف صفوفًا مخصّصة لحاملي بكالوريا ولاية معينة (صفوف محلية). أبقيناها داخل نفس التخصص، واسم
                  الولاية محفوظ في الملف المنشور.
                </p>
              )}
              <p>
                الصيغة تخص هذا التخصص نفسه، وقد تختلف عن صيغة الميدان إذا كان الميدان يغيّر المادة الأساسية حسب التخصص.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-line-strong pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[21px] font-bold text-ink">المؤسسات والأرقام المنشورة</h2>
            <Link href={`/mayadin/${field.id}`} className="text-[11.5px] text-brand hover:underline">
              كل تخصصات {field.ar} ←
            </Link>
          </div>

          <details className="mt-3 border border-line bg-surface px-4 py-3 text-[11.5px] leading-6 text-muted">
            <summary className="cursor-pointer select-none font-semibold text-ink">كيف تقرأ أ1، أ2، أ3؟</summary>
            <div className="mt-2 space-y-1.5">
              <p>
                الملف الرسمي ينشر ثلاثة أعمدة لكل تخصص. كل عمود هو الحد الأدنى للقبول في <strong className="text-ink">أولوية</strong>{" "}
                من أولويات الشعبة في بطاقة التكوين (أ1، أ2، أ3)، وليس ثلاث سنوات ولا ثلاث جامعات.
              </p>
              <p>
                <span className="num font-semibold text-ink">NC</span>: الفيلير لم تُشبَع، فلم يُحسب لها حد أدنى (تظهر في
                الملف المؤقت بعد المرحلة الأولى). <span className="num font-semibold text-ink">--</span>: لم يُوجَّه أي
                حامل بكالوريا في تلك الأولوية.
              </p>
              <p>الأرقام هنا من الملف النهائي لدورة 2026، بعد المرحلة الثانية.</p>
              <p>
                الأرقام لا تعني أن معدلك سيقبل: الترتيب يعتمد على الأولوية والطاقة الاستيعابية والرغبات، ويتم مركزيًا عبر منصة
                الوزارة.
              </p>
            </div>
          </details>

          <InstitutionTable rows={tableRows} wilayas={wilayaList} />
        </div>

        {trend.length > 1 && (
          <section className="mt-9 border-t border-line-strong pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-[21px] font-bold text-ink">الحد الأدنى عبر الدورات</h2>
              <span className="num text-[10.5px] text-muted">
                {trend[0].year} — {trend[trend.length - 1].year}
              </span>
            </div>
            <p className="mt-1 max-w-prose text-[11.5px] leading-6 text-muted">
              لكل دورة، أدنى قيمة منشورة لهذا التخصص في أي مؤسسة (وليس شرطًا واحدًا للوطن)، والوسيط بين كل الأرقام
              المنشورة. التغيرات تعكس عدد المترشحين والمقاعد، وليست وعدًا بالدورة القادمة.
            </p>

            <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_1fr]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-[11.5px]">
                  <thead>
                    <tr className="border-b border-line-strong text-[10px] uppercase tracking-normal text-muted">
                      <th scope="col" className="py-2 font-semibold">الدورة</th>
                      <th scope="col" className="num py-2 text-center font-semibold">أدنى</th>
                      <th scope="col" className="num py-2 text-center font-semibold">الوسيط</th>
                      <th scope="col" className="num py-2 text-center font-semibold">أرقام</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trend.map((point) => (
                      <tr key={point.year} className="border-b border-line/70">
                        <th scope="row" className="num py-2 text-right font-semibold text-ink">{point.year}</th>
                        <td className="num py-2 text-center font-semibold text-ink">{point.low.toFixed(2)}</td>
                        <td className="num py-2 text-center text-muted">{point.median.toFixed(2)}</td>
                        <td className="num py-2 text-center text-muted/70">{point.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {change !== null && (
                  <p className="num mt-2 text-[11px] text-muted">
                    تغير أدنى قيمة: {change >= 0 ? "+" : ""}
                    {change.toFixed(2)} بين {first.year} و{last.year}.
                  </p>
                )}
              </div>

              <div className="border border-line bg-surface p-4">
                <p className="eyebrow">أدنى قيمة منشورة</p>
                <ul className="mt-3 space-y-2">
                  {trend.map((point) => (
                    <li key={point.year} className="flex items-center gap-2">
                      <span className="num w-9 shrink-0 text-[10.5px] text-muted">{point.year}</span>
                      <span className="h-2 flex-1 bg-line/60" aria-hidden>
                        <span
                          className="block h-2 bg-brand"
                          style={{ width: `${Math.max(2, Math.min(100, (point.low / 20) * 100))}%` }}
                        />
                      </span>
                      <span className="num w-10 shrink-0 text-left text-[10.5px] text-ink">{point.low.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-line pt-2 text-[10.5px] leading-5 text-muted">
                  المقياس من 0 إلى 20. 2022 و2023 يظهران بمؤسسات أقل في الملف المنشور؛ الرقم قابل للتغير مع تغطية الملف.
                </p>
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <div className="mt-9 border-t border-line-strong pt-5">
            <p className="eyebrow">في نفس الميدان</p>
            <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-line/70">
                  <Link href={`/takhasus/${item.slug}`} className="group flex items-baseline justify-between gap-3 py-2.5">
                    <span className="min-w-0 truncate text-[12.5px] text-ink group-hover:text-brand">{item.ar}</span>
                    <span className="num shrink-0 text-[10.5px] text-muted">
                      {item.institutions} مؤسسة{item.low !== null && ` · من ${item.low.toFixed(2)}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-muted">
              {family?.ar} — {field.ar}.{" "}
              <Link href="/hasiba" className="text-brand hover:underline">
                قارن معدلك
              </Link>
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
}
