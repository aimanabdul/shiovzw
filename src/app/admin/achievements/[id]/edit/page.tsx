import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import AchievementForm from "../../../AchievementForm";
import Link from "next/link";

interface EditAchievementPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAchievementPage({ params }: EditAchievementPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum)) notFound();

  let achievement;
  try {
    achievement = await prisma.achievement.findUnique({ where: { id: idNum } });
  } catch {
    notFound();
  }

  if (!achievement) notFound();

  const tags = parseTags(achievement.tags).join(", ");

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Achievement</h1>
          <p className="text-gray-500 text-sm">{achievement.title}</p>
        </div>
      </div>

      <AchievementForm
        achievementId={idNum}
        defaultValues={{
          title: achievement.title,
          description: achievement.description,
          tags,
          coverImage: achievement.coverImage,
        }}
      />
    </div>
  );
}
