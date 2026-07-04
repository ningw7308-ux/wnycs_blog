"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于" },
    { href: "/rss.xml", label: "RSS" },
  ];

  const linkClass = (href: string) =>
    `text-xs tracking-widest uppercase font-medium transition-colors ${
      pathname === href
        ? "text-roman-red-700"
        : "text-marble-700/80 hover:text-roman-red-700"
    }`;

  const mobileLinkClass = (href: string) =>
    `block px-4 py-2.5 text-sm tracking-wider uppercase transition-colors ${
      pathname === href
        ? "text-roman-red-700 bg-stone-100/50"
        : "text-marble-700/80 hover:text-roman-red-700 hover:bg-stone-100/30"
    }`;

  return (
    <header className="bg-stone-50/70 backdrop-blur-md border-b border-stone-200/40 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        {/* 站点名称 + 猫头鹰标识 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-serif font-bold text-marble-800 shrink-0"
        >
          <span className="text-lg" role="img" aria-label="owl">
            🦉
          </span>
          <span className="tracking-wide">wnycs</span>
        </Link>

        {/* ───── 桌面端导航（md+） ───── */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          {isLoading ? null : session ? (
            <div className="flex items-center gap-4">
              {/* 写文章 — 图标 */}
              <Link href="/new-post" title="写文章" className="text-marble-600/70 hover:text-roman-red-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              {/* 设置 — 图标 */}
              <Link href="/settings" title="设置" className="text-marble-600/70 hover:text-roman-red-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs tracking-wider uppercase text-marble-500/60 hover:text-roman-red-700 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs tracking-wider uppercase text-marble-600/70 hover:text-roman-red-700 transition-colors">
                登录
              </Link>
              <Link href="/register" className="text-xs tracking-wider uppercase border border-roman-red-700 text-roman-red-700 hover:bg-roman-red-700 hover:text-white px-3 py-1 transition-colors">
                注册
              </Link>
            </div>
          )}
        </nav>

        {/* ───── 移动端汉堡按钮（<md） ───── */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 -mr-2 text-marble-600/70 hover:text-roman-red-700 transition-colors"
          aria-label="菜单"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ───── 移动端下拉菜单（<md） ───── */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200/30 bg-stone-50/90 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
            {isLoading ? null : session ? (
              <>
                <Link href="/new-post" onClick={() => setMenuOpen(false)} className={mobileLinkClass("/new-post")}>
                  写文章
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className={mobileLinkClass("/settings")}>
                  设置
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block w-full text-left px-4 py-2.5 text-sm text-marble-500/60 hover:text-roman-red-700 transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm tracking-wider uppercase py-2.5 border border-stone-300 text-marble-600/70 hover:bg-stone-100/50 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm tracking-wider uppercase bg-roman-red-700 hover:bg-roman-red-800 text-white py-2.5 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}