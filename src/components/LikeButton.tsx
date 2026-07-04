"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface LikeButtonProps {
  slug: string;
  initialLiked: boolean;
  initialLikeCount: number;
}

export default function LikeButton({
  slug,
  initialLiked,
  initialLikeCount,
}: LikeButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!session?.user) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      try {
        const res = await fetch(`/api/posts/${slug}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setLiked(liked);
          setLikeCount(likeCount);
          return;
        }

        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        router.refresh();
      } catch {
        setLiked(liked);
        setLikeCount(likeCount);
      }
    });
  };

  return (
    <div className="card card-dark p-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleToggle}
          disabled={isPending || !session?.user}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wider uppercase transition-all ${
            liked
              ? "bg-roman-red-700 text-white"
              : "border border-stone-300 text-marble-600/70 hover:border-roman-red-700 hover:text-roman-red-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg
            className="w-4 h-4"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {liked ? "已赞" : "赞"}
        </button>

        <span className="text-base font-medium text-marble-700">
          {likeCount} 赞
        </span>
      </div>

      {!session?.user && (
        <p className="text-center text-xs text-marble-500/60 mt-3">
          <Link
            href={`/login?callbackUrl=/posts/${slug}`}
            className="text-roman-red-700 hover:underline"
          >
            登录
          </Link>{" "}
          后可以点赞
        </p>
      )}
    </div>
  );
}