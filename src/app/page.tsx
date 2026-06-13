"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-warm-800 mb-4">
          欢迎来到温暖空间
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
          一个温暖的心理互助社区，在这里分享你的故事，感受彼此的温度。
        </p>
        <Link
          href="/posts"
          className="inline-block bg-warm-500 hover:bg-warm-600 text-white text-lg font-medium px-8 py-3 rounded-full transition-colors shadow-lg hover:shadow-xl"
        >
          进入记录
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 text-gray-400 text-sm"
      >
        <p className="italic">
          &ldquo;万物皆有裂痕，那是光照进来的地方。&rdquo; —— 莱昂纳德·科恩
        </p>
      </motion.div>
    </div>
  );
}