import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseTags, parseGallery } from "@/lib/utils";
import Tag from "@/components/ui/Tag";
import Lightbox from "@/components/achievements/Lightbox";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) return {};
  try {
    const achievement = await prisma.achievement.findUnique({ where: { id: idNum } });
    if (!achievement) return {};
    return {
      title: achievement.title,
      description: achievement.description.slice(0, 160),
      openGraph: {
        images: [{ url: achievement.coverImage }],
      },
    };
  } catch {
    return {};
  }
}

interface AchievementDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AchievementDetailPage({ params }: AchievementDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  const t = await getTranslations({ locale, namespace: "achievements" });

  let achievement;
  try {
    achievement = await prisma.achievement.findUnique({ where: { id: idNum } });
  } catch {
    notFound();
  }

  if (!achievement) notFound();

  const tags = parseTags(achievement.tags);
  const gallery = parseGallery(achievement.galleryImages);

  // Combine cover + gallery for lightbox
  const allImages = [achievement.coverImage, ...gallery].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      <div className="relative h-64 sm:h-80 lg:h-96">
        <Image
          src={achievement.coverImage}
          alt={achievement.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 start-4">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/25 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("back")}
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 start-0 end-0 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} variant="outline" />
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {achievement.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Description */}
        <div className="prose prose-lg max-w-none mb-10">
          <p className="text-gray-700 text-lg leading-relaxed">{achievement.description}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 items-center p-5 bg-green-50 rounded-2xl mb-10 border border-green-100">
          <div>
            <div className="text-green-700 text-xs font-semibold uppercase tracking-wider mb-1">
              {t("tags")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>
          <div className="ms-auto text-sm text-gray-500">
            {new Date(achievement.createdAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Gallery */}
        {allImages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t("gallery")}
            </h2>
            <Lightbox images={allImages} altPrefix={achievement.title} />
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
