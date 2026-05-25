"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

const localeNames: Record<string, { name: string; flag: string }> = {
  nl: { name: "NL", flag: "🇧🇪" },
  en: { name: "EN", flag: "🇬🇧" },
  fr: { name: "FR", flag: "🇫🇷" },
  ar: { name: "العربيه", flag: "🌙" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const current = localeNames[locale] || { name: locale.toUpperCase(), flag: "" };

  function switchLocale(newLocale: string) {
    router.push(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-700/30 hover:bg-green-50 transition-colors"
        aria-label="Switch language"
      >
        <span>{current.flag}</span>
        <span className="text-green-800">{current.name}</span>
        <svg
          className={`w-3.5 h-3.5 text-green-700 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 end-0 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[120px]">
          {Object.entries(localeNames).map(([loc, { name, flag }]) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-green-50 transition-colors ${
                loc === locale ? "bg-green-50 text-green-800 font-semibold" : "text-gray-700"
              }`}
            >
              <span>{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
