import type { Metadata } from "next";
import { institutions, stats } from "@/lib/majors";
import { Shell, Breadcrumbs, PageTitle, Stat } from "@/components/ui";
import { InstitutionDirectory, type DirectoryItem } from "@/components/institution-directory";

export const metadata: Metadata = {
  title: `المؤسسات الجامعية — ${stats.institutions} مؤسسة ومعدلاتها`,
  description:
    `فهرس المؤسسات الجامعية الجزائرية التي نشرت معدلات قبول 2026: جامعات، مراكز جامعية، مدارس عليا ومدارس أساتذة، بعدد التخصصات لكل مؤسسة.`,
  alternates: { canonical: "/jamiat" },
};

export default function InstitutionsPage() {
  const items: DirectoryItem[] = institutions.map((institution) => ({
    code: institution.code,
    name: institution.name,
    ar: institution.ar,
    wilaya: institution.wilaya,
    programs: institution.programs,
    type: institution.type,
  }));

  return (
    <Shell>
      <div className="shell">
        <div className="pt-5">
          <Breadcrumbs items={[{ href: "/", label: "الرئيسية" }, { label: "المؤسسات" }]} />
        </div>

        <PageTitle
          eyebrow="الفهرس"
          title="المؤسسات وتخصصاتها المنشورة"
          lead={`لكل مؤسسة في ملف 2026 صفحتها: التخصصات التي نشرت لها حدًّا أدنى، وأرقام الأولويات الثلاثة. ابحث بالاسم، أو صفِّ حسب الولاية والنوع.`}
          aside={
            <div className="flex border border-line bg-surface">
              <Stat value={stats.institutions} label="مؤسسة" />
              <Stat value={stats.programs} label="تخصصًا" />
            </div>
          }
        />

        <div className="py-5">
          <InstitutionDirectory items={items} />
        </div>

        <p className="border-t border-line-strong py-5 text-[11.5px] leading-6 text-muted">
          الأسماء العربية والولايات أُضيفت للقراءة فقط: الملف الرسمي ينشر الأسماء بالفرنسية. المؤسسات التي لا يذكر اسمها
          مدينة تُركت بلا ولاية بدل تخمينها. بعض المؤسسات تظهر باسم مختصر، مثل «C. UNIV. AFLOU» أو «ANNEXE …».
        </p>
      </div>
    </Shell>
  );
}
