import Link from "next/link";
import type { Metadata } from "next";
import { trendStats, trendYears, stats } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "أرقام القبول عبر الدورات 2022–2026",
  description:
    "ملفات المعدلات الدنيا للبكالوريا سنة بسنة: ما أُدخل في المقارنة من 2022 إلى 2026، وعدد الأسطر والمؤسسات، وروابط كل الدورات الأقدم.",
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
  const older = archive
    .filter((item) => !parsed.includes(Number(item.year)))
    .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "الأرقام" }]} />
        </div>

        <PageTitle
          eyebrow="الأرشيف"
          title="أرقام القبول عبر الدورات"
          lead="آخر خمس دورات في المقارنة داخل الموقع، وروابط الملفات الأخرى كما نُشرت، دون تقدير أي رقم."
          aside={
            <div className="flex border border-line bg-surface">
              <div className="border-l border-line px-4 py-3">
                <div className="num font-display text-[22px] font-bold leading-none text-ink">{stats.rows.toLocaleString("fr-FR")}</div>
                <div className="mt-1.5 text-[10.5px] text-muted">سطرًا في 2026</div>
              </div>
              <div className="px-4 py-3">
                <div className="num font-display text-[22px] font-bold leading-none text-ink">{parsed.length}</div>
                <div className="mt-1.5 text-[10.5px] text-muted">دورات مقارنة</div>
              </div>
            </div>
          }
        />

        <div className="grid gap-8 py-8 lg:grid-cols-[1.15fr_1fr]">
          <section>
            <SectionHead
              index="01"
              title="مقارنة داخل الموقع"
              lead="في صفحة كل تخصص يظهر جدول «الحد الأدنى عبر الدورات». المقارنة تشمل الدورات التي تحمل فيها صفوف الملف رمز الفيلير الحرفي (مثل A05TCL01)، وتسمح بربط التخصص نفسه عبر السنوات."
            />

            <div className="mt-4">
              <table className="w-full border-collapse text-right text-[11.5px]">
                <caption className="sr-only">عدد الأسطر والمؤسسات في كل دورة</caption>
                <thead>
                  <tr className="border-b border-line-strong text-[10px] text-muted">
                    <th scope="col" className="py-2 font-semibold">الدورة</th>
                    <th scope="col" className="num py-2 text-center font-semibold">أسطر</th>
                    <th scope="col" className="num py-2 text-center font-semibold">مؤسسات</th>
                    <th scope="col" className="num py-2 text-center font-semibold">برمز حرفي</th>
                    <th scope="col" className="py-2 text-center font-semibold">الملف</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((year) => {
                    const row = trendStats[String(year)];
                    const source = archive.find((item) => item.year === String(year));
                    return (
                      <tr key={year} className="border-b border-line/70">
                        <th scope="row" className="num py-2 text-right font-semibold text-ink">{year}</th>
                        <td className="num py-2 text-center text-muted">{row?.rows ?? "—"}</td>
                        <td className="num py-2 text-center text-muted">{row?.institutions ?? "—"}</td>
                        <td className="num py-2 text-center text-muted">{row?.numericRows ?? "—"}</td>
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

          <section id="qiraa" className="scroll-mt-24">
            <SectionHead index="02" title="القراءة الصحيحة" lead="ثلاث قواعد تكفي لقراءة أي رقم في الموقع." />
            <div className="mt-4 grid gap-px bg-line">
              {[
                [
                  "أ1، أ2، أ3: أولويات لا سنوات",
                  "لكل تخصص ثلاثة أرقام. كل عمود يخص أولوية من أولويات الشعبة في بطاقة التكوين، وليس ثلاث سنوات ولا ثلاث جامعات. قد يظهر عمود فارغ أو «--» لأن أحدًا لم يُوجَّه في تلك الأولوية.",
                ],
                [
                  "«NC» و«--» ليستا صفرًا",
                  "NC تعني أن الفيلير لم تُشبَع فلم يُحسب لها حد أدنى، و«--» تعني أنه لم يُوجَّه أي حامل بكالوريا في تلك الأولوية. نعرضهما كما هما بدل تحويلهما إلى 10.00.",
                ],
                [
                  "لا نقدّر رقمًا ناقصًا",
                  "لم نترجم أي رقم، ولم نقدّر أي حد ناقص، ولم نضف سنة غير منشورة. الملف الذي نقرأه هو الملف النهائي بعد المرحلة الثانية.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="bg-bg p-4">
                  <p className="text-[12px] font-semibold text-ink">{title}</p>
                  <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="border-t border-line-strong py-8">
          <SectionHead
            index="03"
            title="الدورات الأقدم"
            lead="ملفات 2010–2021 تستعمل رمزًا رقميًا للفيلير بدل الحرف، فلا يمكن ربط صفوفها بتخصصات 2026 بثقة. نعرض روابطها الرسمية كما هي، دون تحويلها إلى أرقام."
          />
          <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
            {older.map((item) => (
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

        <div className="border-t border-line-strong py-6">
          <p className="max-w-prose text-[11.5px] leading-6 text-muted">
            ملف 2026 المستعمل هو الملف النهائي بعد المرحلة الثانية. الملفات السابقة نهائية أيضًا. سنة 2027 لم تُنشر بعد،
            وأي رقم يُعرض لها في أي موقع هو تقدير، وليس نشرًا رسميًا. لحساب معدلك بصيغ هذه الملفات{" "}
            <Link href="/hasiba" className="text-brand hover:underline">
              افتح الحاسبة
            </Link>
            .
          </p>
        </div>
      </div>
    </Shell>
  );
}
