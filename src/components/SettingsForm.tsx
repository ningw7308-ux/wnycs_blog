"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PET_STYLES, type PetStyle } from "@/components/DeskPet";

const settingsSchema = z.object({
  name: z.string().min(1, "昵称不能为空").max(50, "昵称最多50个字符"),
  bio: z.string().max(200, "简介最多200个字符").optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialName: string;
  initialBio: string;
  email: string;
}

/**
 * SettingsForm 客户端组件
 * 编辑昵称、个人简介 + 桌宠样式选择。
 */
export default function SettingsForm({
  initialName,
  initialBio,
  email,
}: SettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [petStyle, setPetStyle] = useState<PetStyle>("cat");
  const [petHidden, setPetHidden] = useState(false);

  // 从 localStorage 读取当前桌宠样式和隐藏状态
  useEffect(() => {
    const saved = localStorage.getItem("deskpet-style") as PetStyle | null;
    if (saved && PET_STYLES.some((s) => s.key === saved)) {
      setPetStyle(saved);
    }
    const hidden = localStorage.getItem("deskpet-hidden");
    setPetHidden(hidden === "true");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialName,
      bio: initialBio || "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setServerError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error || "保存失败");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setServerError("网络错误，请稍后重试");
    }
  };

  /** 切换桌宠样式 */
  const handlePetChange = (style: PetStyle) => {
    setPetStyle(style);
    localStorage.setItem("deskpet-style", style);
    window.dispatchEvent(new CustomEvent("deskpet-style-change", { detail: style }));
  };

  /** 切换桌宠显示/隐藏 */
  const handlePetVisibility = (hidden: boolean) => {
    setPetHidden(hidden);
    localStorage.setItem("deskpet-hidden", String(hidden));
    window.dispatchEvent(new CustomEvent("deskpet-visibility-change", { detail: !hidden }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-warm-800 mb-2">账号设置</h1>
      <p className="text-gray-500 mb-8">编辑你的个人信息。</p>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">保存成功</p>
        </div>
      )}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500 text-sm">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-warm-100 p-4 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">昵称</label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent"
            placeholder="你的昵称"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">个人简介</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent resize-none text-sm"
            placeholder="写一段简短的个人介绍..."
          />
          {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">邮箱</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-warm-500 hover:bg-warm-600 disabled:bg-warm-300 text-white font-medium px-8 py-3 min-h-[44px] rounded-lg transition-colors"
        >
          {isSubmitting ? "保存中..." : "保存修改"}
        </button>
      </form>

      {/* 桌宠样式选择 */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-warm-100 p-8">
        <h2 className="text-lg font-semibold text-warm-800 mb-4">桌宠样式</h2>
        <p className="text-sm text-gray-400 mb-6">
          选择一个你喜欢的桌宠。
        </p>
        <div className="flex flex-wrap gap-3">
          {PET_STYLES.map((pet) => (
            <button
              key={pet.key}
              onClick={() => handlePetChange(pet.key)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                petStyle === pet.key
                  ? "border-warm-500 bg-warm-50 shadow-sm"
                  : "border-gray-100 hover:border-warm-200"
              }`}
            >
              <span className="text-3xl">{pet.emoji}</span>
              <span className="text-xs text-gray-500">{pet.label}</span>
            </button>
          ))}
        </div>

        {/* 桌宠显示/隐藏 */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-600">显示桌宠</span>
            <button
              type="button"
              onClick={() => handlePetVisibility(!petHidden)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                !petHidden ? "bg-roman-red-700" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  !petHidden ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}