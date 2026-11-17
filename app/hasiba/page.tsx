import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Breadcrumbs, PageTitle } from "@/components/ui";
import { LmdCalculator } from "@/components/lmd-calculator";

export const metadata: Metadata = {
  title: "حاسبة المعدل الجامعي — السداسي والأرصدة",
  description:
    "اختر تخصصك من 34 تخصصًا فتُعبَّأ وحدات السنة الأولى بأرصدتها ومعاملاتها، ثم أدخل علاماتك لتحصل على معدل السداسي والأرصدة المحصّلة والمعدل السنوي. لا علاقة لها بمعدلات البكالوريا.",
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
          title="حاسبة المعدل الجامعي"
          lead="اختر تخصصك فتُعبَّأ وحدات سنته الأولى بأرصدتها ومعاملاتها، ثم أدخل علاماتك. صحّح أي رقم يختلف عن بطاقة تكوين مؤسستك."
          aside={
            <div className="border border-line bg-surface px-4 py-3 text-[15px] leading-6 text-muted">
              <p className="num text-[17px] font-semibold text-ink">30 رصيدًا</p>
              <p>في السداسي وفق نظام LMD</p>
            </div>
          }
        />

        <div className="py-8">
          <LmdCalculator />
        </div>

        <section className="border-t border-line-strong py-8">
          <h2 className="font-display text-[24px] font-bold text-ink">كيف يُحسب</h2>
          <div className="mt-4 grid gap-px bg-line md:grid-cols-3">
            {[
              [
                "المعدل الفصلي",
                "مجموع (علامة كل وحدة × معاملها) ÷ مجموع المعاملات. الوحدة التي لم تُدخل لها علامة لا تدخل في الحساب.",
              ],
              [
                "الأرصدة والتعويض",
                "الوحدة تُكتسب عند 10.00 أو أكثر. إذا بلغ معدل السداسي 10.00 تُكتسب أرصدة السداسي كلها بالتعويض بين وحداته.",
              ],
              [
                "المعدل السنوي",
                "متوسط معدلي السداسيين. الانتقال إلى السنة الموالية يخضع كذلك لعدد الأرصدة المكتسبة، حسب نظام المؤسسة.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="bg-bg p-5">
                <p className="text-[17px] font-semibold text-ink">{title}</p>
                <p className="mt-2 text-[16px] leading-7 text-muted">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[16px] leading-7 text-muted">
            قوائم الوحدات أعلاه هي الترتيب الشائع للسنة الأولى في البرنامج الوطني؛ سُمِّيت الوحدات كما تُدرَّس، والأرصدة
            مجموعها 30 في السداسي. غير أنّ المعامل يختلف من مؤسسة إلى أخرى — التحليل 1 مثلًا معامل 3 في كلية و4 في
            أخرى — فتأكّد من بطاقة تكوينك قبل الحساب. الحاسبة لا تضيف قاعدة لا تنصّ عليها بطاقتك. أما أرقام القبول
            والتوجيه فتخصّ موقع البكالوريا:{" "}
            <a className="link" href="https://bac27-dz.vercel.app" target="_blank" rel="noreferrer">
              bac27-dz.vercel.app
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
