"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCalculator, IconHome, IconInstitutions, IconLife, IconProgrammes } from "./nav-icons";

type Tab = { href: string; label: string; Icon: typeof IconHome };

/**
 * The calculator is the one action a visitor comes back to, so it sits in the
 * middle of the bar with a filled tile and its own label. The four text tabs
 * keep a hairline rule for the current page.
 */
const tabs: Tab[] = [
  { href: "/", label: "الرئيسية", Icon: IconHome },
  { href: "/jamiat", label: "مؤسسات", Icon: IconInstitutions },
  { href: "/hasiba", label: "الحاسبة", Icon: IconCalculator },
  { href: "/takhasus", label: "تخصصات", Icon: IconProgrammes },
  { href: "/hayat", label: "الحياة", Icon: IconLife },
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
          const center = tab.href === "/hasiba";

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1.5 ${
                  active ? "text-ink" : "text-muted"
                }`}
              >
                {active && <span aria-hidden className="absolute inset-x-0 top-0 mx-auto h-[2px] w-9 bg-brand" />}
                {center ? (
                  <span
                    className={`grid h-8 w-11 place-items-center rounded-card border text-brand-ink ${
                      active ? "border-brand bg-brand" : "border-ink bg-ink"
                    }`}
                  >
                    <tab.Icon className="h-[21px] w-[21px]" />
                  </span>
                ) : (
                  <tab.Icon className="h-[22px] w-[22px]" />
                )}
                <span className={`text-[12px] leading-none ${active ? "font-semibold" : ""}`}>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
