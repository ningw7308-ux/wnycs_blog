"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

interface Comment {
  id: string;
  content: string;
  author: { name: string | null };
  createdAt: string;
  _count: { commentLikes: number };
  userLiked: boolean;
}

interface PostContentClientProps {
  postContent: string;
  slug: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialComments: Comment[];
}

/**
 * PostContentClient 客户端组件
 * 包裹文章内容的交互部分：划线评论 + 点赞 + 评论区。
 *
 * 划线评论流程：
 * 1. 用户选中文章文字 → 弹出浮动按钮
 * 2. 点击按钮 → 评论区输入框获得焦点，自动附加引用
 * 3. 引用格式：> 选中的文字\n\n
 */
export default function PostContentClient({
  postContent,
  slug,
  initialLiked,
  initialLikeCount,
  initialComments,
}: PostContentClientProps) {
  const [highlightedText, setHighlightedText] = useState("");
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  /** 处理文本选中（鼠标松开 / 触摸结束） */
  const handleSelection = useCallback(() => {
    // 延迟执行，确保 selection 已更新
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setShowFloatingBtn(false);
        return;
      }

      // 确保选中内容在文章区域内
      const range = selection.getRangeAt(0);
      if (!contentRef.current?.contains(range.commonAncestorContainer)) {
        setShowFloatingBtn(false);
        return;
      }

      const rect = range.getBoundingClientRect();
      // 按钮放在选中文字上方中间
      setFloatPos({
        x: rect.left + rect.width / 2 - 50, // 居中偏移（按钮宽约100px）
        y: rect.top - 40 + window.scrollY,  // 在选中文字上方40px
      });
      setShowFloatingBtn(true);
    }, 50);
  }, []);

  /** 点击"划线评论"按钮 */
  const handleQuoteClick = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString().trim();
    if (!text) return;

    // 将选中文字作为引用传入 CommentSection
    setHighlightedText(text);
    setShowFloatingBtn(false);
    selection.removeAllRanges();
  };

  /** 点击空白处隐藏浮动按钮 */
  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".highlight-btn")) return;
    setShowFloatingBtn(false);
  };

  return (
    <div onClick={handleClickOutside}>
      {/* 文章内容区域（可选中文字） */}
      <div
        ref={contentRef}
        onMouseUp={handleSelection}
        onTouchEnd={handleSelection}
        className="p-4 md:p-8 prose max-w-none text-marble-700"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {postContent}
        </ReactMarkdown>
      </div>

      {/* 浮动按钮（选中文字后显示） */}
      {showFloatingBtn && (
        <div
          className="highlight-btn fixed z-50"
          style={{
            left: `${floatPos.x}px`,
            top: `${floatPos.y}px`,
          }}
        >
          <button
            onClick={handleQuoteClick}
            className="bg-roman-red-700 hover:bg-roman-red-800 text-white text-xs font-medium px-3 py-1.5 shadow-lg transition-colors whitespace-nowrap"
          >
            划线评论
          </button>
        </div>
      )}

      {/* 点赞按钮 */}
      <LikeButton
        slug={slug}
        initialLiked={initialLiked}
        initialLikeCount={initialLikeCount}
      />

      {/* 评论区（接收引用文字） */}
      <CommentSection
        slug={slug}
        initialComments={initialComments}
        highlightedText={highlightedText}
        onHighlightConsumed={() => setHighlightedText("")}
      />
    </div>
  );
}