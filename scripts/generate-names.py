#!/usr/bin/env python3
"""
Rebuild `content/names.ts` — the Arabic label of every canonical program name.

The ministry publishes the filière names in French only, so the site shows the
published French name next to an Arabic one. Curated translations live in this
file; anything the dictionary cannot translate keeps the French label rather
than getting an invented Arabic name — that is why the generator reports every
name it had to fall back on.

Usage:  python3 scripts/generate-names.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAMES = ROOT / "content" / "names.ts"
DATA = ROOT / "data" / "minimums.json"
INSTITUTIONS = ROOT / "data" / "institutions.json"

QUOTA = re.compile(r"\s*--\s*pour bacheliers.*$", re.I)

# Teacher-training suffixes: the acronym is printed in Latin on the ministry's
# file and on the school's own documents, so it stays Latin here too.
SUFFIX = {
    "(P.E.S.)": "(P.E.S.)",
    "(P.E.S)": "(P.E.S.)",
    "(P.E.M)": "(P.E.M)",
    "(P.E.P)": "(P.E.P)",
    "(PROFESSEUR DE L ENSEIGNEMENT SECONDAIRE)": "(أستاذ التعليم الثانوي)",
    "(PROFESSEUR DE L ENSEIGNEMENT MOYEN)": "(أستاذ التعليم المتوسط)",
    "(PROFESSEUR DE L ENSEIGNEMENT SECONDAIRE A L ECOLE SUPERIEURE DES PROFESSEURS POUR SOURDS-MUETS)":
        "(أستاذ التعليم الثانوي بالمدرسة العليا للأساتذة للصم والبكم)",
    "(FORMATION CONTINUE)": "(تكوين مستمر)",
    "(FORMATIONS PROFESSIONNALISANTES)": "(تكوينات مهنية)",
    "(A DISTANCE)": "(عن بعد)",
}

# Subjects taught in the écoles normales, mapped to their Arabic name.
TEACHING_SUBJECT = {
    "ARABE": "اللغة العربية",
    "LANGUE ARABE": "اللغة العربية",
    "LANGUE ET LITTERATURE ARABES": "اللغة والأدب العربي",
    "LANGUE AMAZIGHE": "اللغة الأمازيغية",
    "LANGUE FRANCAISE": "اللغة الفرنسية",
    "FRANCAIS": "اللغة الفرنسية",
    "LANGUE ANGLAISE": "اللغة الإنجليزية",
    "LANGUE ALLEMANDE": "اللغة الألمانية",
    "LANGUE ESPAGNOLE": "اللغة الإسبانية",
    "LANGUE ITALIENNE": "اللغة الإيطالية",
    "MATHEMATIQUES": "الرياضيات",
    "SCIENCES PHYSIQUES": "العلوم الفيزيائية",
    "SCIENCES PHYSIQUE ET TECHNOLOGIE": "العلوم الفيزيائية والتكنولوجيا",
    "SCIENCES NATURELLES": "علوم الطبيعة",
    "SCIENCES ISLAMIQUES": "العلوم الإسلامية",
    "SCIENCES ECONOMIQUES": "العلوم الاقتصادية",
    "HISTOIRE GEOGRAPHIE": "التاريخ والجغرافيا",
    "HISTOIRE ET GEOGRAPHIE": "التاريخ والجغرافيا",
    "PHILOSOPHIE": "الفلسفة",
    "INFORMATIQUE": "الإعلام الآلي",
    "EDUCATION PHYSIQUE ET SPORTIVE": "التربية البدنية والرياضية",
    "EDUCATION ARTISTIQUE": "التربية الفنية",
    "DESSIN": "الرسم",
    "MUSIQUE": "الموسيقى",
    "GENIE CIVIL": "الهندسة المدنية",
    "GENIE ELECTRIQUE": "الهندسة الكهربائية",
    "GENIE DES PROCEDES": "هندسة الطرائق",
    "GENIE MECANIQUE": "الهندسة الميكانيكية",
}

# Fully named programs (licences, professionalising and distance tracks).
EXPLICIT = {
    "SOCIOLOGIE DE LOISIR ET DU VOYAGE": "علم اجتماع الترفيه والسفر",
    "PHYSIQUE - COMPUTING QUANTIQUE ET TECHNOLOGIE QUANTIQUE":
        "الفيزياء — الحوسبة الكمومية والتكنولوجيا الكمومية",
    "HISTOIRE ET BIG DATA": "التاريخ والبيانات الضخمة",
    "COMMUNICATION MARKETING ET GESTION DE LA RELATION CLIENT":
        "الإعلام والتسويق وتسيير العلاقة مع العميل",
    "TRADING ET LES MARCHES FINANCIERS": "التداول والأسواق المالية",
    "NEGOCIATION ET TECHNOLOGIE FINANCIERE": "التفاوض والتكنولوجيا المالية",
    "CHIMIE - INGENIERIE DES MOLECULES INTELLIGENTES":
        "الكيمياء — هندسة الجزيئات الذكية",
    "MANAGEMENT DES SYSTEMES D INFORMATIONS DE SANTE": "تسيير نظم المعلومات الصحية",
    "MANAGEMENT ELECTRONIQUE DES AFFAIRES": "التسيير الإلكتروني للأعمال",
    "HYGIENE ET SECURITE INDUSTRIELLE": "الصحة والأمن الصناعي",
    "HYGIENE ET SECURITE INDUSTRIELLE (FORMATIONS PROFESSIONNALISANTES)":
        "الصحة والأمن الصناعي (تكوينات مهنية)",
    "ENERGIES RENOUVELABLES (FORMATIONS PROFESSIONNALISANTES)":
        "الطاقات المتجددة (تكوينات مهنية)",
    "VILLES INTELLIGENTES (FORMATIONS PROFESSIONNALISANTES)": "المدن الذكية (تكوينات مهنية)",
    "GEOGRAPHIE ET AMENAGEMENT DU TERRITOIRE (FORMATIONS PROFESSIONNALISANTES)":
        "الجغرافيا وتهيئة الإقليم (تكوينات مهنية)",
    "GENIE INDUSTRIEL (FORMATIONS PROFESSIONNALISANTES)":
        "الهندسة الصناعية (تكوينات مهنية)",
    "GENIE DES PROCEDES (FORMATIONS PROFESSIONNALISANTES)":
        "هندسة الطرائق (تكوينات مهنية)",
    "GENIE MECANIQUE (FORMATIONS PROFESSIONNALISANTES)":
        "الهندسة الميكانيكية (تكوينات مهنية)",
    "GENIE CIVIL (FORMATIONS PROFESSIONNALISANTES)": "الهندسة المدنية (تكوينات مهنية)",
    "OPTIQUE ET MECANIQUE DE PRECISION (FORMATIONS PROFESSIONNALISANTES)":
        "البصريات والميكانيك الدقيق (تكوينات مهنية)",
    "PHYSIQUE (FORMATIONS PROFESSIONNALISANTES)": "الفيزياء (تكوينات مهنية)",
    "MATHEMATIQUES (FORMATIONS PROFESSIONNALISANTES)": "الرياضيات (تكوينات مهنية)",
    "MATHEMATIQUES APPLIQUEES (FORMATIONS PROFESSIONNALISANTES)":
        "الرياضيات التطبيقية (تكوينات مهنية)",
    "INFORMATIQUE (FORMATIONS PROFESSIONNALISANTES)": "الإعلام الآلي (تكوينات مهنية)",
    "ELECTROTECHNIQUE (FORMATIONS PROFESSIONNALISANTES)":
        "الكهروتقنية (تكوينات مهنية)",
    "ELECTROMECANIQUE (FORMATIONS PROFESSIONNALISANTES)":
        "الكهروميكانيك (تكوينات مهنية)",
    "AUTOMATIQUE (FORMATIONS PROFESSIONNALISANTES)": "التحكم الآلي (تكوينات مهنية)",
    "SCIENCES DE GESTION (FORMATIONS PROFESSIONNALISANTES)":
        "علوم التسيير (تكوينات مهنية)",
    "SCIENCES COMMERCIALES (FORMATIONS PROFESSIONNALISANTES)":
        "العلوم التجارية (تكوينات مهنية)",
    "SCIENCES FINANCIERES ET COMPTABILITE (FORMATIONS PROFESSIONNALISANTES)":
        "العلوم المالية والمحاسبة (تكوينات مهنية)",
    "SCIENCES DE L INFORMATION ET DE LA COMMUNICATION (FORMATIONS PROFESSIONNALISANTES)":
        "علوم الإعلام والاتصال (تكوينات مهنية)",
    "SCIENCES AGRONOMIQUES (FORMATIONS PROFESSIONNALISANTES)":
        "العلوم الفلاحية (تكوينات مهنية)",
    "SCIENCES ALIMENTAIRES (FORMATIONS PROFESSIONNALISANTES)":
        "العلوم الغذائية (تكوينات مهنية)",
    "SCIENCES ALIMENTAIRES (CONTROLE ET MANAGEMENT DE LA QUALITE EN INDUSTRIES AGROALIMENTAIRES) (FORMATIONS PROFESSIONNALISANTES)":
        "العلوم الغذائية (مراقبة وتسيير الجودة في الصناعات الغذائية) (تكوينات مهنية)",
    "ECOLOGIE ET ENVIRONNEMENT (FORMATIONS PROFESSIONNALISANTES)":
        "علم البيئة والمحيط (تكوينات مهنية)",
    "HYDROBIOLOGIE MARINE ET CONTINENTALE (FORMATIONS PROFESSIONNALISANTES)":
        "علم الأحياء المائية البحرية والقارية (تكوينات مهنية)",
    "GEOPHYSIQUE (FORMATIONS PROFESSIONNALISANTES)": "الجيوفيزياء (تكوينات مهنية)",
    "TELECOMMUNICATIONS (FORMATIONS PROFESSIONNALISANTES)":
        "الاتصالات السلكية واللاسلكية (تكوينات مهنية)",
    "HYDRAULIQUE (FORMATIONS PROFESSIONNALISANTES)": "الهندسة المائية (تكوينات مهنية)",
    "INGENIERIE DES TRANSPORTS (FORMATIONS PROFESSIONNALISANTES)":
        "هندسة النقل (تكوينات مهنية)",
    "MANAGEMENT DES PROJETS DE CONSTRUCTION (FORMATIONS PROFESSIONNALISANTES)":
        "تسيير مشاريع البناء (تكوينات مهنية)",
    "GESTION DES TECHNIQUES URBAINES (FORMATIONS PROFESSIONNALISANTES)":
        "تسيير التقنيات الحضرية (تكوينات مهنية)",
    "GESTION DES TECHNIQUES URBAINES (GENIE URBAIN) (FORMATIONS PROFESSIONNALISANTES)":
        "تسيير التقنيات الحضرية (الهندسة الحضرية) (تكوينات مهنية)",
    "GESTION DES TECHNIQUES URBAINES (GESTION DES VILLES) (FORMATIONS PROFESSIONNALISANTES)":
        "تسيير التقنيات الحضرية (تسيير المدن) (تكوينات مهنية)",
    "METIERS DE LA VILLE (DESIGN ET ARCHITECTURE INTERIEURE) (FORMATIONS PROFESSIONNALISANTES)":
        "مهن المدينة (التصميم والعمارة الداخلية) (تكوينات مهنية)",
    "METIERS DE LA VILLE (INFOGRAPHIE EN ARCHITECTURE) (FORMATIONS PROFESSIONNALISANTES)":
        "مهن المدينة (الإعلام الآلي البياني في العمارة) (تكوينات مهنية)",
    "METIERS DE LA VILLE GEOMETRE TOPOGRAPHE (FORMATIONS PROFESSIONNALISANTES)":
        "مهن المدينة — المساح الطبوغرافي (تكوينات مهنية)",
    "OPTIQUE ET MECANIQUE DE PRECISION (OPTOMETRIE) (FORMATIONS PROFESSIONNALISANTES)":
        "البصريات والميكانيك الدقيق (قياس البصر) (تكوينات مهنية)",
    "OPTIQUE ET MECANIQUE DE PRECISION (METROLOGIE ET CONTROLE INDUSTRIEL) (FORMATIONS PROFESSIONNALISANTES)":
        "البصريات والميكانيك الدقيق (القياس والمراقبة الصناعية) (تكوينات مهنية)",
    "HYDROCARBURES (FORAGE) (FORMATIONS PROFESSIONNALISANTES)":
        "المحروقات (الحفر) (تكوينات مهنية)",
    "HYDROCARBURES (MECANIQUE DES CHANTIERS PETROLIERS) (FORMATIONS PROFESSIONNALISANTES)":
        "المحروقات (ميكانيك أوراش النفط) (تكوينات مهنية)",
    "GENIEBIOMEDICAL (FORMATIONS PROFESSIONNALISANTES)":
        "الهندسة الطبية الحيوية (تكوينات مهنية)",
    "SCIENCES DE GESTION SCIENCES FINANCIERES ET COMPTABILITE (FORMATIONS PROFESSIONNALISANTES)":
        "علوم التسيير — العلوم المالية والمحاسبة (تكوينات مهنية)",
    "OPTICAL ET MECANIQUE DE PRECISION": "البصريات والميكانيك الدقيق",
    "OPTIQUE ET MECANIQUE DE PRECISION": "البصريات والميكانيك الدقيق",
    "AERONAUTIQUE": "الطيران",
    "GENIE MINIER": "هندسة المناجم",
    "GENIE MINIER ET TRAITEMENT DES MINERAIS": "هندسة المناجم ومعالجة المعادن",
    "GENIE INDUSTRIEL": "الهندسة الصناعية",
    "GENIE MARITIME": "الهندسة البحرية",
    "INDUSTRIES PETROCHIMIQUES": "الصناعات البتروكيميائية",
    "METALLURGIE": "المعادن (الميتالورجيا)",
    "HYDROCARBURES": "المحروقات",
    "ELECTROMECANIQUE": "الكهروميكانيك",
    "ELECTROMECANIQUE (ELECTROMECANIQUE D AUTOMOBILE)":
        "الكهروميكانيك (كهروميكانيك السيارات)",
    "GENIEMECANIQUE (FORMATIONS PROFESSIONNALISANTES)":
        "الهندسة الميكانيكية (تكوينات مهنية)",
    "ELECTROTECHNIQUE (ENERGIES RENOUVELABLES)": "الكهروتقنية (الطاقات المتجددة)",
    "TRAVAUX PUBLICS": "الأشغال العمومية",
    "METIERS DE LA VILLE": "مهن المدينة",
    "GENIE MECANIQUE (TECHNOLOGIE AUTOMOBILE)":
        "الهندسة الميكانيكية (تكنولوجيا السيارات)",
    "GENIE MECANIQUE (INGENIERIE DE CONSTRUCTION AUTOMOBILE)":
        "الهندسة الميكانيكية (هندسة بناء السيارات)",
    "GENIE CIVIL (CONSTRUCTIONS CIVILS ET ENVIRONNEMENT)":
        "الهندسة المدنية (البناءات المدنية والبيئة)",
    "GENIE CIVIL (VOIRIE ET RESEAUX DIVERS)":
        "الهندسة المدنية (الطرق والشبكات المختلفة)",
    "ENERGIES RENOUVELABLES (CONVERSION THERMIQUE)":
        "الطاقات المتجددة (التحويل الحراري)",
    "ENERGIES RENOUVELABLES (CONVERSION PHOTOVOLTAIQUE)":
        "الطاقات المتجددة (التحويل الكهروضوئي)",
    "TELECOMMUNICATIONS": "الاتصالات السلكية واللاسلكية",
    "COMMUNICATIONS FILAIRES ET SANS FIL": "الاتصالات السلكية واللاسلكية",
    "AUTOMATIQUE": "التحكم الآلي",
    "AUTOMATIQUE (SYSTEME AUTOMOBILE)": "التحكم الآلي (نظام السيارات)",
    "AUTOMATIQUE (A DISTANCE)": "التحكم الآلي (عن بعد)",
    "ELECTRONIQUE (SYSTEMES ELECTRONIQUES AUTONOMES ET INTELLIGENCE ARTIFICIELLE)":
        "الإلكترونيك (الأنظمة الإلكترونية المستقلة والذكاء الاصطناعي)",
    "ELECTRONIQUE (ENSEIGNEMENT EN LANGUE ANGLAISE)":
        "الإلكترونيك (تدريس باللغة الإنجليزية)",
    "CONCEPTION DES CIRCUITS ELECTRONIQUES": "تصميم الدارات الإلكترونية",
    "INGENIERIE DES TRANSPORTS": "هندسة النقل",
    "MANAGEMENT DES PROJETS DE CONSTRUCTION": "تسيير مشاريع البناء",
    "MANAGEMENT DES AEROPORTS ET DU TRANSIT": "تسيير المطارات والعبور",
    "MATHEMATIQUES APPLIQUEES": "الرياضيات التطبيقية",
    "PHYSIQUE - COMPUTING QUANTIQUE ET TECHNOLOGIE QUANTIQUE":
        "الفيزياء — الحوسبة الكمومية والتكنولوجيا الكمومية",
    "SCIENCES BIOLOGIQUES": "العلوم البيولوجية",
    "GEOPHYSIQUE": "الجيوفيزياء",
    "STATISTIQUE ET INGENIERIE DES DONNEES": "الإحصاء وهندسة المعطيات",
    "INFORMATIQUE (A DISTANCE)": "الإعلام الآلي (عن بعد)",
    "LANGUE ANGLAISE (A DISTANCE)": "اللغة الإنجليزية (عن بعد)",
    "LANGUE FRANCAISE (A DISTANCE)": "اللغة الفرنسية (عن بعد)",
    "SCIENCES ECONOMIQUES (A DISTANCE)": "العلوم الاقتصادية (عن بعد)",
    "TRADUCTION INTERPRETARIAT (ARABE, FRANCAIS, AMAZIGH)":
        "الترجمة التحريرية والشفوية (عربي، فرنسي، أمازيغي)",
    "TRADUCTION INTERPRETARIAT (ARABE, FRANCAIS, ESPAGNOLE)":
        "الترجمة التحريرية والشفوية (عربي، فرنسي، إسباني)",
    "TRADUCTION INTERPRETARIAT (ARABE, ANGLAIS, ITALIEN)":
        "الترجمة التحريرية والشفوية (عربي، إنجليزي، إيطالي)",
    "TRADUCTION/INTERPRETARIAT ARABE/FRANCAIS/ANGLAIS":
        "الترجمة التحريرية والشفوية (عربي، فرنسي، إنجليزي)",
    "SCIENCES HUMAINES SCIENCES DE L INFORMATION ET DE LA COMMUNICATION":
        "العلوم الإنسانية — علوم الإعلام والاتصال",
    "SCIENCES DE L INFORMATION ET DE LA COMMUNICATION - INFORMATION EN LANGUE AMAZIGHE":
        "علوم الإعلام والاتصال — الإعلام باللغة الأمازيغية",
    "SCIENCES HUMAINES ARCHEOLOGIE": "العلوم الإنسانية — علم الآثار",
    "MEDECINE DENTAIRE SANTE ET HYGIENE DENTAIRE":
        "طب الأسنان — صحة الفم والأسنان",
    "PHARMACIE INDUSTRIE DES PRODUITS PHARMACEUTIQUES ET DE SANTE":
        "الصيدلة — صناعة المنتجات الصيدلانية والصحية",
    "PHARMACIE AUXILIAIRES EN PHARMACIE": "الصيدلة — مساعدو الصيدلة",
    "PERSONNEL DE LA COMMUNICATION ET DES RELATIONS PUBLIQUES DANS LES INSTITUTIONS DE JEUNESSE":
        "إطارات الإعلام والعلاقات العامة في مؤسسات الشباب",
    "PERSONNEL D ENCADREMENT ET D ORIENTATION DES JEUNES":
        "إطارات التأطير والتوجيه في مؤسسات الشباب",
    "MUSIQUE (SCIENCES MUSICALES)": "الموسيقى (العلوم الموسيقية)",
    "MUSICIEN INTERPRETE ET CREATEUR": "الموسيقي المؤدي والمبدع",
    "ARTS DU SPECTACLE (REPRESENTATION - SCENOGRAPHIE - CRITIQUE THEATRALE)":
        "فنون العرض (التمثيل — السينوغرافيا — النقد المسرحي)",
    "ARTS VISUELS (PEINTURE - SCULPTURE - DESIGN GRAPHIQUE - DESIGN ESPACE)":
        "الفنون البصرية (الرسم — النحت — التصميم البياني — تصميم الفضاء)",
    "ARTS AUDIOVISUELS (CINEMA) ,ARTS VISUELS (SCENARIO - IMAGE - SON - GESTION DE PRODUCTION)":
        "الفنون السمعية البصرية (السينما)، الفنون البصرية (السيناريو — الصورة — الصوت — تسيير الإنتاج)",
    "ECRITURE DE SCENARIO": "كتابة السيناريو",
    "COMEDIEN PROFESSIONNEL ET AUTEUR DRAMATIQUE":
        "الممثل المحترف والمؤلف الدرامي",
    "CONCEPTEUR 3D SPECIALISATION EFFETS SPECIAUX VFX":
        "مصمم ثلاثي الأبعاد — تخصص المؤثرات الخاصة VFX",
    "PRODUCTION ET DESIGN NUMERIQUE - PRODUCTION DE CONTENU NUMERIQUE":
        "الإنتاج والتصميم الرقمي — إنتاج المحتوى الرقمي",
    "PRODUCTION ET DESIGN NUMERIQUE INDUSTRIE DU CONTENU NUMERIQUE":
        "الإنتاج والتصميم الرقمي — صناعة المحتوى الرقمي",
    "TECHNOLOGIES DE L INFORMATION DE LA COMMUNICATION ET DE LA NUMERISATION":
        "تكنولوجيات الإعلام والاتصال والرقمنة",
    "CONSERVATION ET RESTAURATION DES BIENS CULTURELS":
        "حفظ وترميم الممتلكات الثقافية",
    "SCIENCES FINANCIERES ET COMPTABILITE": "العلوم المالية والمحاسبة",
}

# Institutions whose published name is abbreviated in a formation-based ("FB")
# program name, so the table lookup cannot match them.
FB_SCHOOL = {
    "ECOLE NAT SUP DES ENERGIES RENOUVELABLES DE ENVIRONNEMENT ET DU DEVELOPPEMENT DURABLE BATNA":
        "المدرسة الوطنية العليا للطاقات المتجددة والبيئة والتنمية المستدامة بباتنة",
    "ECOLE SUPERIEURE EN SCIENCES ET TECHNOLOGIES DE L INFORMATIQUE ET DU NUMERIQUE BEJAIA":
        "المدرسة العليا في علوم وتكنولوجيات الإعلام الآلي والرقمنة ببجاية",
    "ECOLE NATIONALE SUPERIEURE D HYDRAULIQUE BLIDA": "المدرسة الوطنية العليا للهندسة المائية بالبليدة",
    "ECOLE NATIONALE SUPERIEURE DES SCIENCES DE LA MER ET DE L AMENAGEMENT DU LITTORAL D ALGER":
        "المدرسة الوطنية العليا لعلوم البحر وتهيئة الساحل بالجزائر",
    "ECOLE NATIONALE SUPERIEURE DES NANOSCIENCES ET NANOTECHENOLOGIES ALGER":
        "المدرسة الوطنية العليا للنانوعلوم والنانوتكنولوجيا بالجزائر",
    "ECOLE NATIONALE SUPERIEURE DES SYSTEMES AUTONOMES ALGER":
        "المدرسة الوطنية العليا للأنظمة المستقلة بالجزائر",
    "ECOLE NATIONALE SUPERIEURE EN INTELLIGENCE ARTIFICIELLE ALGER":
        "المدرسة الوطنية العليا للذكاء الاصطناعي بالجزائر",
    "ECOLE NATIONALE SUPERIEURE EN MATHEMATIQUES ALGER":
        "المدرسة الوطنية العليا للرياضيات بالجزائر",
    "ECOLE SUPERIEURE DES SCIENCES DE L ALIMENT ET DES INDUSTRIES AGROALIMENTAIRES D ALGER":
        "المدرسة العليا لعلوم الغذاء والصناعات الغذائية بالجزائر",
    "ECOLE SUPERIEURE DE D ECONOMIE D ORAN": "المدرسة العليا للاقتصاد بوهران",
    "ECOLE NATIONALE SUPERIEURE DES FORETS DE KHENCHELA":
        "المدرسة الوطنية العليا للغابات بخنشلة",
    "ECOLE NATIONALE SUPERIEURE EN STATISTIQUE ET EN ECONOMIE APPLIQUEE KOLEA":
        "المدرسة الوطنية العليا للإحصاء والاقتصاد التطبيقي بالقلعة",
    "ECOLE SUPERIEURE DE GESTION ET DE L ECONOMIE NUMERIQUE KOLEA":
        "المدرسة العليا للتسيير والاقتصاد الرقمي بالقلعة",
}


def existing() -> dict[str, str]:
    if not NAMES.exists():
        return {}
    text = NAMES.read_text(encoding="utf-8")
    return {
        match.group(1): match.group(2)
        for match in re.finditer(r'^\s*"((?:[^"\\]|\\.)+)":\s*"((?:[^"\\]|\\.)*)",\s*$', text, re.M)
    }


def canonical(name: str) -> str:
    return re.sub(r"\s+", " ", QUOTA.sub("", name)).strip()


def teaching(name: str) -> str | None:
    """`SUBJECT (P.E.S.)` and friends, plus the two-year teaching tracks."""
    option = re.match(r"^TECHNIQUE\s*\((P\.E\.[SMP])\)\s+OPTION\s*:\s*(.+)$", name)
    if option:
        subject_ar = TEACHING_SUBJECT.get(option.group(2).strip().upper())
        return f"تقني ({option.group(1)}) — خيار: {subject_ar}" if subject_ar else None

    match = re.match(r"^(.+?)\s*(\((?:P\.E\.[SMP]\.?|PROFESSEUR DE L ENSEIGNEMENT[^)]*)\))\s*$", name)
    if not match:
        return None
    subject, suffix = match.group(1), match.group(2)
    suffix = SUFFIX.get(suffix.upper().replace("  ", " "), SUFFIX.get(suffix))
    if suffix is None:
        return None
    subject_ar = TEACHING_SUBJECT.get(subject.upper())
    if not subject_ar:
        return None
    return f"{subject_ar} {suffix}"


def school(name: str, by_name: dict[str, str]) -> str | None:
    """`FB INF ECOLE NATIONALE ...` → the Arabic name of that school."""
    match = re.match(r"^FB\s+[A-Z]+\s+(.+)$", name)
    if not match:
        return None
    rest = match.group(1)
    ar = by_name.get(rest) or FB_SCHOOL.get(rest)
    return f"تكوين قاعدي — {ar}" if ar else None


def main() -> None:
    import json

    rows = json.loads(DATA.read_text(encoding="utf-8"))["rows"]
    institutions = json.loads(INSTITUTIONS.read_text(encoding="utf-8"))
    by_name = {item["name"]: item["ar"] for item in institutions if item.get("ar")}

    curated = existing()
    programs = sorted({canonical(row["n"]) for row in rows})

    out: dict[str, str] = {}
    missing: list[str] = []
    for name in programs:
        ar = curated.get(name) or EXPLICIT.get(name) or teaching(name) or school(name, by_name)
        if ar:
            out[name] = ar
        else:
            missing.append(name)

    lines = [
        "/**",
        " * Arabic label for every canonical program name in `data/minimums.json`.",
        " *",
        " * The ministry publishes the filière names in French only, so each program",
        " * keeps its published French name beside this Arabic one. Generated by",
        " * `scripts/generate-names.py`: subjects taught in the écoles normales are",
        " * translated from a dictionary, formations based at a school reuse the",
        " * school's Arabic name, and anything the dictionary cannot translate keeps",
        " * the French label rather than getting an invented Arabic name.",
        " */",
        "export const programNamesAr: Record<string, string> = {",
    ]
    for name in programs:
        if name in out:
            lines.append(f'  {json.dumps(name, ensure_ascii=False)}: {json.dumps(out[name], ensure_ascii=False)},')
    lines.append("};")
    lines.append("")
    NAMES.write_text("\n".join(lines), encoding="utf-8")

    print(f"{len(out)} of {len(programs)} programs translated")
    if missing:
        print("fell back to the French label:")
        for name in missing:
            print("  -", name)


if __name__ == "__main__":
    main()
