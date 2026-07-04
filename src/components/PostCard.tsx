import Link from "next/link";

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  likeCount: number;
  slug: string;
}

export default function PostCard({
  title,
  excerpt,
  author,
  createdAt,
  likeCount,
  slug,
}: PostCardProps) {
  const date = new Date(createdAt);
  const formattedDate = `${date.getFullYear()}·${String(date.getMonth() + 1).padStart(2, "0")}·${String(date.getDate()).padStart(2, "0")}`;

  return (
    <Link href={`/posts/${slug}`} className="block group">
      <article className="card card-dark p-5 md:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <h2 className="font-serif text-lg md:text-xl font-semibold text-marble-800 mb-2 line-clamp-1 group-hover:text-roman-red-700 transition-colors">
          {title}
        </h2>

        <p className="text-marble-600/70 text-sm mb-3 line-clamp-2 leading-relaxed">{excerpt}</p>

        {/* 分隔线 */}
        <div className="w-12 h-px bg-roman-red-700/40 mb-3" />

        <div className="flex items-center justify-between text-xs text-marble-500/60">
          <div className="flex items-center gap-3">
            <span>{author}</span>
            <span className="text-marble-400/50">|</span>
            <time>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-1 text-marble-500/60">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{likeCount}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}