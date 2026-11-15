import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fieldById, fields, formulaText, eligibleText, type FieldId } from "@/lib/fields";
import { programsForField, type Program } from "@/lib/majors";
import { familyByField } from "@/lib/families";
import { Shell, Breadcrumbs, PageTitle, FormulaBox, Stat } from "@/components/ui";
import { ProgramList, type ProgramListItem } from "@/components/program-list";

type Params = { field: string };

export function generateStaticParams(): Params[] {
  return fields.map((field) => ({ field: field.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { field: id } = await params;
  const field = fieldById[id as FieldId];
  if (!field) return {};
  return {
    title: `${field.ar} — التخصصات والمعدلات المنشورة 2026`,
    description: `${field.summary} ${programsForField(field.id).length} تخصصًا في ${new Set(
      programsForField(field.id).flatMap((program) => program.rows.map((row) => row.e)),
    ).size} مؤسسة، مع صيغة الترتيب المنشورة لكل تخصص.`,
    alternates: { canonical: `/mayadin/${field.id}` },
  };
}

function range(programs: Program[]): { low: number | null; high: number | null } {
  const lows = programs.map((program) => program.low).filter((value): value is number => value !== null);
  const highs = programs.map((program) => program.high).filter((value): value is number => value !== null);
  return {
    low: lows.length ? Math.min(...lows) : null,
    high: highs.length ? Math.max(...highs) : null,
  };
}

export default async function FieldPage({ params }: { params: Promise<Params> }) {
  const { field: id } = await params;
  const field = fieldById[id as FieldId];
  if (!field) notFound();

  const programs = programsForField(field.id);
  const institutions = new Set(programs.flatMap((program) => program.rows.map((row) => row.e))).size;
  const bounds = range(programs);
  const family = familyByField[field.id];
  const siblings = family ? family.fieldIds.filter((other) => other !== field.id) : [];

  const items: ProgramListItem[] = programs.map((program) => ({
    slug: program.slug,
    ar: program.ar,
    fr: program.fr,
    institutions: program.institutions,
    low: program.low,
    theme: program.theme,
    track: program.track,
    withNumbers: program.withNumbers,
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
              <Stat
                value={bounds.low !== null ? bounds.low.toFixed(2) : "—"}
                label="أدنى رقم منشور"
              />
            </div>
          }
        />

        <div className="grid gap-6 py-6 md:grid-cols-[1.15fr_1fr]">
          <FormulaBox
            text={formulaText[field.formula].ar}
            note={
              <>
                <p>الشعب المقبولة: {eligibleText(field)}.</p>
                {field.technicalFormula && field.technicalFormula !== field.formula && (
                  <p className="mt-1">
                    شعبة تقني رياضي: <span dir="ltr" className="num">{formulaText[field.technicalFormula].ar}</span> — حسب
                    استثناء المنشور لهذا الميدان.
                  </p>
                )}
                <p className="mt-1">
                  الصيغة هنا للميدان كاملًا. داخل الميدان، قد يغيّر التخصص المادة الأساسية (مثل لغة التخصص في اللغات
                  والترجمة)، وصفحة كل تخصص تذكر صيغته بدقة.
                </p>
              </>
            }
          />

          <div className="border border-line bg-surface p-4">
            <p className="eyebrow">كيف تقرأ هذه الصفحة</p>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              {programs.length} تخصصًا موزعة على {new Set(programs.map((program) => program.theme)).size} مجموعة. نبدأ
              بالليسانس الجامعية، ونضع مسارات المدارس العليا للأساتذة في تبويب منفصل لأنها غالبًا تشترط مقابلة أو اختبارًا.
              الرقم تحت كل تخصص هو أدنى قيمة منشورة له في أي مؤسسة، وليس حدًّا واحدًا لكل الوطن.
            </p>
            <p className="num mt-2 text-[11px] text-muted">
              {bounds.low !== null && bounds.high !== null
                ? `المدى المنشور داخل الميدان: ${bounds.low.toFixed(2)} — ${bounds.high.toFixed(2)}`
                : "لا توجد أرقام منشورة في هذا الميدان"}
            </p>
          </div>
        </div>

        <div className="border-t border-line-strong pt-2">
          <ProgramList items={items} />
        </div>

        <div className="mt-10 grid gap-6 border-t border-line-strong pt-6 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">مقارنة معدلك</p>
            <h2 className="mt-2 font-display text-[20px] font-bold text-ink">هل يقع معدلك داخل هذه الأرقام؟</h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              الحاسبة تحسب معدلك الموزون لكل ميدان ثم تقارنه بأدنى رقم منشور لكل تخصص، وتبيّن لك الفارق.
            </p>
            <Link
              href="/hasiba"
              className="mt-4 inline-block rounded-card border border-ink bg-ink px-4 py-2 text-[12.5px] font-semibold text-bg hover:bg-brand hover:border-brand"
            >
              إلى الحاسبة
            </Link>
          </div>
          <div>
            <p className="eyebrow">ميادين مجاورة</p>
            <ul className="mt-2">
              {siblings.map((other) => (
                <li key={other} className="border-b border-line/70">
                  <Link href={`/mayadin/${other}`} className="flex items-baseline justify-between gap-3 py-2.5 hover:text-brand">
                    <span className="text-[12.5px] font-semibold text-ink">{fieldById[other].ar}</span>
                    <span className="num text-[10.5px] text-muted">{programsForField(other).length} تخصصًا</span>
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
