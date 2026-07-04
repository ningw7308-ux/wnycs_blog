"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface WallMessage {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

/** 便利贴颜色列表 */
const COLORS = [
  "bg-yellow-100 border-yellow-200",
  "bg-green-100 border-green-200",
  "bg-blue-100 border-blue-200",
  "bg-pink-100 border-pink-200",
  "bg-purple-100 border-purple-200",
  "bg-orange-100 border-orange-200",
  "bg-teal-100 border-teal-200",
  "bg-red-100 border-red-200",
];

/**
 * 留言墙页面（/wall）
 * 公开页面，无需登录即可查看所有留言。
 * 已登录用户可发表新留言（最多 200 字）。
 */
export default function WallPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 加载留言列表
  useEffect(() => {
    fetch("/api/wall")
      .then((res) => res.json())
      .then(setMessages)
      .catch(() => setError("加载留言失败"));
  }, []);

  // 发表留言
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > 200) {
      setError("内容最多200字");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "发布失败");
        return;
      }

      const newMsg = await res.json();
      setMessages((prev) => [newMsg, ...prev]);
      setContent("");
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-warm-800 mb-2">
        留言墙
      </h1>
      <p className="text-gray-500 text-sm md:text-base mb-8">
        在这里留下你想说的话。
      </p>

      {/* 留言输入区（仅登录用户可见） */}
      {session?.user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 md:p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">
              以{" "}
              <span className="text-warm-600 font-medium">
                {session.user.name || "用户"}
              </span>{" "}
              的身份留言
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent resize-none text-sm"
            placeholder="写下你想说的话..."
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {content.length}/200
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white text-sm font-medium px-6 py-2.5 min-h-[44px] rounded-lg transition-colors"
            >
              {submitting ? "发布中..." : "贴上去"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-warm-100 p-6 text-center mb-8">
          <p className="text-gray-400 text-sm">
            请先{" "}
            <Link href="/login" className="text-warm-500 underline">
              登录
            </Link>{" "}
            后留下你的话
          </p>
        </div>
      )}

      {/* 留言便利贴墙 */}
      {messages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((msg, i) => {
            const color = COLORS[i % COLORS.length];
            // 随机旋转角度（-2 到 2 度）
            const rotate = ((i * 3) % 5) - 2;
            return (
              <div
                key={msg.id}
                className={`${color} border rounded-lg p-4 shadow-sm`}
                style={{ transform: `rotate(${rotate}deg)` }}
              >
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {msg.authorName}
                  </span>
                  <time className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">
            还没有留言，来做第一个留下印记的人吧
          </p>
        </div>
      )}
    </div>
  );
}