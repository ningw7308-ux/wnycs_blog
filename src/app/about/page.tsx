import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-marble-800 mb-12 tracking-wide">
        关于
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* 左侧素描 */}
        <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3/4" }}>
          <Image
            src="https://images.unsplash.com/photo-1720031995239-59ea92430cea?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=europeana-tQmSK2-WxGA-unsplash.jpg"
            alt="素描"
            fill
            className="opacity-85 hover:opacity-100 transition-opacity object-cover"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 60%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 60%)",
            }}
          />
        </div>

        {/* 右侧介绍 */}
        <div className="flex flex-col justify-center">
          <h2 className="font-serif text-2xl font-semibold text-marble-800 mb-4 tracking-wide">
            仰春氏
          </h2>
          <div className="w-12 h-px bg-roman-red-700/40 mb-6" />
          <div className="space-y-4 text-marble-600/80 text-sm leading-relaxed">
            <p>
              一个学习者、思考者、创造者。在这里记录学习过程中的问题和发现，构建个人知识体系，并分享出去。
            </p>
            <p>
              你可以在这里找到关于技术、哲学、以及生活本身的随笔，以及一些实用的工具。
            </p>
            <p>
              
            </p>
          </div>

          <div className="mt-8 space-y-2 text-xs text-marble-500/60">
            <p>
              联系：<a href="mailto:hi@wnycs.com" className="text-roman-red-700 hover:underline">hi@wnycs.com</a>
            </p>
            <p>
              <a href="/rss.xml" className="text-roman-red-700 hover:underline">RSS 订阅</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}