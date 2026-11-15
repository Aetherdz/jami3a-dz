import Link from "next/link";
import type { Metadata } from "next";
import { fieldSummaries, popular, stats } from "@/lib/majors";
import { families } from "@/lib/families";
import { fieldById, formulaText } from "@/lib/fields";
import { Shell, Stat, Callout } from "@/components/ui";
import { ProgramSearch } from "@/components/search";
import { searchIndex } from "@/lib/majors";

export const metadata: Metadata = {
  title: "جامعة الجزائر — المعدل الموزون ومعدلات القبول 2026",
  description:
    "احسب معدلك الموزون حسب الميدان، وقارنه بأدنى المعدلات المنشورة في 248 مؤسسة جامعية جزائرية لدورة 2026، مرتبة في 15 ميدانًا و261 تخصصًا.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const summaries = fieldSummaries();
  const byId = new Map(summaries.map((item) => [item.id, item]));

  return (
    <Shell>
      <section className="border-b border-line-strong">
        <div className="shell grid gap-10 py-10 md:grid-cols-[1.5fr_1fr] md:py-16">
          <div>
            <p className="eyebrow">دليل مستقل · دورة 2026</p>
            <h1 className="mt-3 font-display text-[34px] font-bold leading-[1.18] tracking-tight text-ink sm:text-[46px]">
              معدلك الموزون،
              <br />
              وأين يقع بين المعدلات المنشورة
            </h1>
            <p className="mt-4 max-w-prose text-[14px] leading-7 text-muted">
              ملف الوزارة لمعدلات القبول 2026 فيه {stats.rows.toLocaleString("fr-FR")} سطرًا. أعدنا تنظيمه
              إلى {stats.programs} تخصصًا داخل {stats.fields} ميدانًا، وربطنا كل تخصص بصيغة الترتيب التي يذكرها المنشور
              الوزاري، حتى تصل إلى ما يخصّ شعبتك دون أن تقرأ الجدول كاملًا.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/hasiba"
                className="rounded-card border border-ink bg-ink px-4 py-2.5 text-[13px] font-semibold text-bg hover:border-brand hover:bg-brand"
              >
                احسب معدلي الموزون
              </Link>
              <Link
                href="/mayadin"
                className="rounded-card border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-ink hover:border-ink"
              >
                ابدأ من الميدان
              </Link>
            </div>
          </div>

          <div className="self-end border border-line bg-surface p-4">
            <ProgramSearch index={searchIndex} />
            <p className="mt-2 text-[10.5px] leading-5 text-muted">
              اكتب حرفين على الأقل. البحث يغطي التخصصات بالعربية والفرنسية.
            </p>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="shell grid grid-cols-2 gap-y-1 py-3 sm:grid-cols-4">
            <Stat value={stats.rows.toLocaleString("fr-FR")} label="سطرًا في الملف الرسمي" />
            <Stat value={stats.programs} label="تخصصًا بعد تجميع الصفوف" />
            <Stat value={stats.institutions} label="مؤسسة جامعية" />
            <Stat value={stats.fields} label="ميدان تكوين" />
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
          <h2 className="font-display text-[24px] font-bold text-ink">ثلاث عائلات، لا قائمة واحدة</h2>
          <Link href="/mayadin" className="shrink-0 text-[12px] font-medium text-brand hover:underline">
            كل الميادين
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {families.map((family) => (
            <div key={family.id} className="flex flex-col border border-line bg-surface">
              <div className="border-b border-line p-4">
                <p className="eyebrow">{family.short}</p>
                <h3 className="mt-1.5 font-display text-[19px] font-bold leading-snug text-ink">{family.ar}</h3>
                <p className="mt-2 text-[11.5px] leading-6 text-muted">{family.lead}</p>
              </div>
              <ul className="flex-1">
                {family.fieldIds.map((id) => {
                  const field = fieldById[id];
                  const summary = byId.get(id);
                  return (
                    <li key={id} className="border-b border-line/60 last:border-0">
                      <Link href={`/mayadin/${id}`} className="group flex items-baseline justify-between gap-3 px-4 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate text-[12.5px] font-semibold text-ink group-hover:text-brand">
                            {field.ar}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-muted">
                            {summary ? `${summary.programs} تخصصًا · ${summary.institutions} مؤسسة` : ""}
                          </span>
                        </span>
                        <span className="num shrink-0 text-[10px] uppercase tracking-wider text-muted/60">{field.letter}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="shell pb-12">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
          <h2 className="font-display text-[24px] font-bold text-ink">التخصصات التي يبحث عنها الجميع</h2>
          <Link href="/takhasus" className="shrink-0 text-[12px] font-medium text-brand hover:underline">
            كل التخصصات
          </Link>
        </div>
        <p className="mt-3 max-w-prose text-[12px] leading-6 text-muted">
          مرتبة حسب عدد المؤسسات التي نشرت لها حدًّا أدنى، وليس حسب شهرة الاسم.
        </p>

        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {popular.map((program, index) => (
            <li key={program.slug} className="border-b border-line/70">
              <Link href={`/takhasus/${program.slug}`} className="group flex items-baseline gap-3 py-3">
                <span className="num w-6 shrink-0 text-[11px] text-muted/60">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-ink group-hover:text-brand">
                    {program.ar}
                  </span>
                  <span className="mt-0.5 block truncate text-[10.5px] text-muted">{program.field.ar} · {program.theme}</span>
                </span>
                <span className="shrink-0 text-left">
                  <span className="num block text-[12px] text-ink">{program.institutions} مؤسسة</span>
                  <span className="num block text-[10.5px] text-muted">
                    {program.low !== null ? `من ${program.low.toFixed(2)}` : "بلا رقم"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          <Callout title="الأعمدة الثلاثة هي أولويات">
            الملف ينشر لكل تخصص ثلاثة أرقام (أ1، أ2، أ3). كل عمود يخص أولوية معينة من أولويات الشعبة في بطاقة التكوين،
            وليس ثلاث سنوات ولا ثلاث جامعات.
          </Callout>
          <Callout title="«NC» و«--» ليستا صفرًا">
            <span className="num">NC</span> تعني أن الفيلير لم تُشبَع فلم يُحسب حد أدنى، و<span className="num">--</span> تعني
            أنه لم يُوجَّه أي حامل بكالوريا في تلك الأولوية. نعرضهما كما هما بدل تحويلهما إلى رقم.
          </Callout>
          <Callout title="لا أحد يضمن القبول">
            المعدل الموزون شرط ترتيب، لا وعد بمقعد. الترتيب النهائي يعتمد على الأولويات والطاقة الاستيعابية والرغبات،
            ويتم على أرضية الوزارة.
          </Callout>
        </div>

        <div className="mt-10 grid gap-6 border-t border-line-strong pt-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">قبل أن تبدأ</p>
            <h2 className="mt-2 font-display text-[22px] font-bold leading-snug text-ink">
              افهم الصيغة أولًا، ثم اقرأ الرقم
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              لكل ميدان صيغة واحدة تقريبًا، لكن التقني رياضي يُستثنى في بعض الميادين، والترجمة تحتاج ثلاث لغات. صفحة
              «كيف يتم التوجيه» تشرح ذلك بالجدول.
            </p>
            <Link
              href="/kayfa"
              className="mt-4 inline-block rounded-card border border-ink px-4 py-2 text-[12.5px] font-semibold text-ink hover:bg-ink hover:text-bg"
            >
              كيف يتم التوجيه؟
            </Link>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {[
              ["علوم الطبيعة والحياة", formulaText.snv.ar],
              ["علوم وتكنولوجيا", formulaText.math_phys.ar],
              ["رياضيات وإعلام آلي", formulaText.math.ar],
              ["اللغات الأجنبية", formulaText.lang.ar],
              ["الترجمة", formulaText.translation.ar],
              ["الإنجليزية، الحقوق، الاقتصاد…", formulaText.general.ar],
            ].map(([label, formula]) => (
              <li key={label} className="bg-bg p-3">
                <p className="text-[11px] font-semibold text-ink">{label}</p>
                <p dir="ltr" className="num mt-1 overflow-x-auto whitespace-nowrap text-[11.5px] text-muted">
                  {formula}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
