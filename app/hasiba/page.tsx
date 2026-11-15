import Link from "next/link";
import type { Metadata } from "next";
import { Shell, Breadcrumbs, PageTitle } from "@/components/ui";
import { LmdCalculator } from "@/components/lmd-calculator";

export const metadata: Metadata = {
  title: "حاسبة المعدل الجامعي — السداسي والأرصدة",
  description:
    "احسب معدل السداسي في نظام LMD من علامات وحداتك ومعاملاتها وأرصدتها، مع الأرصدة المحصّلة والمعدل السنوي. لا علاقة لها بمعدلات البكالوريا.",
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
          lead="معدل السداسي هو متوسط علامات وحداتك بمعاملاتها، والأرصدة تُحتسب عند 10.00. أدخل وحدات السداسي كما هي في بطاقة التكوين."
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
            أسماء الوحدات ومعاملاتها وأرصدتها تُحدَّد في بطاقة التكوين لكل مؤسسة، وليست موحّدة بين التخصصات. هذه الحاسبة
            تحسب ما تدخله أنت، ولا تضيف قاعدة لا تنصّ عليها بطاقتك. أما أرقام القبول والتوجيه فتخصّ موقع البكالوريا:{" "}
            <a className="link" href="https://bac-dz-iota.vercel.app" target="_blank" rel="noreferrer">
              bac-dz-iota.vercel.app
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
