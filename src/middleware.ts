export const runtime = "nodejs";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * 认证中间件
 * 保护需要登录的路由：/profile、/new-post
 * 未登录用户访问这些页面时，自动重定向到 /login。
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 需要登录才能访问的路由
  const protectedPaths = ["/profile", "/new-post", "/settings"];
  const isProtectedRoute = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 未登录且访问受保护路由 → 重定向到登录页
  if (!req.auth && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录且访问登录/注册页 → 重定向到首页（可选）
  if (req.auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

/**
 * 中间件匹配规则：排除静态资源和 API 路由。
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};