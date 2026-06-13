import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "温暖空间 - 心理互助博客平台",
  description: "一个温暖的心理互助社区，分享治愈故事与心灵感悟",
};

/**
 * 根布局
 * Providers 包裹全站，使所有客户端组件都能通过 useSession 获取登录状态。
 * 结构：导航栏 → 主内容 → 页脚
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}