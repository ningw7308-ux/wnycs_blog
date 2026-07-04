"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

/**
 * 文章表单校验规则
 */
const postSchema = z.object({
  title: z
    .string()
    .min(1, "标题不能为空")
    .max(100, "标题最多100个字符"),
  content: z
    .string()
    .min(1, "内容不能为空")
    .max(20000, "内容最多20000个字符"),
  anonymous: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

/**
 * 写新文章页面（/new-post）
 * 需要登录。表单收集标题、内容（Markdown）、匿名选项。
 * 提交到 /api/posts，成功后跳转到文章详情页。
 */
export default function NewPostPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      anonymous: false,
    },
  });

  const onSubmit = async (data: PostForm) => {
    setServerError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error || "发布失败");
        return;
      }

      const post = await res.json();
      router.push(`/posts/${post.slug}`);
    } catch {
      setServerError("网络错误，请稍后重试");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-warm-800 mb-2">写新文章</h1>
      <p className="text-gray-500 text-sm md:text-base mb-8">
        记录下你的感受与思考。
      </p>

      {/* 服务端错误提示 */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500 text-sm">{serverError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 md:p-8 space-y-6"
      >
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            文章标题 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
            placeholder="给你的文章起一个标题..."
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* 内容（Markdown textarea） */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            文章内容 <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            支持 Markdown 格式：**加粗**、*斜体*、## 标题、[链接](url) 等
          </p>
          <textarea
            {...register("content")}
            rows={12}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent resize-none font-mono text-sm"
            placeholder="写下你想分享的故事...&#10;&#10;## 今天的心情&#10;&#10;今天阳光很好，我决定..."
          />
          {errors.content && (
            <p className="text-red-400 text-xs mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 匿名复选框 */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              {...register("anonymous")}
              className="w-4 h-4 rounded border-gray-300 text-warm-500 focus:ring-warm-400 accent-warm-500"
            />
            匿名发布
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            勾选后，文章将不显示你的真实姓名，改为显示&ldquo;匿名&rdquo;。
          </p>
        </div>

        {/* 提交按钮：移动端至少 44px 高度 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white font-medium py-3 min-h-[44px] rounded-lg transition-colors"
        >
          {isSubmitting ? "发布中..." : "发布文章"}
        </button>
      </form>
    </div>
  );
}