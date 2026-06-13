import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

/**
 * 个人主页（/profile）
 * 需要登录。
 * 显示当前用户信息（姓名、bio）和该用户发布的所有文章。
 */
export default async function ProfilePage() {
  const session = await auth();

  // 双重保障：服务端校验登录状态
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 获取用户完整信息
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
    },
  });

  // 获取该用户的所有文章（按时间倒序）
  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { likes: true },
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          {/* 头像 */}
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center text-2xl font-bold text-warm-600">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-warm-800">
              {user?.name || "未设置昵称"}
            </h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-300 mt-1">
              加入于{" "}
              {user?.createdAt.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* 个人简介 */}
        <div className="border-t border-warm-50 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">个人简介</h3>
          {user?.bio ? (
            <p className="text-gray-600 text-sm">{user.bio}</p>
          ) : (
            <p className="text-gray-300 text-sm italic">这个人很温暖，还没有写简介</p>
          )}
        </div>
      </div>

      {/* 我的文章 */}
      <section>
        <h2 className="text-lg font-semibold text-warm-800 mb-4">
          我的文章 ({posts.length})
        </h2>

        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                author={post.anonymous ? "某个温暖的人" : (user?.name || "匿名用户")}
                createdAt={post.createdAt.toISOString().slice(0, 10)}
                likeCount={post._count.likes}
              />
            ))}
          </div>
        ) : (
          /* 空状态 */
          <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 text-center">
            <p className="text-gray-400 mb-2">你还没有发布文章</p>
            <Link
              href="/new-post"
              className="text-warm-500 hover:underline text-sm"
            >
              去写第一篇
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}