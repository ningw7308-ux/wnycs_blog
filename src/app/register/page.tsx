"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

/**
 * 注册表单校验规则
 */
const registerSchema = z
  .object({
    name: z.string().min(2, "昵称至少2个字符"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少6个字符"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

/**
 * 注册页面
 * 用户填写昵称、邮箱、密码完成注册。
 * 认证流程：
 * 1. 前端 react-hook-form + zod 校验表单（邮箱格式、密码长度、确认密码一致）
 * 2. 提交调用 POST /api/register
 * 3. 后端检查邮箱唯一性 → bcrypt 加密密码 → prisma.user.create 存入
 * 4. 成功后自动跳转到 /login
 */
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "注册失败");
        return;
      }

      router.push("/login");
    } catch {
      setError("网络错误，请稍后重试");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-warm-800 mb-6">
          注册为作者
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 py-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              昵称
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
              placeholder="你的昵称"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
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

          {/* 确认密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              确认密码
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          已有账号？{" "}
          <Link href="/login" className="text-warm-500 hover:underline">
            去登录
          </Link>
        </p>
      </div>
    </div>
  );
}