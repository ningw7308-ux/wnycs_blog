import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

const QUOTES = [
  "爱其总体，也爱每一粒恒河之沙。",
  "在你之后，我之后，有什么能跨越时间和空间的界限，成为永恒？",
  "小片夕阳落在我手里。",
  "only pasionately curious",
  "梨花的瓣子是月亮做的。",
];

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
    },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString().slice(0, 10),
  }));

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      {/* 博主一句话 */}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-marble-800 mb-3 tracking-wide">
        To Adapt and Thrive amid Uncertainty
      </h1>

      {/* 引言 — 随机展示 */}
      <p className="font-serif text-lg text-marble-600/70 italic mb-16 border-l-2 border-roman-red-700 pl-4">
        &ldquo;{randomQuote}&rdquo;
      </p>

      {/* 最新文章 */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-marble-800 mb-8 tracking-wide">
          最近文章
        </h2>

        {serializedPosts.length > 0 ? (
          <div className="space-y-5">
            {serializedPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt || ""}
                author={post.author.name || "匿名"}
                createdAt={post.createdAt}
                likeCount={post._count.likes}
                slug={post.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-marble-500/60 text-sm">还没有文章。</p>
        )}

        {posts.length > 0 && (
          <div className="mt-8">
            <Link
              href="/posts"
              className="text-xs tracking-widest uppercase text-marble-500/60 hover:text-roman-red-700 transition-colors"
            >
              查看全部文章 &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}