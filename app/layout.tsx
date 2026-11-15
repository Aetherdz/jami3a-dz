import type { Metadata, Viewport } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const display = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "جامعة الجزائر — المعدل الموزون ومعدلات القبول 2026",
    template: "%s | جامعة",
  },
  description:
    "احسب معدلك الموزون حسب ميدان التكوين، وقارنه بأدنى المعدلات المنشورة في 248 مؤسسة جامعية جزائرية لدورة 2026، مرتبة في 15 ميدانًا و261 تخصصًا.",
  applicationName: "جامعة الجزائر",
  authors: [{ name: "جامعة الجزائر" }],
  creator: "جامعة الجزائر",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "جامعة الجزائر",
    url: "/",
    title: "جامعة الجزائر — المعدل الموزون ومعدلات القبول 2026",
    description:
      "261 تخصصًا و248 مؤسسة، من ملف معدلات القبول الرسمي، مع صيغة الترتيب وحاسبة المعدل الموزون.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f4ed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "جامعة الجزائر",
    alternateName: "Jami3a DZ",
    url: siteUrl,
    inLanguage: "ar",
    description:
      "دليل مستقل لقراءة معدلات القبول الجامعية في الجزائر وحساب المعدل الموزون لدورة 2026.",
  };

  return (
    <html lang="ar" dir="rtl" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
