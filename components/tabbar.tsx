"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "الرئيسية", icon: "◱" },
  { href: "/jamiat", label: "مؤسسات", icon: "⌂" },
  { href: "/takhasus", label: "تخصصات", icon: "◲" },
  { href: "/hayat", label: "الحياة", icon: "✦" },
  { href: "/hasiba", label: "الحاسبة", icon: "∑" },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="التنقل السريع"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-bg md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[13px] ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                <span aria-hidden className={`text-[17px] leading-none ${active ? "text-brand" : ""}`}>
                  {tab.icon}
                </span>
                <span className={active ? "font-semibold" : ""}>{tab.label}</span>
                <span aria-hidden className={`h-0.5 w-6 rounded-full ${active ? "bg-brand" : "bg-transparent"}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
