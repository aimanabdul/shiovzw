import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AchievementForm from "../../AchievementForm";
import Link from "next/link";

export default async function NewAchievementPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Achievement</h1>
          <p className="text-gray-500 text-sm">Create a new project or achievement</p>
        </div>
      </div>

      <AchievementForm />
    </div>
  );
}
