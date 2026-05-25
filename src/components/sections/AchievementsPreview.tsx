import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import AchievementCard from "@/components/achievements/AchievementCard";

async function getAchievements() {
  try {
    return await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch {
    return [];
  }
}

export default async function AchievementsPreview() {
  const t = await getTranslations("projects");
  const tAch = await getTranslations("achievements");
  const achievements = await getAchievements();

  return (
    <section id="achievements" className="py-20 lg:py-28 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="text-green-700 font-semibold text-sm uppercase tracking-wider mb-3">
            {t("subtitle")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="w-16 h-1 bg-green-600 rounded-full mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              readMore={tAch("read_more")}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-md hover:shadow-lg"
          >
            {t("view_all")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
