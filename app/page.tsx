import Link from "next/link";
import type { Metadata } from "next";
import { fieldSummaries, searchIndex, stats } from "@/lib/majors";
import { families } from "@/lib/families";
import { fieldById } from "@/lib/fields";
import { Shell, SectionHead } from "@/components/ui";
import { ProgramSearch } from "@/components/search";

export const metadata: Metadata = {
  title: "جامعة الجزائر — المؤسسات، التخصصات، والحياة الجامعية",
  description:
    "دليل الجامعة الجزائرية: 248 مؤسسة، 261 تخصصًا في 15 ميدانًا، ودليل للحياة الجامعية، مع أرقام القبول المنشورة لدورة 2026 وحاسبة المعدل الموزون.",
  alternates: { canonical: "/" },
};

const gates = [
  {
    href: "/jamiat",
    num: "01",
    title: "المؤسسات",
    meta: `${stats.institutions} مؤسسة`,
    text: "جامعات، مراكز جامعية، مدارس عليا ومدارس أساتذة. افتح مؤسستك واقرأ التخصصات والأرقام التي نشرتها.",
    cta: "اعرف مؤسستك",
  },
  {
    href: "/takhasus",
    num: "02",
    title: "التخصصات",
    meta: `${stats.programs} تخصصًا`,
    text: "من الطب إلى الفلسفة، في 15 ميدانًا. لكل تخصص صيغة ترتيبه وعدد المؤسسات التي نشرت له حدًّا.",
    cta: "ابحث عن تخصص",
  },
  {
    href: "/hayat",
    num: "03",
    title: "الحياة الجامعية",
    meta: "بعد الباب",
    text: "السكن، المطعم، النقل، نظام الدراسة، والسنة الأولى: ما لا يظهر في جدول المعدلات.",
    cta: "ادخل الحياة",
  },
];

const lifeItems = [
  {
    href: "/hayat#sakan",
    title: "السكن والمطعم والنقل",
    text: "الإقامة الجامعية والمطعم والنقل يؤطّرها الديوان الوطني للخدمات الجامعية، وتختلف التفاصيل من ولاية إلى أخرى.",
  },
  {
    href: "/hayat#lmd",
    title: "الدراسة بنظام LMD",
    text: "ليسانس ثلاث سنوات، ماستر سنتان، ودكتوراه بعدها: سداسيات ووحدات وأرصدة، لا سنة واحدة ولا امتحان واحد.",
  },
  {
    href: "/hayat#dour",
    title: "السنة الأولى",
    text: "التسجيل البيداغوجي، البطاقة الجامعية، الأعمال الموجهة، وأول دورة امتحانات: خطوات تبدأ قبل أن تبدأ الدراسة.",
  },
  {
    href: "/hayat#harem",
    title: "الحرم والجمعيات",
    text: "المكتبة، النوادي العلمية، النشاط الرياضي والثقافي: الجزء الذي تصنعه أنت داخل الجامعة.",
  },
];

export default function HomePage() {
  const summaries = fieldSummaries();
  const byId = new Map(summaries.map((item) => [item.id, item]));

  return (
    <Shell>
      {/* ------------------------------- hero ------------------------------- */}
      <section className="deep-band">
        <div className="shell grid gap-8 py-10 md:grid-cols-[1.55fr_1fr] md:py-14">
          <div>
            <p className="eyebrow">جامعة الجزائر · دورة 2026</p>
            <h1 className="mt-3 font-display text-[34px] font-bold leading-[1.16] tracking-tight text-cream sm:text-[50px]">
              دليل الجامعة الجزائرية
            </h1>
            <p className="mt-4 max-w-prose text-[13.5px] leading-7 text-cream/70">
              المؤسسات وما نشرته من تخصصات وأرقام، التخصصات وصيغ ترتيبها، والحياة الجامعية بعد القبول.{" "}
              {stats.institutions} مؤسسة و{stats.programs} تخصصًا في {stats.fields} ميدانًا، لدورة 2026.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/jamiat"
                className="rounded-card bg-cream px-4 py-2.5 text-[13px] font-semibold text-deep hover:bg-accent-soft"
              >
                اعرف مؤسستك
              </Link>
              <Link
                href="/hayat"
                className="rounded-card border border-cream/40 px-4 py-2.5 text-[13px] font-semibold text-cream hover:border-cream"
              >
                الحياة الجامعية
              </Link>
            </div>
          </div>

          <div className="self-end">
            <ProgramSearch index={searchIndex} tone="dark" />
            <p className="mt-2 text-[10.5px] leading-5 text-cream/50">
              اكتب حرفين على الأقل. البحث يغطي التخصصات بالعربية والفرنسية.
            </p>
          </div>
        </div>

        <div className="border-t border-cream/15">
          <div className="shell grid grid-cols-2 gap-y-4 py-5 sm:grid-cols-4">
            {[
              [stats.institutions, "مؤسسة جامعية"],
              [stats.programs, "تخصصًا"],
              [stats.fields, "ميدان تكوين"],
              [stats.rows.toLocaleString("fr-FR"), "سطرًا في الملف الرسمي"],
            ].map(([value, label]) => (
              <div key={String(label)}>
                <div className="num font-display text-[26px] font-bold leading-none text-cream">{value}</div>
                <div className="mt-1.5 text-[10.5px] leading-tight text-cream/55">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- gates ------------------------------ */}
      <section className="shell py-9">
        <SectionHead index="01" title="أقسام الموقع" lead="المؤسسة، التخصص، والحياة الجامعية: ابدأ من القسم الذي يخصّك." />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {gates.map((gate) => (
            <Link
              key={gate.href}
              href={gate.href}
              className="group flex flex-col border border-line bg-surface p-5 transition-colors hover:border-ink"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="index">{gate.num}</span>
                <span className="num text-[10px] text-muted/70">{gate.meta}</span>
              </div>
              <h3 className="mt-2 font-display text-[20px] font-bold text-ink group-hover:text-brand">{gate.title}</h3>
              <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{gate.text}</p>
              <span className="mt-auto pt-3 text-[11.5px] font-semibold text-brand">
                {gate.cta} <span aria-hidden>←</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------- life ------------------------------- */}
      <section className="shell pb-9">
        <SectionHead
          index="02"
          title="الحياة الجامعية"
          lead="السكن والدراسة والسنة الأولى والعلاقات داخل الحرم الجامعي."
          action={
            <Link href="/hayat" className="hover:underline">
              الدليل الكامل
            </Link>
          }
        />
        <div className="mt-4 grid gap-px bg-line sm:grid-cols-2">
          {lifeItems.map((item) => (
            <Link key={item.href} href={item.href} className="group bg-bg p-4 hover:bg-surface">
              <h3 className="text-[13px] font-semibold text-ink group-hover:text-brand">{item.title}</h3>
              <p className="mt-1 text-[11.5px] leading-6 text-muted">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------ families ---------------------------- */}
      <section className="shell pb-9">
        <SectionHead
          index="03"
          title="الميادين الخمسة عشر"
          lead="ثلاث عائلات: العلوم والتكنولوجيا والصحة، اللغات والآداب، والعلوم الإنسانية والاجتماعية والاقتصادية."
          action={
            <Link href="/mayadin" className="hover:underline">
              كل الميادين
            </Link>
          }
        />

        <div className="mt-4 grid gap-px border border-line bg-line md:grid-cols-2">
          {families.map((family) => (
            <div
              key={family.id}
              className={`bg-surface ${family.fieldIds.length > 6 ? "md:col-start-1 md:row-span-2" : ""}`}
            >
              <div className="border-b border-line p-4">
                <p className="eyebrow">{family.short}</p>
                <h3 className="mt-1.5 font-display text-[18px] font-bold leading-snug text-ink">{family.ar}</h3>
                <p className="mt-1.5 text-[11px] leading-5 text-muted">{family.lead}</p>
              </div>
              <ul>
                {family.fieldIds.map((id) => {
                  const field = fieldById[id];
                  const summary = byId.get(id);
                  return (
                    <li key={id} className="border-b border-line/60 last:border-0">
                      <Link href={`/mayadin/${id}`} className="group flex items-baseline justify-between gap-3 px-4 py-2">
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-semibold text-ink group-hover:text-brand">
                            {field.ar}
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] text-muted">
                            {summary ? `${summary.programs} تخصصًا · ${summary.institutions} مؤسسة` : ""}
                          </span>
                        </span>
                        <span className="num shrink-0 text-[10px] text-muted/60">{field.letter}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------- numbers ---------------------------- */}
      <section className="shell pb-9">
        <SectionHead
          index="04"
          title="أرقام القبول المنشورة"
          lead="ملف دورة 2026 كما نُشر: نعرض الأرقام، ونشرح ما تعنيه وما لا تعنيه."
          action={
            <Link href="/sanawat" className="hover:underline">
              الأرقام عبر الدورات
            </Link>
          }
        />
        <div className="mt-4 grid gap-px bg-line md:grid-cols-3">
          {[
            [
              "الأعمدة الثلاثة أولويات",
              "لكل تخصص ثلاثة أرقام (أ1، أ2، أ3)؛ كل عمود يخصّ أولوية في بطاقة التكوين، وليس ثلاث سنوات ولا ثلاث جامعات.",
            ],
            [
              "«NC» و«--» ليستا صفرًا",
              "NC تعني أن الفيلير لم تُشبَع فلم يُحسب حد أدنى، و-- تعني أن أحدًا لم يُوجَّه في تلك الأولوية. نعرضهما كما هما.",
            ],
            [
              "لا أحد يضمن مقعدًا",
              "المعدل الموزون شرط ترتيب لا وعد بقبول. الترتيب النهائي يعتمد على الأولويات والطاقة الاستيعابية والرغبات.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="bg-bg p-4">
              <p className="text-[12px] font-semibold text-ink">{title}</p>
              <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------- calculator --------------------------- */}
      <section className="shell pb-10">
        <div className="flex flex-col gap-4 border border-brand bg-brand p-6 text-cream md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10.5px] font-semibold text-accent-soft">الحاسبة</p>
            <h2 className="mt-1 font-display text-[22px] font-bold leading-snug text-cream">
              اعرف معدلك الموزون قبل أن تختار
            </h2>
            <p className="mt-1.5 max-w-prose text-[11.5px] leading-6 text-cream/70">
              أدخل شعبتك وعلاماتك، ونحسب معدلك في كل ميدان، ثم نقارنه بأدنى رقم منشور للتخصص.
            </p>
          </div>
          <Link
            href="/hasiba"
            className="shrink-0 rounded-card bg-cream px-4 py-2.5 text-[13px] font-semibold text-deep hover:bg-accent-soft"
          >
            افتح الحاسبة
          </Link>
        </div>
      </section>
    </Shell>
  );
}
