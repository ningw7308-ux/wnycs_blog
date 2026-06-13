"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Providers 组件
 * 包裹 SessionProvider，让全站客户端组件都能通过 useSession() 获取登录状态。
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}