import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "../globals.css";

type Locale = (typeof routing.locales)[number];

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    nl: "SHIO VZW - Sudanese Hausa International Organization",
    en: "SHIO VZW - Sudanese Hausa International Organization",
    fr: "SHIO VZW - Organisation Internationale Haoussa du Soudan",
    ar: "SHIO VZW - منظمة الهوسا السودانية الدولية",
  };
  const descriptions: Record<string, string> = {
    nl: "Belgische non-profitorganisatie die humanitaire projecten in Sudan en Tsjaad financiert.",
    en: "Belgian non-profit financing humanitarian projects in Sudan and Chad.",
    fr: "ONG belge finançant des projets humanitaires au Soudan et au Tchad.",
    ar: "منظمة بلجيكية غير ربحية تمول مشاريع إنسانية في السودان وتشاد.",
  };
  return {
    title: {
      default: titles[locale] || titles.nl,
      template: `%s | SHIO VZW`,
    },
    description: descriptions[locale] || descriptions.nl,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shio.be"),
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
      url: `https://shio.be/${locale}`,
      siteName: "SHIO VZW",
      images: [{ url: "/images/shio-logo.jpg", width: 800, height: 600 }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${inter.variable} ${notoNaskhArabic.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col${isArabic ? " font-[family-name:var(--font-arabic)]" : ""}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
