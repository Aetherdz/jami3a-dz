import Link from "next/link";
import type { ReactNode } from "react";
import { stats } from "@/lib/majors";
import { TabBar } from "./tabbar";
import { Mark } from "./mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-strong bg-bg/95 backdrop-blur-sm">
      <div aria-hidden className="h-[3px] bg-accent" />
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="جامعة الجزائر — الصفحة الرئيسية">
          <Mark className="h-8 w-8 shrink-0" />
          <span className="leading-none">
            <span className="block font-display text-[19.5px] font-bold text-ink">جامعة</span>
            <span className="mt-0.5 block text-[10px] uppercase leading-none tracking-[0.22em] text-muted">
              Jami3a DZ
            </span>
          </span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-5 text-[14.5px] font-medium text-muted md:flex">
          <Link href="/takhasus" className="hover:text-ink">
            التخصصات
          </Link>
          <Link href="/jamiat" className="hover:text-ink">
            المؤسسات
          </Link>
          <Link href="/hayat" className="hover:text-ink">
            الحياة الجامعية
          </Link>
          <Link href="/mayadin" className="hover:text-ink">
            الميادين
          </Link>
          <Link
            href="/hasiba"
            className="inline-flex h-9 items-center rounded-card border border-ink bg-ink px-4 text-[14px] font-semibold text-bg hover:bg-brand hover:border-brand"
          >
            احسب معدلي
          </Link>
        </nav>

        <Link
          href="/hasiba"
          className="inline-flex h-11 items-center rounded-card border border-ink bg-ink px-4 text-[15px] font-semibold text-bg md:hidden"
        >
          احسب معدلي
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="deep-band mt-14">
      <div className="shell grid gap-9 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Mark tone="light" className="h-7 w-7 shrink-0" />
            <span className="font-display text-[17.5px] font-bold text-cream">جامعة الجزائر</span>
          </div>
          <p className="mt-3 max-w-prose text-[14px] leading-6 text-cream/70">
            دليل مستقل للجامعة الجزائرية: المؤسسات، التخصصات، الميادين، والحياة الجامعية. أسماء المؤسسات وتخصصاتها
            منقولة من المنشورات الرسمية، والوحدات والمعاملات من بطاقة التكوين الخاصة بكل مؤسسة.
          </p>
          <p className="mt-3 text-[13px] text-cream/45">
            هذا الموقع لا يمثل وزارة التعليم العالي ولا أي مؤسسة جامعية.
          </p>
        </div>

        <nav aria-label="أقسام الموقع" className="text-[14.5px] leading-7">
          <p className="eyebrow">الأقسام</p>
          <ul className="mt-2 space-y-0.5 text-cream/70">
            <li>
              <Link href="/jamiat" className="hover:text-cream">
                المؤسسات الجامعية
              </Link>
            </li>
            <li>
              <Link href="/takhasus" className="hover:text-cream">
                التخصصات
              </Link>
            </li>
            <li>
              <Link href="/mayadin" className="hover:text-cream">
                الميادين الخمسة عشر
              </Link>
            </li>
            <li>
              <Link href="/hayat" className="hover:text-cream">
                الحياة الجامعية
              </Link>
            </li>
            <li>
              <Link href="/hasiba" className="hover:text-cream">
                حاسبة المعدل الجامعي
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-[14.5px] leading-7">
          <p className="eyebrow">المصادر</p>
          <ul className="mt-2 space-y-1 text-cream/70">
            <li>
              <a className="link" href="https://www.onou.dz" rel="noreferrer" target="_blank">
                الديوان الوطني للخدمات الجامعية
              </a>
            </li>
            <li>
              <a className="link" href="https://www.mesrs.dz" rel="noreferrer" target="_blank">
                وزارة التعليم العالي والبحث العلمي
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4 text-[13px] text-cream/55">
          <span>دليل الجامعة · قراءة 15 نوفمبر 2026</span>
          <span className="num">
            {stats.institutions} مؤسسة · {stats.programs} تخصصًا · {stats.fields} ميدانًا
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-16 md:pb-0">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <TabBar />
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="مسار التصفح" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <span aria-hidden className="text-line-strong">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function PageTitle({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="border-b border-line-strong pb-6 pt-6 md:pt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-[32px] font-bold leading-[1.25] text-ink sm:text-[40px]">
            {title}
          </h1>
          {lead && <p className="mt-3 max-w-prose text-[16px] leading-7 text-muted">{lead}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="border-r border-line px-4 py-3 first:border-r-0 first:pr-0 last:pl-0">
      <div className="num whitespace-nowrap font-display text-[24px] font-bold leading-none text-ink">{value}</div>
      <div className="mt-1.5 whitespace-nowrap text-[12.5px] leading-tight text-muted">{label}</div>
    </div>
  );
}

/**
 * Section header. The number is the organising device: on a long page the
 * reader can see where they are, and the copper figure breaks the ivory.
 */
export function SectionHead({
  index,
  title,
  lead,
  action,
}: {
  index: string;
  title: string;
  lead?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-b border-line-strong pb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-3">
          <span className="index">{index}</span>
          <h2 className="font-display text-[23px] font-bold text-ink">{title}</h2>
        </div>
        {action ? <span className="shrink-0 text-[14px] font-medium text-brand">{action}</span> : null}
      </div>
      {lead ? <p className="mt-2 max-w-prose text-[14px] leading-6 text-muted">{lead}</p> : null}
    </div>
  );
}
