import Link from "next/link";
import PostCard from "@/components/PostCard";

/**
 * 模拟文章数据（后续会从数据库获取）。
 */
const mockPosts = [
  {
    slug: "hello-world",
    title: "第一篇温暖记录",
    summary: "这是一个温暖的地方，记录下每一个治愈的瞬间，分享给需要的人。",
    author: "温暖人",
    createdAt: "2026-06-10",
    likeCount: 12,
  },
  {
    slug: "sunshine",
    title: "今天阳光很好",
    summary: "早上起来看到窗外的阳光，突然觉得一切都充满了希望。",
    author: "阳光小屋",
    createdAt: "2026-06-09",
    likeCount: 8,
  },
  {
    slug: "letter-to-myself",
    title: "写给十年前自己的一封信",
    summary: "亲爱的过去的我，你不需要那么焦虑，一切都会好起来的。",
    author: "匿名用户",
    createdAt: "2026-06-08",
    likeCount: 25,
  },
];

/**
 * 文章列表页（/posts）
 * 公开页面，所有人可访问。
 * 展示所有已发布文章的卡片列表。
 */
export default function PostsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-800">心灵记录</h1>
        <p className="text-gray-500 mt-2">
          这里汇聚了来自社区成员的温暖故事与心灵感悟。
        </p>
      </div>

      {/* 文章卡片列表 */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </div>

      {/* 空状态（数据为空时显示） */}
      {mockPosts.length === 0 && (
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