import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * POST /api/posts/[slug]/like
 * 点赞 Toggle：如果已经点过赞 → 取消；否则 → 点赞。
 * 返回：{ liked: boolean, likeCount: number }
 */
export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. 验证登录状态
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 2. 查找文章
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    const userId = session.user.id;
    const postId = post.id;

    // 3. Toggle 逻辑：检查是否已点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingLike) {
      // 已点赞 → 取消
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      logger.info({ userId, postId }, "文章取消点赞");
    } else {
      // 未点赞 → 创建
      await prisma.like.create({
        data: { postId, userId },
      });
      logger.info({ userId, postId }, "文章点赞");
    }

    // 4. 获取最新点赞数
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      liked: !existingLike,
      likeCount,
    });
  } catch (error) {
    logger.error({ err: error }, "文章点赞操作失败");
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}