import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shio.be";
const LOCALES = ["nl", "en", "fr", "ar"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["/", "/achievements"];
  const urls: MetadataRoute.Sitemap = [];

  // Static pages for all locales
  for (const locale of LOCALES) {
    for (const page of staticPages) {
      urls.push({
        url: `${BASE_URL}/${locale}${page === "/" ? "" : page}`,
        lastModified: new Date(),
        changeFrequency: page === "/" ? "weekly" : "monthly",
        priority: page === "/" ? 1 : 0.8,
      });
    }
  }

  // Dynamic achievement pages
  try {
    const achievements = await prisma.achievement.findMany({
      select: { id: true, updatedAt: true },
    });

    for (const achievement of achievements) {
      for (const locale of LOCALES) {
        urls.push({
          url: `${BASE_URL}/${locale}/achievements/${achievement.id}`,
          lastModified: achievement.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Database might not be available during static generation
  }

  return urls;
}
