import Link from "next/link";
import type { Metadata } from "next";
import { trendStats, trendYears } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "المعدلات الدنيا عبر الدورات 2010–2026",
  description:
    "ملفات المعدلات الدنيا للبكالوريا في الجزائر سنة بسنة، مع ما أُدخل في المقارنة: 2022 إلى 2026، ومصدر كل ملف، وعدد الأسطر والمؤسسات.",
  alternates: { canonical: "/sanawat" },
};

const archive: { year: string; url: string }[] = [
  { year: "2010", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/06/2010_Moyennes-minimales.pdf" },
  { year: "2011", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-minimales-dacces-aux-Filieres-Bac2011.pdf" },
  { year: "2012", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/06/2012_Moyennes-minimales.pdf" },
  { year: "2013", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-minimales-dacces-aux-Filieres-Bac2013.pdf" },
  { year: "2014", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-Minimales-2014.pdf" },
  { year: "2015", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-minimales-dacces-aux-Filieres-Bac2015.pdf" },
  { year: "2016", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-Minimales-Bac-2016.pdf" },
  { year: "2017", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-Minimales-Bac-2017.pdf" },
  { year: "2018", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-minimales-Bac-2018-version-finale.pdf" },
  { year: "2019", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-minimales-2019-apres-affectations-definitives.pdf" },
  { year: "2020", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/07/Moyennes-Minimales-2020-final.pdf" },
  { year: "2021", url: "https://www.ummto.dz/vrp/wp-content/uploads/2021/06/Moyenne-Minimale-BAC-2021-Final.pdf" },
  { year: "2022", url: "https://www.ummto.dz/vrp/wp-content/uploads/2022_Moyennes-Minimales.pdf" },
  { year: "2023", url: "https://www.ummto.dz/vrp/wp-content/uploads/Moyennes-minimales-BAC2023.pdf" },
  { year: "2024", url: "https://www.ummto.dz/vrp/wp-content/uploads/moy_min_bac2024.pdf" },
  { year: "2025", url: "https://www.ummto.dz/vrp/wp-content/uploads/Moyennes-minimales-BAC-2025.pdf" },
  { year: "2026", url: "https://www.esi.dz/wp-content/uploads/2026/08/BAC-2026-Moyennes-minimales-2026.pdf" },
];

export default function YearsPage() {
  const parsed = [...trendYears].sort((a, b) => b - a);

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "السنوات" }]} />
        </div>

        <PageTitle
          eyebrow="الأرشيف"
          title="المعدلات الدنيا، دورة بدورة"
          lead="الملف الرسمي يُنشر كل صيف. أدرجنا في المقارنة آخر خمس دورات، وأبقينا روابط كل الدورات الأخرى بدل إخفائها أو تقدير أرقامها."
        />

        <div className="grid gap-8 py-8 md:grid-cols-[1.2fr_1fr]">
          <section>
            <h2 className="border-b border-line-strong pb-2 font-display text-[21px] font-bold text-ink">
              مقارنة داخل الموقع
            </h2>
            <p className="mt-2 text-[11.5px] leading-6 text-muted">
              في صفحة كل تخصص يظهر جدول «الحد الأدنى عبر الدورات». المقارنة تشمل الدورات التي تحمل فيها صفوف الملف رمز
              الفيلير الحرفي (مثل <span className="num">A05TCL01</span>)، وتسمح بربط التخصص نفسه عبر السنوات.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-right text-[11.5px]">
                <thead>
                  <tr className="border-b border-line-strong text-[10px] uppercase tracking-wider text-muted">
                    <th scope="col" className="py-2 font-semibold">الدورة</th>
                    <th scope="col" className="num py-2 text-center font-semibold">أسطر</th>
                    <th scope="col" className="num py-2 text-center font-semibold">مؤسسات</th>
                    <th scope="col" className="num py-2 text-center font-semibold">برقم عددي</th>
                    <th scope="col" className="py-2 text-center font-semibold">الملف</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((year) => {
                    const stats = trendStats[String(year)];
                    const source = archive.find((item) => item.year === String(year));
                    return (
                      <tr key={year} className="border-b border-line/70">
                        <th scope="row" className="num py-2 text-right font-semibold text-ink">{year}</th>
                        <td className="num py-2 text-center text-muted">{stats?.rows ?? "—"}</td>
                        <td className="num py-2 text-center text-muted">{stats?.institutions ?? "—"}</td>
                        <td className="num py-2 text-center text-muted">{stats?.numericRows ?? "—"}</td>
                        <td className="py-2 text-center">
                          {source ? (
                            <a className="link text-[11px]" href={source.url} target="_blank" rel="noreferrer">
                              PDF
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              عدد الأسطر والمؤسسات يتغير من دورة إلى أخرى: ملف 2022 يحمل 131 مؤسسة، وملف 2026 يحمل 248. لذلك مقارنة
              الأرقام بين السنوات تخص التخصص، لا تغطية الملف.
            </p>
          </section>

          <section>
            <h2 className="border-b border-line-strong pb-2 font-display text-[21px] font-bold text-ink">
              الدورات الأقدم
            </h2>
            <p className="mt-2 text-[11.5px] leading-6 text-muted">
              هذه الملفات تستعمل رمزًا رقميًا للفيلير بدل الحرف، فلا يمكن ربط صفوفها بتخصصات 2026 بثقة. نعرض روابطها
              الرسمية كما هي، دون تحويلها إلى أرقام.
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">
              {archive
                .filter((item) => !parsed.includes(Number(item.year)))
                .sort((a, b) => Number(b.year) - Number(a.year))
                .map((item) => (
                  <li key={item.year} className="border-b border-line/70">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-baseline justify-between gap-2 py-2 text-[11.5px] hover:text-brand"
                    >
                      <span className="num font-semibold text-ink">{item.year}</span>
                      <span className="link text-muted">PDF</span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-line-strong py-6">
          <p className="max-w-prose text-[11.5px] leading-6 text-muted">
            ملف 2026 المستعمل هو الملف النهائي بعد المرحلة الثانية. الملفات السابقة نهائية أيضًا. سنة 2027 لم تُنشر بعد،
            وأي رقم يُعرض لها في أي موقع هو تقدير، وليس نشرًا رسميًا. لمعرفة طريقة الحساب،{" "}
            <Link href="/kayfa" className="text-brand hover:underline">
              اقرأ صفحة الشرح
            </Link>
            .
          </p>
        </div>
      </div>
    </Shell>
  );
}
