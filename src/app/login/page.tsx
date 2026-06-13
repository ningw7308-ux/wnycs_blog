"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

/**
 * 登录表单校验规则
 */
const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符"),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * 登录页面
 * 使用 Auth.js v5 的 Credentials 提供者进行邮箱+密码登录。
 * 登录成功后跳转到首页。
 */
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-warm-800 mb-6">
          登录温暖空间
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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