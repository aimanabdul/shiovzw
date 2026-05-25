import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import AchievementsPreview from "@/components/sections/AchievementsPreview";
import EventsSection from "@/components/sections/EventsSection";
import DonateSection from "@/components/sections/DonateSection";
import ContactSection from "@/components/sections/ContactSection";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NGO",
            name: "SHIO VZW",
            alternateName: "Sudanese Hausa International Organization",
            url: "https://shio.be",
            logo: "https://shio.be/images/shio-logo.jpg",
            description:
              "Belgian non-profit organization financing humanitarian projects in Sudan and Chad",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Steenweg op zevendonk 37",
              addressLocality: "Turnhout",
              postalCode: "2300",
              addressCountry: "BE",
            },
            email: "info@shio.be",
            telephone: "+32499829761",
            sameAs: [
              "https://www.facebook.com/groups/449667411830119",
              "https://twitter.com/shioVzw",
              "https://www.instagram.com/sudanesehausa/",
            ],
          }),
        }}
      />

      <HeroSection />
      <AboutSection />
      <AchievementsPreview />
      <EventsSection />
      <DonateSection />
      <ContactSection />
    </>
  );
}
