import Link from "next/link";
import type { Metadata } from "next";
import { fields, formulaText, eligibleText } from "@/lib/fields";
import { stats } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "كيف يتم التوجيه الجامعي؟ المعدل الموزون والأولويات",
  description:
    "شرح المعايير الأربعة للتوجيه الجامعي في الجزائر، جدول المعدل الموزون لكل ميدان، معنى أعمدة أ1/أ2/أ3 وNC، وكيف قُرئ ملف 2026.",
  alternates: { canonical: "/kayfa" },
};

export default function HowItWorksPage() {
  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "كيف يتم التوجيه" }]} />
        </div>

        <PageTitle
          eyebrow="الشرح"
          title="التوجيه ليس قرعة، ولا رقمًا واحدًا"
          lead="أربعة معايير تحدد أين تُوجَّه: الشعبة والمعدل، الرغبات، المقاعد، والدائرة الجغرافية. المعدل الموزون يدخل في المعيار الأول، ولا يلغي الباقي."
        />

        <article className="max-w-prose py-8 text-[13px] leading-7 text-muted">
          <h2 className="font-display text-[22px] font-bold text-ink">1. المعايير الأربعة</h2>
          <p className="mt-2">
            المنشور الوزاري يبني التوجيه على شعبة البكالوريا ونتائجها (بالمعدل العام أو المعدل الموزون حسب الميدان)،
            ثم الرغبات التي تدخلها على الأرضية، ثم الطاقة الاستيعابية لكل مؤسسة، ثم الدوائر الجغرافية المرتبطة بمكان
            إقامتك أو بمؤسسة الحصول على البكالوريا. لذلك لا يكفي أن يتجاوز معدلك رقمًا منشورًا.
          </p>

          <h2 className="mt-8 font-display text-[22px] font-bold text-ink">2. المعدل الموزون</h2>
          <p className="mt-2">
            الصيغة العامة تعطي معدل البكالوريا وزنًا مضاعفًا وتضيف المادة الأساسية للميدان:{" "}
            <span dir="ltr" className="num font-semibold text-ink">(BAC×2 + matières essentielles) / 3</span>. بعض الميادين
            لا توزن شيئًا وتُرتب على المعدل العام، وبعضها يستثني شعبة تقني رياضي.
          </p>

          <div className="mt-4 overflow-x-auto border border-line">
            <table className="w-full border-collapse text-right text-[11.5px]">
              <thead>
                <tr className="border-b border-line-strong text-[10px] uppercase tracking-wider text-muted">
                  <th scope="col" className="p-2.5 font-semibold">الميدان</th>
                  <th scope="col" className="p-2.5 font-semibold">الترتيب</th>
                  <th scope="col" className="p-2.5 font-semibold">استثناء تقني رياضي</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id} className="border-b border-line/70 align-top last:border-0">
                    <th scope="row" className="p-2.5 text-right font-semibold text-ink">
                      <Link href={`/mayadin/${field.id}`} className="hover:text-brand">
                        {field.ar}
                      </Link>
                      <span className="mt-0.5 block text-[10px] font-normal leading-4 text-muted/80">
                        {eligibleText(field)}
                      </span>
                    </th>
                    <td dir="ltr" className="num p-2.5 text-left text-[11px] text-ink">
                      {formulaText[field.formula].ar}
                    </td>
                    <td className="p-2.5 text-[11px] text-muted">
                      {field.technicalFormula && field.technicalFormula !== field.formula ? (
                        <span dir="ltr" className="num">
                          {formulaText[field.technicalFormula].ar}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px]">
            الأرقام والمواد في هذا الجدول منقولة من جدول المعدل الموزون في المنشور الوزاري لدورة 2026. الترجمة (مثل
            «الترجمة»: متوسط ثلاث لغات) استثناء مذكور صراحة، وبعض اللغات (الإيطالية، الروسية، الصينية، التركية) تُرتَّب على
            المعدل العام.
          </p>

          <h2 className="mt-8 font-display text-[22px] font-bold text-ink">3. أ1، أ2، أ3: أولويات لا سنوات</h2>
          <p className="mt-2">
            في ملف المعدلات، كل تخصص يحمل ثلاثة أرقام. كل عمود يخص أولوية من أولويات الشعبة في بطاقة التكوين. قد تجد
            عمودًا فارغًا أو «--» لأن أحدًا لم يُوجَّه في تلك الأولوية، و«NC» لأن الفيلير لم تُشبَع فلم يُحسب لها حد أدنى
            بعد المرحلة الأولى فقط. لذلك نعرض الأرقام كما هي، ونرفض تحويل «NC» إلى 10.00 أو حذف الصف. الملف الذي
            نقرأه هو الملف النهائي بعد المرحلة الثانية، وفيه استُبدلت معظم قيم «NC» بأرقام فعلية.
          </p>

          <h2 className="mt-8 font-display text-[22px] font-bold text-ink">4. كيف قرأنا الملف</h2>
          <p className="mt-2">
            المصدر هو ملف «Moyennes minimales BAC 2026» المنشور بعد المرحلة الثانية (الملف النهائي): {stats.rows.toLocaleString("fr-FR")} سطرًا
            و{stats.institutions} مؤسسة. فككنا الجدول سطرًا سطرًا، ثم:
          </p>
          <ul className="mt-2 list-disc space-y-1 pr-5">
            <li>جمعنا الصفوف التي تكرّرت بسبب الحصص المحلية («pour bacheliers …») في تخصص واحد، مع الاحتفاظ بعدد المؤسسات.</li>
            <li>فصلنا مسارات المدارس العليا للأساتذة (P.E.S / P.E.M / P.E.P) عن الليسانس الجامعية، لأنها مسارات تكوين مختلفة.</li>
            <li>ربطنا كل تخصص بصيغة الترتيب المنشورة لميدانه، مع استثناء اللغة أو اللغات الثلاث حيث ينص المنشور.</li>
            <li>لم نترجم أي رقم، ولم نقدّر أي حد ناقص، ولم نضف سنة غير منشورة.</li>
            <li>
              أضفنا مقارنة 2022–2026 لكل تخصص حين تسمح رموز الفيلير بذلك، وروابط الملفات الأقدم دون مقارنة رقمية.
            </li>
          </ul>
          <p className="mt-2">
            النتيجة {stats.programs} تخصصًا داخل {stats.fields} ميدانًا. الأسماء العربية للتخصصات الشائعة مترجمة، وما لم
            نترجمه يظهر باسمه الفرنسي المنشور بدل ترجمة مخترعة.
          </p>

          <h2 className="mt-8 font-display text-[22px] font-bold text-ink">5. قبل أن تملأ بطاقة الرغبات</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Callout title="تحقق من الشعبة">
              الميادين العلمية تفتحها الشعب العلمية والتقنية. إذا كنت من شعبة أدبية، لا تضع رغبة لا تقبل شعبتك أصلًا.
            </Callout>
            <Callout title="اقرأ شرط التكوين">
              بعض التكوينات تضيف مقابلة أو اختبارًا (المدارس العليا للأساتذة، الفنون، الرياضة). المنشور يذكرها في بطاقة
              التكوين.
            </Callout>
            <Callout title="لا تعتمد على رقم واحد">
              أدنى رقم منشور ليس الحد الذي ستقبله. هو أدنى من قُبل في دورة سابقة، وقد يتغير مع عدد المترشحين والمقاعد.
            </Callout>
            <Callout title="الأرضية الرسمية">
              التسجيل والتوجيه والطعون تمر عبر أرضية الوزارة. موقعنا للقراءة والتحضير فقط.
            </Callout>
          </div>

          <div className="mt-8 border-t border-line-strong pt-4">
            <p className="eyebrow">المصادر</p>
            <ul className="mt-2 space-y-1 text-[11.5px]">
              <li>
                <a
                  className="link"
                  href="https://www.esi.dz/wp-content/uploads/2026/08/BAC-2026-Moyennes-minimales-2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Moyennes minimales BAC 2026 — fichier définitif (MESRS)
                </a>
              </li>
              <li>
                <a className="link" href="https://circulaire.mesrs.dz" target="_blank" rel="noreferrer">
                  المنشور الوزاري للتسجيل الأولي والتوجيه 2026
                </a>
              </li>
              <li>
                <a className="link" href="https://orientation-esi.dz" target="_blank" rel="noreferrer">
                  أرضية التوجيه الرسمية
                </a>
              </li>
            </ul>
          </div>
        </article>
      </div>
    </Shell>
  );
}
