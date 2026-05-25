import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function AboutSection() {
  const t = await getTranslations("about");

  const stats = [
    { value: "4+", label: "Projects" },
    { value: "2", label: "Countries" },
    { value: "100%", label: "Volunteer" },
    { value: "2015", label: "Founded" },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/moskee.jpg"
                alt="SHIO VZW Community"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -end-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-green-700">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pattern accent */}
            <div className="absolute -top-4 -start-4 w-24 h-24 bg-green-100 rounded-2xl -z-10" />
          </div>

          {/* Content side */}
          <div className="lg:ps-8">
            <div className="text-green-700 font-semibold text-sm uppercase tracking-wider mb-3">
              {t("subtitle")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {t("title")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {t("description")}
            </p>

            {/* Key points */}
            <div className="space-y-4">
              {[
                { icon: "🌍", text: "Sudan & Chad operations" },
                { icon: "🏥", text: "Health, Education & Community" },
                { icon: "🤝", text: "100% volunteer-driven" },
                { icon: "📍", text: "Based in Turnhout, Belgium" },
              ].map((point) => (
                <div key={point.text} className="flex items-center gap-3">
                  <span className="text-xl">{point.icon}</span>
                  <span className="text-gray-700">{point.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
