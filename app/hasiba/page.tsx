import Link from "next/link";
import type { Metadata } from "next";
import { calcIndex, stats } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle } from "@/components/ui";
import { Calculator } from "@/components/calculator";

export const metadata: Metadata = {
  title: "حاسبة المعدل الموزون — قارن معدلك بمعدلات 2026",
  description:
    "أدخل شعبتك ومعدل البكالوريا وعلامات المواد الأساسية لتحصل على معدلك الموزون في كل ميدان، ثم قارنه بأدنى المعدلات المنشورة في 248 مؤسسة.",
  alternates: { canonical: "/hasiba" },
};

export default function CalculatorPage() {
  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "الحاسبة" }]} />
        </div>

        <PageTitle
          eyebrow="أدوات"
          title="معدلك الموزون، ميدانًا بميدان"
          lead="الصيغ من جدول المنشور الوزاري، والأرقام المقارن بها من ملف معدلات القبول 2026. لا نحسب شيئًا غير منشور، وحين تنقص علامة نقول لك أي علامة."
          aside={
            <div className="border border-line bg-surface px-4 py-3 text-[11px] leading-5 text-muted">
              <p className="num text-[13px] font-semibold text-ink">{stats.programs} تخصصًا</p>
              <p>في {stats.institutions} مؤسسة</p>
            </div>
          }
        />

        <div className="py-8">
          <Calculator entries={calcIndex} />
        </div>

        <div className="grid gap-5 border-t border-line-strong py-8 md:grid-cols-3">
          <div>
            <p className="eyebrow">لماذا يختلف المعدل؟</p>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              المعدل الموزون يمنح المعدل العام وزنًا مضاعفًا، ويضيف علامة المادة الأساسية للميدان. لذلك قد يكون معدلك في
              الطب أعلى أو أقل من معدلك العام، ومعدلك في الحقوق هو معدلك العام نفسه.
            </p>
          </div>
          <div>
            <p className="eyebrow">وماذا عن التقني رياضي؟</p>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              في علوم الطبيعة والحياة وعلوم الأرض والصحة، تُرتَّب شعبة تقني رياضي على المعدل العام بدل الصيغة الموزونة.
              الحاسبة تطبّق هذا الاستثناء تلقائيًا.
            </p>
          </div>
          <div>
            <p className="eyebrow">النتيجة استرشادية</p>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              المقارنة تتم مع أدنى رقم منشور للتخصص، وهو رقم أولوية واحدة من ثلاث. القبول الفعلي يعتمد على الأولوية
              والمقاعد والرغبات.{" "}
              <Link href="/kayfa" className="text-brand hover:underline">
                اقرأ كيف يتم التوجيه
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
