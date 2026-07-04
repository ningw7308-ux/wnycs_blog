"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  anonymous: boolean;
  author: { name: string | null };
  createdAt: string;
  _count: { likes: number };
}

interface SearchPostsProps {
  posts: Post[];
}

/**
 * SearchPosts 客户端组件
 * 使用 fuse.js 对文章标题和摘要做模糊搜索。
 * 输入时实时过滤文章列表，清空时恢复全部。
 */
export default function SearchPosts({ posts }: SearchPostsProps) {
  const [query, setQuery] = useState("");

  // 初始化 fuse.js 实例
  const fuse = new Fuse(posts, {
    keys: ["title", "excerpt"],
    threshold: 0.4, // 0=精确匹配, 1=宽松匹配。0.4 适中
    includeScore: true,
  });

  // 根据搜索词过滤文章
  const filteredPosts =
    query.trim() === ""
      ? posts
      : fuse.search(query.trim()).map((result) => result.item);

  return (
    <div>
      {/* 搜索框 */}
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章标题或内容..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent text-sm"
        />
        {query.trim() && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >
            ✕
          </button>
        )}
      </div>

      {/* 搜索结果提示 */}
      {query.trim() && (
        <p className="text-sm text-gray-400 mb-4">
          找到 {filteredPosts.length} 篇相关记录
          {filteredPosts.length === 0 && (
            <span className="ml-1">—— 试试其他关键词？</span>
          )}
        </p>
      )}

      {/* 文章列表 */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              author={
                post.anonymous
                  ? "匿名"
                  : (post.author.name || "匿名用户")
              }
              createdAt={post.createdAt}
              likeCount={post._count.likes}
            />
          ))}
        </div>
      ) : (
        query.trim() && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">没有找到相关记录</p>
            <p className="text-gray-300 text-sm mt-2">
              试试用不同的关键词搜索
            </p>
          </div>
        )
      )}
    </div>
  );
}