"use client";

import { useMemo, useState } from "react";
import { numeric } from "@/lib/calc";

export type InstitutionRow = {
  code: string;
  name: string;
  /** Published priority columns, as printed. */
  v: string[];
  ar?: string;
  wilaya?: string | null;
  wilayaCode?: string | null;
};

type Sort = "low" | "high" | "name";

export function InstitutionTable({ rows, wilayas }: { rows: InstitutionRow[]; wilayas: string[] }) {
  const [query, setQuery] = useState("");
  const [wilaya, setWilaya] = useState("all");
  const [sort, setSort] = useState<Sort>("low");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (wilaya !== "all" && row.wilaya !== wilaya) return false;
      if (!q) return true;
      return `${row.name} ${row.ar ?? ""} ${row.code}`.toLowerCase().includes(q);
    });
    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "fr");
      const av = a.v.map(numeric).filter((n): n is number => n !== null);
      const bv = b.v.map(numeric).filter((n): n is number => n !== null);
      const al = av.length ? Math.min(...av) : null;
      const bl = bv.length ? Math.min(...bv) : null;
      if (al === null && bl === null) return a.name.localeCompare(b.name, "fr");
      if (al === null) return 1;
      if (bl === null) return -1;
      return sort === "low" ? al - bl : bl - al;
    });
  }, [rows, query, sort, wilaya]);

  const withNumbers = filtered.filter((row) => row.v.some((value) => numeric(value) !== null)).length;

  return (
    <div>
      <div className="flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="inst-search" className="eyebrow">
            ابحث في المؤسسات
          </label>
          <input
            id="inst-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جامعة، مركز جامعي، مدرسة…"
            className="mt-1.5 h-10 w-full rounded-card border border-line-strong bg-surface px-3 text-[13px] text-ink outline-none placeholder:text-muted/70 focus:border-brand"
            autoComplete="off"
          />
        </div>

        {wilayas.length > 1 && (
          <div className="sm:w-44">
            <label htmlFor="inst-wilaya" className="eyebrow">
              الولاية
            </label>
            <select
              id="inst-wilaya"
              value={wilaya}
              onChange={(event) => setWilaya(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-card border border-line-strong bg-surface px-2 text-[13px] text-ink outline-none focus:border-brand"
            >
              <option value="all">كل الولايات</option>
              {wilayas.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:w-44">
          <label htmlFor="inst-sort" className="eyebrow">
            الترتيب
          </label>
          <select
            id="inst-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="mt-1.5 h-10 w-full rounded-card border border-line-strong bg-surface px-2 text-[13px] text-ink outline-none focus:border-brand"
          >
            <option value="low">الأدنى أولاً</option>
            <option value="high">الأعلى أولاً</option>
            <option value="name">اسم المؤسسة</option>
          </select>
        </div>
      </div>

      <p className="num py-2 text-[11px] text-muted">
        {filtered.length} مؤسسة · {withNumbers} منها برقم منشور
      </p>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-muted">لا توجد مؤسسة مطابقة. جرّب اسمًا آخر.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <caption className="sr-only">الحدود الدنيا المنشورة لكل مؤسسة، حسب الأولويات أ1 وأ2 وأ3</caption>
            <thead>
              <tr className="border-y border-line-strong text-[10.5px] uppercase tracking-wider text-muted">
                <th scope="col" className="py-2 pl-2 font-semibold">
                  المؤسسة
                </th>
                <th scope="col" className="num w-16 py-2 text-center font-semibold">
                  أ1
                </th>
                <th scope="col" className="num w-16 py-2 text-center font-semibold">
                  أ2
                </th>
                <th scope="col" className="num w-16 py-2 text-center font-semibold">
                  أ3
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={`${row.code}-${row.name}`} className="border-b border-line/70">
                  <th scope="row" className="py-2.5 pl-2 text-right font-normal">
                    <span className="block text-[12.5px] font-semibold text-ink">{row.ar || row.name}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted">
                      <span className="num rounded-card border border-line px-1">{row.code}</span>
                      {row.wilaya && <span>{row.wilaya}</span>}
                      <span className="truncate uppercase tracking-wide text-muted/70">{row.name}</span>
                    </span>
                  </th>
                  {[0, 1, 2].map((index) => {
                    const value = row.v[index];
                    const number = numeric(value);
                    return (
                      <td key={index} className="py-2.5 text-center">
                        {number !== null ? (
                          <span className="num text-[13px] font-semibold text-ink">{number.toFixed(2)}</span>
                        ) : value ? (
                          <span className="text-[11px] text-muted/70" title={value === "NC" ? "فيلير غير مشبعة: لم يُحسب حد أدنى" : "لم يُوجَّه أي حامل بكالوريا في هذه الأولوية"}>
                            {value}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted/40">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
