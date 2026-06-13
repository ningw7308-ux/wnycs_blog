import Link from "next/link";

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  likeCount: number;
  slug: string;
}

/**
 * PostCard 组件
 * 文章卡片，展示标题、摘要（excerpt）、作者、发布时间、温暖值（点赞数）。
 * 用于文章列表页和个人主页。
 */
export default function PostCard({
  title,
  excerpt,
  author,
  createdAt,
  likeCount,
  slug,
}: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="block">
      <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-warm-100">
        <h2 className="text-lg font-semibold text-warm-800 mb-2 line-clamp-1">
          {title}
        </h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>{author}</span>
            <span>{createdAt}</span>
          </div>
          <div className="flex items-center gap-1 text-warm-500">
            {/* 温暖值（点赞数） */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{likeCount}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}