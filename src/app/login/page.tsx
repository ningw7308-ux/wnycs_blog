"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

/**
 * 登录表单校验规则
 * - email: 必须是合法邮箱格式
 * - password: 至少 6 个字符
 */
const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * 登录表单组件（实际内容）
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  // 从 URL 中获取 callbackUrl（中间件重定向时附带），默认跳转到 /posts
  const callbackUrl = searchParams.get("callbackUrl") || "/posts";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");

    // 调用 Auth.js 的 signIn("credentials", ...) 登录
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // 手动控制跳转，以便处理错误
    });

    if (result?.error) {
      // 显示错误信息（密码错误、用户不存在等）
      setError("邮箱或密码错误");
      return;
    }

    // 登录成功：跳转到 callbackUrl（或默认 /posts）
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-warm-800 mb-6">
          登录温暖空间
        </h1>

        {/* 错误提示 */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              邮箱
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              密码
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 提交按钮（显示加载状态） */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "登录中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          还没有账号？{" "}
          <Link href="/register" className="text-warm-500 hover:underline">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * 登录页面
 * 使用 Suspense 包裹，因为 useSearchParams 需要。
 * 认证流程：
 * 1. 用户输入邮箱 + 密码
 * 2. 调用 signIn("credentials", ...)
 * 3. NextAuth 触发 auth.ts 中的 authorize 函数
 * 4. authorize 查询数据库比对密码
 * 5. 成功 → 生成 JWT → 写入 cookie → 跳转回 callbackUrl
 * 6. 失败 → 返回 null → 显示错误信息
 */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}