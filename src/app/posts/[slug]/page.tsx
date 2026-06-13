import Link from "next/link";

/**
 * 文章详情页（/posts/[slug]）
 * 公开页面，所有人可访问。
 * 展示文章完整内容、评论区、点赞等。
 * 参数 slug 从 URL 中获取，用于查询对应文章。
 */
export default function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // TODO: 根据 params.slug 从数据库获取文章详情
  const { slug } = params;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 返回按钮 */}
      <Link
        href="/posts"
        className="text-sm text-gray-400 hover:text-warm-500 transition-colors mb-6 inline-block"
      >
        &larr; 返回记录列表
      </Link>

      {/* 文章标题占位 */}
      <h1 className="text-3xl font-bold text-warm-800 mb-2">文章详情页</h1>
      <p className="text-gray-400 text-sm mb-8">
        当前文章 slug: <code className="bg-warm-50 px-2 py-0.5 rounded">{slug}</code>
      </p>

      {/* 文章内容区域 */}
      <article className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 mb-8">
        <p className="text-gray-500 text-center py-12">
          文章内容将在此处渲染（Markdown 格式）。
          <br />
          后续接入 react-markdown + remark-gfm 进行富文本展示。
        </p>
      </article>

      {/* 评论区占位 */}
      <section className="bg-white rounded-xl shadow-sm border border-warm-100 p-8">
        <h2 className="text-lg font-semibold text-warm-800 mb-4">评论</h2>
        <p className="text-gray-400 text-center py-8">
          评论区将在后续开发。
        </p>
      </section>
    </div>
  );
}