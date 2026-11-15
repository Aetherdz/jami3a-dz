import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fieldById, type FieldId } from "@/lib/fields";
import { institutions, programs, trackLabel } from "@/lib/majors";
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
    title: `${institution.ar} — التخصصات التي تُدرّسها`,
    description: `التخصصات التي تُدرّسها ${institution.ar} (${institution.name}) وميادينها، مع نوع كل تكوين. الوحدات والمعاملات في بطاقة التكوين الخاصة بالمؤسسة.`,
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

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs
            items={[
              { href: "/", label: "الرئيسية" },
              { href: "/jamiat", label: "المؤسسات" },
              { label: institution.ar },
            ]}
          />
        </div>

        <PageTitle
          eyebrow={`${typeLabel[institution.type] ?? "مؤسسة"}${institution.wilaya ? ` · ${institution.wilaya}` : ""} · ${institution.code}`}
          title={institution.ar}
          lead={
            <>
              <span className="block text-[15px] uppercase tracking-wide text-muted/80">{institution.name}</span>
              <span className="mt-2 block">
                تُدرّس {list.length} تخصصًا في {grouped.size} ميدانًا. افتح أي تخصص لترى المؤسسات الأخرى التي تُدرّسه.
              </span>
            </>
          }
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={list.length} label="تخصصًا" />
              <Stat value={grouped.size} label="ميدانًا" />
            </div>
          }
        />

        <div className="border-t border-line-strong pt-5">
          {[...grouped.entries()].map(([fieldId, items]) => (
            <section key={fieldId} className="mb-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
                <h2 className="font-display text-[24px] font-bold text-ink">{fieldById[fieldId].ar}</h2>
                <Link href={`/mayadin/${fieldId}`} className="text-[15px] text-brand hover:underline">
                  الميدان ←
                </Link>
              </div>
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {items.map((program) => (
                  <li key={program.slug} className="border-b border-line/60">
                    <Link href={`/takhasus/${program.slug}`} className="group flex items-baseline justify-between gap-3 py-3">
                      <span className="min-w-0">
                        <span className="block text-[17px] font-semibold text-ink group-hover:text-brand">{program.ar}</span>
                        <span className="mt-0.5 block truncate text-[14px] uppercase tracking-wide text-muted/80">
                          {program.fr}
                        </span>
                      </span>
                      <span className="shrink-0 text-[15px] text-muted">{trackLabel[program.track]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="border-t border-line-strong py-6 text-[15px] leading-7 text-muted">
          الوحدات والمعاملات والأرصدة تُنشر في بطاقة التكوين لهذه المؤسسة، وتختلف من تخصص إلى آخر. أما أرقام القبول
          والتوجيه فمكانها موقع البكالوريا.
        </p>
      </div>
    </Shell>
  );
}
