import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { institutionInfo, programBySlug, programsForField, trackLabel } from "@/lib/majors";
import { familyByField } from "@/lib/families";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";

type Params = { slug: string };

/** Rendered on demand and cached: 261 pages with long institution lists would
 * not fit the build budget, and the offer changes once a year. */
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const program = programBySlug[slug];
  if (!program) return {};
  return {
    title: `${program.ar} — ${program.institutions} مؤسسة تُدرّسه`,
    description: `${program.ar} (${program.fr}) في ميدان ${program.field.ar}: المؤسسات التي تُدرّسه، ونوع التكوين. الوحدات والمعاملات في بطاقة التكوين لكل مؤسسة.`,
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

  const uniqueRows = [...new Map(program.rows.map((row) => [row.e, row])).values()].map((row) => {
    const info = institutionInfo[row.e];
    return {
      code: row.e,
      name: row.en,
      ar: info?.ar ?? row.en,
      wilaya: info?.wilaya ?? null,
      national: info?.type === "national",
    };
  });

  /** « تنسيق وطني » is a recruitment pool, not a campus: it gets a line, not a link. */
  const offers = uniqueRows
    .filter((offer) => !offer.national)
    .sort((a, b) => (a.wilaya ?? "").localeCompare(b.wilaya ?? "", "ar") || a.ar.localeCompare(b.ar, "ar"));
  const national = uniqueRows.some((offer) => offer.national);

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
              <span className="block text-[15px] uppercase tracking-wide text-muted/80">{program.fr}</span>
              <span className="mt-2 block">
                {offers.length > 0
                  ? `يُدرَّس في ${offers.length} مؤسسة، ضمن مسار ${trackLabel[program.track]}.`
                  : `يُوجَّه عبر تنسيق وطني، ضمن مسار ${trackLabel[program.track]}.`}
              </span>
            </>
          }
          aside={
            <div className="flex flex-wrap items-stretch border border-line bg-surface">
              <Stat value={offers.length} label="مؤسسة" />
              <div className="px-4 py-3">
                <div className="text-[12.5px] leading-tight text-muted">المسار</div>
                <div className="mt-1.5 text-[15px] font-semibold text-ink">{trackLabel[program.track]}</div>
              </div>
            </div>
          }
        />

        <section className="border-t border-line-strong pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-[26px] font-bold text-ink">أين يُدرَّس</h2>
            <Link href={`/mayadin/${field.id}`} className="text-[16px] text-brand hover:underline">
              كل تخصصات {field.ar} ←
            </Link>
          </div>

          {national && (
            <p className="mt-3 border-b border-line/70 py-3 text-[15px] leading-7 text-muted">
              <span className="font-semibold text-ink">تنسيق وطني:</span> التوجيه في هذا التخصص مركزي، ولا يُسجَّل عبر
              مؤسسة بعينها في الملف المنشور.
            </p>
          )}

          <ul className="mt-3 grid gap-x-10 sm:grid-cols-2">
            {offers.map((offer) => (
              <li key={offer.code} className="border-b border-line/70">
                <Link href={`/jamiat/${offer.code}`} className="group flex items-baseline justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block text-[17px] font-semibold text-ink group-hover:text-brand">{offer.ar}</span>
                    <span className="mt-0.5 block truncate text-[14px] uppercase tracking-wide text-muted/80">{offer.name}</span>
                  </span>
                  <span className="shrink-0 text-[15px] text-muted">{offer.wilaya ?? "—"}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 max-w-prose text-[16px] leading-7 text-muted">
            ترتيب التخصص في المؤسسة، ووحداته ومعاملاته، تُنشر في بطاقة التكوين الخاصة بها. الوحدات تختلف من مؤسسة إلى
            أخرى، ولهذا لا نعرض قائمة موحّدة. أما أرقام القبول والتوجيه فمكانها موقع البكالوريا.
          </p>
        </section>

        {related.length > 0 && (
          <div className="mt-9 border-t border-line-strong pt-5">
            <p className="eyebrow">في نفس الميدان</p>
            <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-line/70">
                  <Link href={`/takhasus/${item.slug}`} className="group flex items-baseline justify-between gap-3 py-3">
                    <span className="min-w-0 truncate text-[17px] text-ink group-hover:text-brand">{item.ar}</span>
                    <span className="num shrink-0 text-[15px] text-muted">{item.institutions} مؤسسة</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-muted">
              {family?.ar} — {field.ar}.
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
}
