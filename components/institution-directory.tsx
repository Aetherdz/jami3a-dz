"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { typeLabel, typeOf, typeOrder } from "@/lib/institution";

export type DirectoryItem = {
  code: string;
  name: string;
  ar: string;
  wilaya: string | null;
  programs: number;
  type: string;
};

export function InstitutionDirectory({ items }: { items: DirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [wilaya, setWilaya] = useState("all");
  const [order, setOrder] = useState("programs");

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    return typeOrder.filter((key) => counts.has(key)).map((key) => ({ key, count: counts.get(key)! }));
  }, [items]);

  const wilayaList = useMemo(
    () => [...new Set(items.map((item) => item.wilaya).filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b, "ar")),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items
      .filter((item) => (type === "all" ? true : item.type === type))
      .filter((item) => (wilaya === "all" ? true : item.wilaya === wilaya))
      .filter((item) => (q ? `${item.name} ${item.ar} ${item.code}`.toLowerCase().includes(q) : true));
    return list.sort((a, b) => {
      if (order === "name") return a.ar.localeCompare(b.ar, "ar");
      if (order === "wilaya") return (a.wilaya ?? "").localeCompare(b.wilaya ?? "", "ar");
      return b.programs - a.programs || a.ar.localeCompare(b.ar, "ar");
    });
  }, [items, query, type, wilaya, order]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="jamiat-search" className="eyebrow">
            ابحث عن مؤسسة
          </label>
          <input
            id="jamiat-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="UNIV. ADRAR، مدرسة، مركز جامعي…"
            className="mt-1.5 h-11 w-full rounded-card border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-muted/70 focus:border-brand"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-32 sm:w-40">
            <label htmlFor="jamiat-order" className="eyebrow">الترتيب</label>
            <select
              id="jamiat-order"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-card border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none focus:border-brand"
            >
              <option value="programs">الأكثر تخصصات</option>
              <option value="name">الاسم</option>
              <option value="wilaya">الولاية</option>
            </select>
          </div>
          <div className="w-32 sm:w-40">
            <label htmlFor="jamiat-wilaya" className="eyebrow">الولاية</label>
            <select
              id="jamiat-wilaya"
              value={wilaya}
              onChange={(event) => setWilaya(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-card border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none focus:border-brand"
            >
              <option value="all">كل الولايات</option>
              {wilayaList.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <p className="num pb-2.5 text-[13px] text-muted">{filtered.length} مؤسسة</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-3">
        <button
          type="button"
          onClick={() => setType("all")}
          aria-pressed={type === "all"}
          className={`inline-flex h-11 items-center rounded-card border px-4 text-[13.5px] sm:h-9 sm:px-3 ${
            type === "all" ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink hover:text-ink"
          }`}
        >
          الكل <span className="num mr-1 text-[12px] opacity-70">{items.length}</span>
        </button>
        {types.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setType(entry.key)}
            aria-pressed={type === entry.key}
            className={`inline-flex h-11 items-center rounded-card border px-4 text-[13.5px] sm:h-9 sm:px-3 ${
              type === entry.key ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {typeLabel[entry.key] ?? entry.key} <span className="num mr-1 text-[12px] opacity-70">{entry.count}</span>
          </button>
        ))}
      </div>

      <ul className="grid gap-x-8 sm:grid-cols-2">
        {filtered.map((item) => (
          <li key={item.code} className="border-b border-line/70">
            <Link href={`/jamiat/${item.code}`} className="group flex items-baseline justify-between gap-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-semibold text-ink group-hover:text-brand">{item.ar}</span>
                <span className="mt-0.5 block truncate text-[12px] uppercase tracking-wide text-muted/80">{item.name}</span>
                <span className="mt-0.5 block text-[12.5px] text-muted">
                  {typeLabel[item.type] ?? "مؤسسة"}
                  {item.wilaya && ` · ${item.wilaya}`}
                  {" · "}
                  <span className="num">{item.code}</span>
                </span>
              </span>
              <span className="num shrink-0 text-[13px] text-muted">{item.programs} تخصصًا</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p className="py-10 text-center text-[15px] text-muted">لا توجد مؤسسة مطابقة.</p>}
    </div>
  );
}
