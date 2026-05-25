import { getTranslations } from "next-intl/server";
import CopyIBANButton from "./CopyIBANButton";

export default async function DonateSection() {
  const t = await getTranslations("donate");

  return (
    <section id="donate" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/images/green_pattern154.svg')",
          backgroundSize: "250px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="text-green-300 font-semibold text-sm uppercase tracking-wider mb-3">
              Make a Difference
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              {t("description")}
            </p>

            {/* Impact stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-green-600/50">
              {[
                { num: "4+", label: "Projects" },
                { num: "2", label: "Countries" },
                { num: "1000+", label: "Lives impacted" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.num}</div>
                  <div className="text-green-300 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Bank card */}
          <div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-white">
              {/* Card header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-green-300 text-sm mb-1">{t("bank_name")}</div>
                  <div className="font-bold text-xl">SHIO VZW</div>
                </div>
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              {/* Account number */}
              <div className="mb-8">
                <div className="text-green-300 text-xs uppercase tracking-wider mb-2">IBAN</div>
                <div className="text-3xl font-mono font-bold tracking-widest">
                  {t("bank_account")}
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-green-300 text-xs uppercase tracking-wider mb-1">Bank</div>
                  <div className="font-semibold">ING Belgium</div>
                </div>
                <div>
                  <div className="text-green-300 text-xs uppercase tracking-wider mb-1">BIC</div>
                  <div className="font-semibold">BBRUBEBB</div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <CopyIBANButton />
                <a
                  href="mailto:info@shio.be?subject=Donation"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  {t("cta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
