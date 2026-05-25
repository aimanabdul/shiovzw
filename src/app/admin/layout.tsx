import { getAdminSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";

async function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </form>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if current page is login to avoid redirect loop
  // Layout applies to all /admin/* pages except login needs special handling
  const session = await getAdminSession();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50">
        {session ? (
          <>
            {/* Admin nav */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                  <div className="flex items-center gap-6">
                    <Link href="/admin" className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image src="/images/shio-logo.jpg" alt="SHIO" fill sizes="32px" className="object-cover" />
                      </div>
                      <span className="font-bold text-green-800 text-sm">SHIO Admin</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-1">
                      <Link
                        href="/admin"
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/achievements/new"
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        + New Achievement
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/nl"
                      target="_blank"
                      className="text-sm text-gray-500 hover:text-gray-700 hidden sm:block"
                    >
                      View site →
                    </Link>
                    <AdminLogoutButton />
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
