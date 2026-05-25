import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /admin routes (handled separately)
    // - /api routes
    // - files in /public (images, icons, etc.)
    // - _next internal routes
    "/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
