import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fieldById, fields, type FieldId } from "@/lib/fields";
import { programsForField } from "@/lib/majors";
import { familyByField } from "@/lib/families";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";
import { ProgramList, type ProgramListItem } from "@/components/program-list";

type Params = { field: string };

export function generateStaticParams(): Params[] {
  return fields.map((field) => ({ field: field.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { field: id } = await params;
  const field = fieldById[id as FieldId];
  if (!field) return {};
  const count = programsForField(field.id).length;
  const institutions = new Set(programsForField(field.id).flatMap((program) => program.rows.map((row) => row.e))).size;
  return {
    title: `${field.ar} — ${count} تخصصًا في ${institutions} مؤسسة`,
    description: `${field.summary} التخصصات التي تُدرَّس في هذا الميدان، والمؤسسات التي تقدّمها، ونوع كل تكوين.`,
    alternates: { canonical: `/mayadin/${field.id}` },
  };
}

export default async function FieldPage({ params }: { params: Promise<Params> }) {
  const { field: id } = await params;
  const field = fieldById[id as FieldId];
  if (!field) notFound();

  const programs = programsForField(field.id);
  const institutions = new Set(programs.flatMap((program) => program.rows.map((row) => row.e))).size;
  const family = familyByField[field.id];
  const siblings = family ? family.fieldIds.filter((other) => other !== field.id) : [];

  const items: ProgramListItem[] = programs.map((program) => ({
    slug: program.slug,
    ar: program.ar,
    fr: program.fr,
    institutions: program.institutions,
    theme: program.theme,
    track: program.track,
  }));

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs
            items={[
              { href: "/", label: "الرئيسية" },
              { href: "/mayadin", label: "الميادين" },
              { label: field.ar },
            ]}
          />
        </div>

        <PageTitle
          eyebrow={`الميدان ${field.letter} · ${family?.ar ?? "ميدان"}`}
          title={field.ar}
          lead={field.summary}
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={programs.length} label="تخصصًا" />
              <Stat value={institutions} label="مؤسسة" />
            </div>
          }
        />

        <div className="grid gap-6 py-7 md:grid-cols-[1.6fr_1fr]">
          <p className="text-[17px] leading-8 text-muted">
            {programs.length} تخصصًا موزعة على {new Set(programs.map((program) => program.theme)).size} مجموعة. نبدأ
            بالليسانس الجامعية، ونفصل مسارات المدارس العليا للأساتذة لأنها غالبًا تشترط مقابلة أو اختبارًا. كل تخصص يعرض
            المؤسسات التي تُدرّسه.
          </p>
          <div className="border border-line bg-surface p-5">
            <p className="eyebrow">الوحدات والمعاملات</p>
            <p className="mt-2 text-[16px] leading-7 text-muted">
              وحدات كل تخصص ومعاملاتها وأرصدتها في بطاقة التكوين الخاصة بكل مؤسسة، وتختلف بينها. لا ننشر قائمة موحّدة
              لأنها ستكون تخمينًا.
            </p>
            <Link href="/hasiba" className="mt-3 inline-block text-[16px] text-brand hover:underline">
              احسب معدلك الجامعي ←
            </Link>
          </div>
        </div>

        <div className="border-t border-line-strong pt-2">
          <ProgramList items={items} />
        </div>

        <div className="mt-9 grid gap-8 border-t border-line-strong pt-6 md:grid-cols-2">
          <div>
            <p className="eyebrow">بعد القبول</p>
            <h2 className="mt-2 font-display text-[23px] font-bold text-ink">الحياة الجامعية</h2>
            <p className="mt-2 text-[16px] leading-7 text-muted">
              السكن، المطعم، النقل، ونظام الدراسة: ما ينتظرك بعد أن يُغلق باب التسجيل.
            </p>
            <Link
              href="/hayat"
              className="mt-3 inline-flex h-11 items-center rounded-card border border-ink bg-ink px-5 text-[16px] font-semibold text-bg hover:border-brand hover:bg-brand"
            >
              اقرأ الدليل
            </Link>
          </div>
          <div>
            <p className="eyebrow">ميادين مجاورة</p>
            <ul className="mt-2">
              {siblings.map((other) => (
                <li key={other} className="border-b border-line/70">
                  <Link href={`/mayadin/${other}`} className="flex items-baseline justify-between gap-3 py-3 hover:text-brand">
                    <span className="text-[17px] font-semibold text-ink">{fieldById[other].ar}</span>
                    <span className="num text-[15px] text-muted">{programsForField(other).length} تخصصًا</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Shell>
  );
}
