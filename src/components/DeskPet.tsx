"use client";

import { useState, useEffect, useCallback } from "react";

/** 桌宠样式定义 */
const PET_STYLES = [
  { key: "cat", emoji: "🐱", label: "猫咪", css: "text-4xl" },
  { key: "dog", emoji: "🐶", label: "小狗", css: "text-4xl" },
  { key: "plant", emoji: "🪴", label: "盆栽", css: "text-4xl" },
  { key: "pixel", emoji: "👾", label: "像素小人", css: "text-4xl" },
  { key: "ghost", emoji: "👻", label: "小幽灵", css: "text-4xl" },
] as const;

export type PetStyle = (typeof PET_STYLES)[number]["key"];

/** 鼓励气泡内容 */
const BUBBLES = [
  "你今天真棒！✨",
  "一切都会好起来的 🌈",
  "你已经做得很好了 💪",
  "深呼吸，放轻松 🍃",
  "你是独一无二的 🌟",
  "今天也要好好爱自己哦 💕",
  "没关系，慢慢来 🐢",
  "你的感受很重要 🤗",
  "记得给自己一个拥抱 🫂",
  "阳光总在风雨后 ☀️",
];

interface DeskPetProps {
  /** 外部传入的样式选择（从 localStorage 读取） */
  initialStyle?: PetStyle;
}

/**
 * DeskPet 桌宠组件
 * 固定在页面右下角，不随滚动消失。
 * 特性：
 * - 5 种样式可选（猫/狗/盆栽/像素小人/小幽灵）
 * - 每 5 秒自动跳一下或摇一摇
 * - 点击显示随机鼓励气泡，2 秒后消失
 * - 移动端自动变小 + 半透明
 */
export default function DeskPet({ initialStyle = "cat" }: DeskPetProps) {
  const [style, setStyle] = useState<PetStyle>(initialStyle);
  const [animating, setAnimating] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [visible, setVisible] = useState(true);

  // 从 localStorage 读取样式和隐藏状态
  useEffect(() => {
    const saved = localStorage.getItem("deskpet-style") as PetStyle | null;
    if (saved && PET_STYLES.some((s) => s.key === saved)) {
      setStyle(saved);
    }
    const hidden = localStorage.getItem("deskpet-hidden");
    if (hidden === "true") {
      setVisible(false);
    }
  }, []);

  // 监听外部样式变更（通过自定义事件）
  useEffect(() => {
    const handler = (e: CustomEvent<PetStyle>) => {
      setStyle(e.detail);
      localStorage.setItem("deskpet-style", e.detail);
    };
    window.addEventListener("deskpet-style-change", handler as EventListener);
    return () =>
      window.removeEventListener("deskpet-style-change", handler as EventListener);
  }, []);

  // 监听隐藏/显示事件
  useEffect(() => {
    const handler = (e: CustomEvent<boolean>) => {
      setVisible(e.detail);
      localStorage.setItem("deskpet-hidden", String(!e.detail));
    };
    window.addEventListener("deskpet-visibility-change", handler as EventListener);
    return () =>
      window.removeEventListener("deskpet-visibility-change", handler as EventListener);
  }, []);

  // 每 5 秒动画
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentPet = PET_STYLES.find((s) => s.key === style) || PET_STYLES[0];

  /** 点击桌宠：显示随机鼓励气泡 */
  const handleClick = useCallback(() => {
    const randomBubble = BUBBLES[Math.floor(Math.random() * BUBBLES.length)];
    setBubble(randomBubble);
    setBubbleVisible(true);
    setTimeout(() => setBubbleVisible(false), 2000);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* 桌宠本体 */}
      <div
        className="fixed bottom-6 right-6 z-40 cursor-pointer select-none
                   md:bottom-6 md:right-6
                   max-md:bottom-4 max-md:right-4 max-md:opacity-70 max-md:scale-75"
        onClick={handleClick}
        title="点击我获取鼓励 ✨"
      >
        {/* 鼓励气泡 */}
        {bubble && (
          <div
            className={`absolute -top-16 right-0 bg-white shadow-lg rounded-2xl px-4 py-2 text-sm text-gray-800 whitespace-nowrap
                       transition-all duration-300 ${
                         bubbleVisible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-2"
                       }`}
          >
            {bubble}
            {/* 气泡小三角 */}
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white rotate-45 shadow-sm" />
          </div>
        )}

        {/* 桌宠 emoji + 动画 */}
        <div
          className={`w-14 h-14 bg-white rounded-full shadow-lg border-2 border-stone-300
                     flex items-center justify-center
                     hover:shadow-xl hover:scale-110 transition-all duration-200
                     ${currentPet.css} ${
            animating ? "animate-bounce" : ""
          }`}
        >
          {currentPet.emoji}
        </div>
      </div>
    </>
  );
}

/** 获取可用的桌宠样式列表（供 settings 页面使用） */
export { PET_STYLES, BUBBLES };