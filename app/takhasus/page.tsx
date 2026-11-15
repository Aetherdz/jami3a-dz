import Link from "next/link";
import type { Metadata } from "next";
import { fieldById } from "@/lib/fields";
import { families, familyByField } from "@/lib/families";
import { programsForField, stats } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";
import { ProgramSearch } from "@/components/search";
import { searchIndex } from "@/lib/majors";

export const metadata: Metadata = {
  title: `التخصصات — ${stats.programs} تخصصًا ومعدلاتها المنشورة`,
  description:
    `قائمة التخصصات الجامعية في الجزائر، مجمّعة في ${stats.fields} ميدانًا: لكل تخصص المؤسسات التي تُدرّسه ونوع التكوين.`,
  alternates: { canonical: "/takhasus" },
};

export default function ProgramsPage() {
  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "التخصصات" }]} />
        </div>

        <PageTitle
          eyebrow="الفهرس"
          title="التخصصات ومعدلاتها المنشورة"
          lead={`${stats.programs} تخصصًا في ${stats.fields} ميدانًا. ابحث بالاسم أو ادخل من الميدان؛ صفحة كل تخصص تعرض المؤسسات والأرقام المنشورة.`}
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={stats.programs} label="تخصصًا" />
              <Stat value={stats.rows.toLocaleString("fr-FR")} label="سطرًا مصدرًا" />
            </div>
          }
        />

        <div className="max-w-xl py-6">
          <ProgramSearch index={searchIndex} />
        </div>

        <div className="flex flex-wrap gap-1.5 border-y border-line py-3">
          {families.map((family) => (
            <span key={family.id} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] uppercase tracking-normal text-muted/60">{family.short}</span>
              {family.fieldIds.map((id) => (
                <Link
                  key={id}
                  href={`/mayadin/${id}`}
                  className="rounded-card border border-line px-2 py-1 text-[13px] text-muted hover:border-ink hover:text-ink"
                >
                  {fieldById[id].ar}
                </Link>
              ))}
            </span>
          ))}
        </div>

        <div className="grid gap-x-9 gap-y-8 py-6 md:grid-cols-2">
          {families.flatMap((family) =>
            family.fieldIds.map((id) => {
              const list = programsForField(id)
                .filter((program) => program.track === "licence")
                .sort((a, b) => b.institutions - a.institutions)
                .slice(0, 6);
              const field = fieldById[id];
              return (
                <section key={id}>
                  <div className="flex items-baseline justify-between gap-2 border-b border-line-strong pb-2">
                    <h2 className="font-display text-[19.5px] font-bold text-ink">
                      <Link href={`/mayadin/${id}`} className="hover:text-brand">
                        {field.ar}
                      </Link>
                    </h2>
                    <span className="num text-[12.5px] text-muted">{programsForField(id).length}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-muted">{familyByField[id]?.ar}</p>
                  <ul className="mt-2">
                    {list.map((program) => (
                      <li key={program.slug} className="border-b border-line/60 last:border-0">
                        <Link href={`/takhasus/${program.slug}`} className="group flex items-baseline justify-between gap-3 py-2">
                          <span className="min-w-0 truncate text-[14.5px] text-ink group-hover:text-brand">{program.ar}</span>
                          <span className="num shrink-0 text-[12.5px] text-muted">
                            {program.institutions} · {program.low !== null ? program.low.toFixed(2) : "—"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/mayadin/${id}`} className="mt-2 inline-block text-[13.5px] font-medium text-brand hover:underline">
                    كل تخصصات الميدان ←
                  </Link>
                </section>
              );
            }),
          )}
        </div>
      </div>
    </Shell>
  );
}
