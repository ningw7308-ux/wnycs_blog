import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * 个人主页（/profile）
 * 需要登录才能访问，未登录用户会被中间件重定向到 /login。
 * 这里通过 auth() 双重保障：如果中间件未生效，服务端也进行校验。
 */
export default async function ProfilePage() {
  const session = await auth();

  // 双重保障：服务端校验登录状态
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-warm-800 mb-6">个人主页</h1>

      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          {/* 头像占位 */}
          <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center text-2xl">
            {session.user.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-warm-800">
              {session.user.name || "未设置昵称"}
            </h2>
            <p className="text-gray-400 text-sm">{session.user.email}</p>
          </div>
        </div>

        {/* 个人简介占位 */}
        <div className="border-t border-warm-50 pt-4">
          <p className="text-gray-400 text-sm">
            个人简介将在后续开发。你可以在这里编辑个人资料、查看自己发布的文章。
          </p>
        </div>
      </div>

      {/* 我的文章占位 */}
      <section>
        <h2 className="text-lg font-semibold text-warm-800 mb-4">我的文章</h2>
        <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 text-center">
          <p className="text-gray-400">
            你还没有发布文章。
            <br />
            <a href="/new-post" className="text-warm-500 hover:underline mt-1 inline-block">
              去写第一篇
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}