import Link from "next/link";

/**
 * 404 Not Found 页面
 * 当文章 slug 不存在时触发（通过 notFound() 调用）。
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-warm-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-warm-800 mb-2">
        文章未找到
      </h2>
      <p className="text-gray-400 mb-8">
        你寻找的记录可能已被删除，或者从未存在过。
      </p>
      <Link
        href="/posts"
        className="bg-warm-500 hover:bg-warm-600 text-white px-6 py-2 rounded-full transition-colors"
      >
        返回
      </Link>
    </div>
  );
}