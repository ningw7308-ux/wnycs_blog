import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

/**
 * 文章列表页（/posts）
 * 服务端组件，从数据库读取所有 published=true 的文章，按时间倒序排列。
 * 公开页面，所有人可访问。
 */
export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-800">心光记录</h1>
        <p className="text-gray-500 mt-2">
          这里汇聚了来自社区成员的温暖故事与心灵感悟。
        </p>
      </div>

      {/* 文章列表 */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              author={
                post.anonymous
                  ? "某个温暖的人"
                  : (post.author.name || "匿名用户")
              }
              createdAt={post.createdAt.toISOString().slice(0, 10)}
              likeCount={post._count.likes}
            />
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">还没有文章，快来写第一篇吧</p>
          <Link
            href="/new-post"
            className="inline-block mt-4 text-warm-500 hover:underline"
          >
            写文章
          </Link>
        </div>
      )}
    </div>
  );
}