import Link from "next/link";
import { Shell } from "@/components/ui";

export default function NotFound() {
  return (
    <Shell>
      <div className="shell py-20">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-[32px] font-bold text-ink">هذه الصفحة غير موجودة</h1>
        <p className="mt-3 max-w-prose text-[13px] leading-7 text-muted">
          قد يكون رابط التخصص قديمًا، أو أن الاسم الفرنسي للملف لا يطابق أي صف منشور. جرّب البحث أو العودة إلى الميادين.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/mayadin"
            className="rounded-card border border-ink bg-ink px-4 py-2 text-[12.5px] font-semibold text-bg hover:border-brand hover:bg-brand"
          >
            الميادين
          </Link>
          <Link href="/takhasus" className="rounded-card border border-line-strong px-4 py-2 text-[12.5px] font-semibold text-ink hover:border-ink">
            كل التخصصات
          </Link>
          <Link href="/hasiba" className="rounded-card border border-line-strong px-4 py-2 text-[12.5px] font-semibold text-ink hover:border-ink">
            الحاسبة
          </Link>
        </div>
      </div>
    </Shell>
  );
}
