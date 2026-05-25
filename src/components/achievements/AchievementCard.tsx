import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Tag from "@/components/ui/Tag";
import { parseTags } from "@/lib/utils";

interface Achievement {
  id: number;
  title: string;
  slug: string;
  description: string;
  tags: string;
  coverImage: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  readMore?: string;
}

export default function AchievementCard({ achievement, readMore = "Read more" }: AchievementCardProps) {
  const tags = parseTags(achievement.tags);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group">
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={achievement.coverImage}
          alt={achievement.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-green-700 transition-colors">
          {achievement.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
          {achievement.description}
        </p>

        {/* Read more */}
        <Link
          href={`/achievements/${achievement.id}`}
          className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm mt-4 hover:gap-2.5 transition-all"
        >
          {readMore}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
