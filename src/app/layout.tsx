import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import InlineStyles from "@/components/InlineStyles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "个人博客",
  description: "个人博客 - 展示简历和研究内容",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* 预加载关键CSS */}
        <link rel="preload" href="./static/css/main.css" as="style" />
      </head>
      <body className={inter.className}>
        {/* 添加内联样式，即使外部CSS加载失败也能显示基本样式 */}
        <InlineStyles />
        <Navbar />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
