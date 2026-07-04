import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PostContentClient from "@/components/PostContentClient";
import OnlineCounter from "@/components/OnlineCounter";

export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  let userLiked = false;
  if (session?.user?.id) {
    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId: post.id, userId: session.user.id } },
    });
    userLiked = !!existingLike;
  }

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { commentLikes: true } },
    },
  });

  const commentsWithLikes = comments.map((c) => ({
    id: c.id,
    content: c.content,
    author: c.author,
    createdAt: c.createdAt.toISOString(),
    _count: { commentLikes: c._count.commentLikes },
    userLiked: false,
  }));

  if (session?.user?.id) {
    const commentIds = comments.map((c) => c.id);
    const userCommentLikes = await prisma.commentLike.findMany({
      where: { commentId: { in: commentIds }, userId: session.user.id },
      select: { commentId: true },
    });
    const likedIds = new Set(userCommentLikes.map((l) => l.commentId));
    commentsWithLikes.forEach((c) => { c.userLiked = likedIds.has(c.id); });
  }

  const date = post.createdAt;
  const formattedDate = `${date.getFullYear()}·${String(date.getMonth() + 1).padStart(2, "0")}·${String(date.getDate()).padStart(2, "0")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <Link
        href="/posts"
        className="text-xs tracking-wider uppercase text-marble-500/60 hover:text-roman-red-700 transition-colors mb-6 inline-block"
      >
        &larr; 文章
      </Link>

      <article className="card card-dark overflow-hidden">
        {/* 文章信息区 */}
        <div className="p-4 md:p-8 pb-4 border-b border-stone-200/30">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-marble-800 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-marble-500/60">
            <div className="flex items-center gap-2">
              {post.anonymous ? (
                <span>匿名</span>
              ) : (
                <span>{post.author.name || "匿名"}</span>
              )}
              <span className="text-marble-400/40">|</span>
              <time>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {post._count.likes} 赞
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {post._count.comments} 回应
              </span>
            </div>
          </div>
        </div>

        <PostContentClient
          postContent={post.content}
          slug={params.slug}
          initialLiked={userLiked}
          initialLikeCount={post._count.likes}
          initialComments={commentsWithLikes}
        />
      </article>

      <div className="mt-6">
        <OnlineCounter />
      </div>
    </div>
  );
}