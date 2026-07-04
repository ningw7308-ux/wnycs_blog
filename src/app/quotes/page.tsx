import Link from "next/link";

export default function QuotesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-warm-800 mb-4">治愈语录</h1>
      <p className="text-gray-500 mb-8">一句有力量的话，或许就能照亮一天。</p>
      <Link
        href="/"
        className="text-warm-500 hover:underline text-sm"
      >
        返回首页
      </Link>
    </div>
  );
}