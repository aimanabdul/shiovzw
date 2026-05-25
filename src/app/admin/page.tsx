import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { parseTags } from "@/lib/utils";
import AdminDeleteButton from "./AdminDeleteButton";

async function getAchievements() {
  try {
    return await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const achievements = await getAchievements();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your achievements — {achievements.length} total
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Achievements", value: achievements.length, icon: "🏆" },
          { label: "Total Tags", value: [...new Set(achievements.flatMap((a) => parseTags(a.tags)))].length, icon: "🏷️" },
          { label: "Logged in as", value: session.email.split("@")[0], icon: "👤" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Achievements</h2>
        </div>

        {achievements.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg font-medium">No achievements yet</p>
            <p className="text-sm mt-1">Add your first achievement to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {achievements.map((achievement) => {
              const tags = parseTags(achievement.tags);
              return (
                <div key={achievement.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Cover */}
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={achievement.coverImage}
                      alt={achievement.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{achievement.title}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block text-sm text-gray-400 flex-shrink-0">
                    {new Date(achievement.createdAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/achievements/${achievement.id}/edit`}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                    >
                      Edit
                    </Link>
                    <AdminDeleteButton id={achievement.id} title={achievement.title} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
