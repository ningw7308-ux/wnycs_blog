"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  author: { name: string | null };
  createdAt: string;
  _count: { commentLikes: number };
  userLiked: boolean;
}

interface CommentSectionProps {
  slug: string;
  initialComments: Comment[];
  highlightedText?: string;
  onHighlightConsumed?: () => void;
}

function renderCommentContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let quoteLines: string[] = [];
  let normalLines: string[] = [];

  const flushNormal = () => {
    if (normalLines.length > 0) {
      elements.push(
        <p key={elements.length} className="text-sm text-marble-600/80 whitespace-pre-wrap leading-relaxed">
          {normalLines.join("\n")}
        </p>
      );
      normalLines = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length > 0) {
      const text = quoteLines.map((l) => l.replace(/^>\s?/, "")).join("\n");
      elements.push(
        <blockquote
          key={elements.length}
          className="border-l-2 border-roman-red-700/40 bg-stone-100/50 pl-4 py-2 my-2 text-sm text-marble-500/70 italic"
        >
          {text}
        </blockquote>
      );
      quoteLines = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith(">")) {
      flushNormal();
      quoteLines.push(line);
    } else {
      if (quoteLines.length > 0) flushQuote();
      normalLines.push(line);
    }
  });

  flushQuote();
  flushNormal();

  return elements;
}

export default function CommentSection({
  slug,
  initialComments,
  highlightedText,
  onHighlightConsumed,
}: CommentSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (highlightedText) {
      const quote = `> ${highlightedText}\n\n`;
      setContent((prev) => {
        if (prev.includes(highlightedText)) return prev;
        return quote + prev;
      });
      textareaRef.current?.focus();
    }
  }, [highlightedText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      setError("请先登录后再回应");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) return;

    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      content: trimmed,
      author: { name: session.user.name || null },
      createdAt: new Date().toISOString(),
      _count: { commentLikes: 0 },
      userLiked: false,
    };

    startTransition(async () => {
      setComments((prev) => [...prev, optimisticComment]);
      setContent("");
      onHighlightConsumed?.();

      try {
        const res = await fetch(`/api/posts/${slug}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: trimmed }),
        });

        if (!res.ok) {
          const json = await res.json();
          setError(json.error || "回应失败");
          setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
          return;
        }

        const newComment = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === optimisticComment.id
              ? { ...newComment, _count: { commentLikes: 0 }, userLiked: false }
              : c
          )
        );
        router.refresh();
      } catch {
        setError("网络错误，请稍后重试");
        setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      }
    });
  };

  const handleCommentLike = async (commentId: string) => {
    if (!session?.user) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const newLiked = !c.userLiked;
        return {
          ...c,
          userLiked: newLiked,
          _count: { commentLikes: c._count.commentLikes + (newLiked ? 1 : -1) },
        };
      })
    );

    startTransition(async () => {
      try {
        const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
        if (!res.ok) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id !== commentId) return c;
              const newLiked = !c.userLiked;
              return { ...c, userLiked: !newLiked, _count: { commentLikes: c._count.commentLikes + (newLiked ? -1 : 1) } };
            })
          );
          return;
        }
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, userLiked: data.liked, _count: { commentLikes: data.likeCount } } : c))
        );
        router.refresh();
      } catch {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id !== commentId) return c;
            const newLiked = !c.userLiked;
            return { ...c, userLiked: !newLiked, _count: { commentLikes: c._count.commentLikes + (newLiked ? -1 : 1) } };
          })
        );
      }
    });
  };

  return (
    <section className="card card-dark p-6 md:p-8">
      <h2 className="font-serif text-lg font-semibold text-marble-800 mb-6 tracking-wide">
        回应 ({comments.length})
      </h2>

      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-stone-200/30 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-marble-700">
                  {comment.author.name || "匿名"}
                </span>
                <time className="text-xs text-marble-500/50">
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN", {
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </time>
              </div>
              <div>{renderCommentContent(comment.content)}</div>
              <div className="mt-2 flex items-center gap-1">
                <button
                  onClick={() => handleCommentLike(comment.id)}
                  disabled={!session?.user || isPending}
                  className={`flex items-center gap-1 text-xs transition-colors ${
                    comment.userLiked ? "text-roman-red-700" : "text-marble-400/50 hover:text-roman-red-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg className="w-3 h-3" fill={comment.userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {comment._count.commentLikes > 0 && <span>{comment._count.commentLikes}</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <p className="text-marble-500/50 text-sm">还没有回应</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <p className="text-roman-red-700 text-sm">
            {error === "请先登录后再回应" ? (
              <>
                请先{" "}
                <Link href={`/login?callbackUrl=/posts/${slug}`} className="text-roman-red-700 underline">
                  登录
                </Link>{" "}
                后再回应
              </>
            ) : (
              error
            )}
          </p>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-stone-200/50 bg-stone-50/30 rounded-sm focus:border-roman-red-700 focus:ring-1 focus:ring-roman-red-700/30 resize-none text-sm font-mono text-marble-700 placeholder:text-marble-400/50"
          placeholder={session?.user ? "写下你的回应...（选中文章文字可划线评论）" : "登录后发表回应..."}
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="bg-roman-red-700 hover:bg-roman-red-800 disabled:bg-marble-300 text-white text-xs tracking-wider uppercase font-medium px-6 py-2.5 transition-colors"
        >
          {isPending ? "发送中..." : "发送回应"}
        </button>
      </form>
    </section>
  );
}