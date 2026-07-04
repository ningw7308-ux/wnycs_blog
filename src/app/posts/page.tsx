import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
    },
  });

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString().slice(0, 10),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-marble-800 mb-2 tracking-wide">
        文章
      </h1>
      <p className="text-marble-600/70 mb-12">
        记录学习、思考与探索
      </p>

      {posts.length > 0 ? (
        <div className="space-y-5">
          {serializedPosts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
              <article className="card card-dark p-5 md:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h2 className="font-serif text-lg md:text-xl font-semibold text-marble-800 mb-2 line-clamp-1 group-hover:text-roman-red-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-marble-600/70 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {post.excerpt || ""}
                </p>
                <div className="w-12 h-px bg-roman-red-700/40 mb-3" />
                <div className="flex items-center justify-between text-xs text-marble-500/60">
                  <div className="flex items-center gap-3">
                    <span>{post.author.name || "匿名"}</span>
                    <span className="text-marble-400/50">|</span>
                    <time>{serializedPosts.find((s) => s.id === post.id)?.createdAt}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{post._count.likes}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-marble-500/60 text-sm">还没有文章。</p>
          <Link href="/new-post" className="inline-block mt-4 text-xs tracking-wider uppercase text-roman-red-700 hover:underline">
            写文章
          </Link>
        </div>
      )}
    </div>
  );
}