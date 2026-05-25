import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import AchievementCard from "@/components/achievements/AchievementCard";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "achievements" });
  return {
    title: t("all_title"),
    description: t("subtitle"),
  };
}

async function getAllAchievements() {
  try {
    return await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

interface AchievementsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AchievementsPage({ params }: AchievementsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "achievements" });
  const achievements = await getAllAchievements();

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-green-300 font-semibold text-sm uppercase tracking-wider mb-3">
            SHIO VZW
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("all_title")}
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {achievements.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xl font-medium">No achievements yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                readMore={t("read_more")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
