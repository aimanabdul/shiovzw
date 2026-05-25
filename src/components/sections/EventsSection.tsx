import { getTranslations } from "next-intl/server";
import Image from "next/image";

const events = [
  {
    id: 1,
    title: "Eid Al Fitr & Al Adha Celebration",
    image: "/images/iftar-thre.jpeg",
    description:
      "As an active community member in Turnhout, organized a special event during Eid to bring together diverse cultures.",
    category: "Community",
  },
  {
    id: 2,
    title: "AIF Meeting in Turnhout",
    image: "/images/aif02.jpeg",
    description:
      "Strengthened partnership with AIF and expanded activities in Belgium and abroad.",
    category: "Partnership",
  },
  {
    id: 3,
    title: "AIF General Assembly",
    image: "/images/aif01-jpeg-1686608817220.webp",
    description:
      "Actively participated in AIF organization, engaging in discussions with fellow members.",
    category: "Organization",
  },
  {
    id: 4,
    title: "4 Pillars Event in Brussels",
    image: "/images/4pijlers-jpg-1686608646204.webp",
    description:
      "Attended the '4 Pillars' event in Brussels, building valuable relationships.",
    category: "Networking",
  },
];

export default async function EventsSection() {
  const t = await getTranslations("events");

  return (
    <section id="events" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="text-green-700 font-semibold text-sm uppercase tracking-wider mb-3">
            Community
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <div className="w-16 h-1 bg-green-600 rounded-full mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <article
              key={event.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Category badge */}
                <div className="absolute top-3 start-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 group-hover:text-green-700 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
