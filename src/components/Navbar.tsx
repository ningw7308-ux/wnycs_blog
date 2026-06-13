"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

/**
 * Navbar 导航栏组件
 * - 未登录：显示 "登录" 和 "注册" 按钮
 * - 已登录：显示 "写文章"、"个人"、"退出"
 *
 * 认证状态通过 useSession() 获取，
 * 该 hook 依赖 layout.tsx 中的 <Providers> 包裹。
 */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/posts", label: "记录" },
    { href: "/quotes", label: "治愈语录" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-warm-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-16">
        {/* 站点名称 */}
        <Link href="/" className="text-xl font-bold text-warm-600">
          温暖空间
        </Link>

        <nav className="flex items-center gap-6">
          {/* 公共导航链接 */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-warm-600"
                  : "text-gray-500 hover:text-warm-500"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* 认证状态区域：加载时不显示，避免闪烁 */}
          {isLoading ? null : session ? (
            /* ───── 已登录状态 ───── */
            <>
              <Link
                href="/new-post"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/new-post"
                    ? "text-warm-600"
                    : "text-gray-500 hover:text-warm-500"
                }`}
              >
                写文章
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/profile"
                    ? "text-warm-600"
                    : "text-gray-500 hover:text-warm-500"
                }`}
              >
                个人
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            /* ───── 未登录状态 ───── */
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-500 hover:text-warm-500 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm bg-warm-500 hover:bg-warm-600 text-white px-4 py-1.5 rounded-full transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}