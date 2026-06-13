import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * 写新文章页面（/new-post）
 * 需要登录才能访问，未登录用户会被中间件重定向到 /login。
 * 这里通过 auth() 双重保障：如果中间件未生效，服务端也进行校验。
 */
export default async function NewPostPage() {
  const session = await auth();

  // 双重保障：服务端校验登录状态
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-warm-800 mb-2">写新文章</h1>
      <p className="text-gray-500 mb-8">
        记录下你的感受与思考，分享温暖给更多人。
      </p>

      {/* 表单占位区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-8 space-y-6">
        {/* 标题输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            文章标题
          </label>
          <input
            type="text"
            disabled
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            placeholder="给你的文章起一个温暖的标题..."
          />
        </div>

        {/* 内容输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            文章内容
          </label>
          <textarea
            disabled
            rows={10}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed resize-none"
            placeholder="写下你想分享的故事...&#10;&#10;支持 Markdown 格式。"
          />
        </div>

        {/* 选项 */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" disabled className="accent-warm-500" />
            匿名发布
          </label>
        </div>

        {/* 提交按钮 */}
        <button
          disabled
          className="w-full bg-warm-300 text-white font-medium py-2.5 rounded-lg cursor-not-allowed"
        >
          发布功能开发中
        </button>
      </div>
    </div>
  );
}