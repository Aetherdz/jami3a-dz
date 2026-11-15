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
    default: "جامعة الجزائر — المؤسسات، التخصصات، والحياة الجامعية",
    template: "%s | جامعة",
  },
  description:
    "دليل الجامعة الجزائرية: 248 مؤسسة، 261 تخصصًا في 15 ميدانًا، دليل الحياة الجامعية، وأرقام القبول المنشورة لدورة 2026 مع حاسبة المعدل الموزون.",
  applicationName: "جامعة الجزائر",
  authors: [{ name: "جامعة الجزائر" }],
  creator: "جامعة الجزائر",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: "جامعة الجزائر",
    url: "/",
    title: "جامعة الجزائر — المؤسسات، التخصصات، والحياة الجامعية",
    description:
      "248 مؤسسة و261 تخصصًا، وحياة جامعية كاملة بعد الباب: السكن، الدراسة، السنة الأولى. مع أرقام القبول المنشورة وحاسبة المعدل الموزون.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4eb",
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
      "دليل مستقل للجامعة الجزائرية: المؤسسات، التخصصات، الحياة الجامعية، وأرقام القبول المنشورة.",
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
