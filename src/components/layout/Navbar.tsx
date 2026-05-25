"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useState, useEffect } from "react";

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { key: "home", href: "/" },
    { key: "uitvaartfonds", href: "#uitvaartfonds", external: true },
    { key: "donate", href: "/#donate" },
    { key: "achievements", href: "/achievements" },
    { key: "events", href: "/#events" },
    { key: "contact", href: "/#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden ring-2 ring-green-700/20">
              <Image
                src="/images/shio-logo.jpg"
                alt="SHIO VZW Logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-green-800 font-bold text-base lg:text-lg leading-tight">
                SHIO VZW
              </div>
              <div className="text-gray-500 text-xs hidden lg:block">
                {locale === "ar" ? "منظمة الهوسا السودانية" : "Sudanese Hausa Int'l Org"}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ key, href, external }) => (
              external ? (
                <a
                  key={key}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {t(key as Parameters<typeof t>[0])}
                </a>
              ) : (
                <Link
                  key={key}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {t(key as Parameters<typeof t>[0])}
                </Link>
              )
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/#donate"
              className="hidden md:inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors shadow-sm"
            >
              {t("donate")}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 pb-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ key, href, external }) => (
                external ? (
                  <a
                    key={key}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </a>
                ) : (
                  <Link
                    key={key}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                )
              ))}
              <Link
                href="/#donate"
                onClick={() => setMobileOpen(false)}
                className="mx-4 mt-2 flex items-center justify-center px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
              >
                {t("donate")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
