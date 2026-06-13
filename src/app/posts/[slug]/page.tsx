import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 文章详情页（/posts/[slug]）
 * 服务端组件，根据 slug 查找文章。
 * - 存在 → 渲染 Markdown 内容
 * - 不存在 → 404
 */
export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: { name: true, image: true },
      },
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  // 文章不存在 → 404
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 返回按钮 */}
      <Link
        href="/posts"
        className="text-sm text-gray-400 hover:text-warm-500 transition-colors mb-6 inline-block"
      >
        &larr; 返回心光记录
      </Link>

      {/* 文章头部 */}
      <article className="bg-white rounded-xl shadow-sm border border-warm-100 overflow-hidden">
        {/* 文章信息区 */}
        <div className="p-8 pb-4 border-b border-warm-50">
          <h1 className="text-3xl font-bold text-warm-800 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between text-sm text-gray-400">
            {/* 作者信息（匿名则隐藏） */}
            <div className="flex items-center gap-2">
              {post.anonymous ? (
                <span>某个温暖的人</span>
              ) : (
                <span>{post.author.name || "匿名用户"}</span>
              )}
              <span>·</span>
              <time dateTime={post.createdAt.toISOString()}>
                {post.createdAt.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* 温暖值 & 评论数 */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-warm-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {post._count.likes} 温暖
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {post._count.comments} 评论
              </span>
            </div>
          </div>
        </div>

        {/* 文章内容（Markdown 渲染） */}
        <div className="p-8 prose prose-warm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 点赞按钮插槽 */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-warm-100 p-6 text-center">
        <p className="text-gray-400 text-sm">点赞功能将在后续开发</p>
      </div>

      {/* 评论区插槽 */}
      <section className="mt-6 bg-white rounded-xl shadow-sm border border-warm-100 p-8">
        <h2 className="text-lg font-semibold text-warm-800 mb-4">
          评论 ({post._count.comments})
        </h2>
        <p className="text-gray-400 text-sm text-center py-8">
          评论区将在后续开发。
        </p>
      </section>
    </div>
  );
}