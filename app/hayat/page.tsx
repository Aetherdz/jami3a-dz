import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Breadcrumbs, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "الحياة الجامعية — السكن، الدراسة، والسنة الأولى",
  description:
    "دليل عملي للحياة في الجامعة الجزائرية: التسجيل، الإقامة الجامعية والمطعم والنقل، نظام LMD، السنة الأولى، الحرم الجامعي، ونصائح للطلبة الجدد.",
  alternates: { canonical: "/hayat" },
};

const chapters = [
  {
    id: "tasjil",
    num: "01",
    title: "قبل الدراسة: التسجيل",
    body: [
      "بعد صدور النتيجة، يتم التسجيل البيداغوجي في الكلية أو المعهد الذي قُبلت فيه. الملف الورقي يختلف من مؤسسة إلى أخرى، لذلك اقرأ إعلان كليتك بدل الاعتماد على قائمة سمعتها من صديق.",
      "البطاقة الجامعية تفتح لك المكتبة، المطعم، والنقل الجامعي، وتحمل رقمك الجامعي الذي ستحتاجه في كل إجراء. احتفظ بنسخة رقمية من شهادة البكالوريا وبطاقة التعريف.",
    ],
  },
  {
    id: "sakan",
    num: "02",
    title: "السكن والمطعم والنقل",
    body: [
      "الإقامة الجامعية والمطعم والنقل الجامعي يسيّرها الديوان الوطني للخدمات الجامعية. الشروط والأسعار والمسافات تختلف من ولاية إلى أخرى، وتُعلن في وقت التسجيل لا قبله.",
      "من لا يحصل على إقامة يبقى أمامه السكن الخاص أو التنقل اليومي؛ الأول أسرع في التكيّف، والثاني أرخص لكنه يستهلك وقتًا. احسب المسافة اليومية قبل أن تقرر.",
    ],
  },
  {
    id: "lmd",
    num: "03",
    title: "الدراسة بنظام LMD",
    body: [
      "الليسانس ثلاث سنوات (ستة سداسيات)، والماستر سنتان (أربعة سداسيات)، ثم الدكتوراه. كل سداسي مقسّم إلى وحدات: أساسية، منهجية، استكشافية، وأفقية.",
      "الوحدات تُقاس بأرصدة (ECTS). الانتقال إلى السنة الموالية لا يعتمد على النجاح في كل مادة، بل على مجموع الأرصدة المحصّلة — لذلك مادة ضعيفة واحدة لا تعني نهاية المسار.",
    ],
  },
  {
    id: "dour",
    num: "04",
    title: "السنة الأولى",
    body: [
      "الحضور في المحاضرات والأعمال الموجهة ليس تفصيلًا: الغياب المتكرر قد يحرمك من دخول الامتحان. دوّن المواعيد من أول أسبوع، ولا تنتظر إعلان الامتحانات.",
      "الامتحانات تُنظَّم في دورة عادية ثم دورة استدراكية. المعدل السنوي يجمع السداسيين، والرصيد غير المحصّل يُعاد في السنة الموالية أو عبر وحدات استدراكية حسب نظام المؤسسة.",
    ],
  },
  {
    id: "harem",
    num: "05",
    title: "الحرم والجمعيات",
    body: [
      "المكتبة الجامعية ليست مكانًا للهدوء فقط: فيها مراجع وكتب لا تجدها في السوق. ابدأ بمعرفة أوقات العمل وطريقة الإعارة في الأسبوع الأول.",
      "النوادي العلمية والثقافية والرياضية تصنع الفرق في السيرة والعلاقات. جرّب واحدة في السداسي الأول، ثم قرّر ما تستطيع الاستمرار فيه دون أن تسحب وقت الدراسة.",
    ],
  },
  {
    id: "nasiya",
    num: "06",
    title: "نصائح عملية",
    body: [
      "قسّم الأسبوع لا اليوم: ساعتان يوميًا أفضل من ليلة كاملة قبل الامتحان. اكتب ما فهمته بيدك، فالكتابة تكشف الفجوة قبل أن يكشفها الامتحان.",
      "اللغة الفرنسية أو الإنجليزية تفتح المراجع؛ ابدأ بقراءة صفحة واحدة يوميًا في تخصصك. الزملاء مصدر نجاة: مجموعة صغيرة تتبادل الملخصات والأسئلة أفضل من الدراسة وحدك.",
    ],
  },
];

export default function LifePage() {
  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "الحياة الجامعية" }]} />
        </div>
      </div>

      <section className="deep-band mt-4">
        <div className="shell grid gap-6 py-9 md:grid-cols-[1.5fr_1fr] md:py-12">
          <div>
            <p className="eyebrow">الحياة الجامعية</p>
            <h1 className="mt-3 font-display text-[31px] font-bold leading-[1.2] tracking-tight text-cream sm:text-[42px]">
              الحياة الجامعية:
              <br />
              من التسجيل إلى السنة الأولى
            </h1>
            <p className="mt-4 max-w-prose text-[13px] leading-7 text-cream/70">
              السكن والمطعم والنقل، نظام الدراسة، السنة الأولى، والحرم الجامعي. دليل عملي لما ينتظرك بعد القبول،
              مكتوب ليُقرأ في عشر دقائق ويُستعمل في أربع سنوات.
            </p>
          </div>
          <aside className="self-end border border-cream/20 p-4">
            <p className="text-[10.5px] font-semibold text-accent-soft">ملاحظة</p>
            <p className="mt-1.5 text-[12px] leading-6 text-cream/75">
              كل مؤسسة تنشر تفاصيلها بنفسها. حين يختلف ما تقرأه هنا عن إعلان كليتك، إعلان كليتك هو الصحيح.
            </p>
          </aside>
        </div>
      </section>

      <div className="shell py-8">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="scroll-mt-24">
              <SectionHead index={chapter.num} title={chapter.title} />
              <div className="mt-3 space-y-2.5">
                {chapter.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[12px] leading-7 text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-t border-line-strong pt-6 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">التالي</p>
            <h2 className="mt-2 font-display text-[21px] font-bold leading-snug text-ink">
              المؤسسة، ثم التخصص، ثم المعدل
            </h2>
            <p className="mt-2 text-[12px] leading-6 text-muted">
              الحياة الجامعية تبدأ باختيار واعٍ: مؤسسة تعرفها، وتخصص تفهم صيغته، ومعدل تحسبه بنفسك قبل أن تنتظر نتيجة.
            </p>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-3">
            {[
              { href: "/jamiat", title: "المؤسسات", text: "افتح مؤسستك" },
              { href: "/takhasus", title: "التخصصات", text: "ابحث عن تخصصك" },
              { href: "/hasiba", title: "الحاسبة", text: "احسب معدلك" },
            ].map((item) => (
              <li key={item.href} className="bg-bg">
                <Link href={item.href} className="group block p-4 hover:bg-surface">
                  <span className="block text-[13px] font-semibold text-ink group-hover:text-brand">{item.title}</span>
                  <span className="mt-1 block text-[10.5px] text-muted">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
