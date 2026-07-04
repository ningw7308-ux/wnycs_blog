import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * POST /api/comments/[id]/like
 * 评论点赞 Toggle：已点过 → 取消；未点过 → 点赞。
 * 返回：{ liked: boolean, likeCount: number }
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 验证登录
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 2. 验证评论存在
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "评论不存在" }, { status: 404 });
    }

    const userId = session.user.id;
    const commentId = comment.id;

    // 3. Toggle 逻辑
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: { commentId, userId },
      },
    });

    if (existingLike) {
      // 已点赞 → 取消
      await prisma.commentLike.delete({
        where: { id: existingLike.id },
      });
      logger.info({ userId, commentId }, "评论取消点赞");
    } else {
      // 未点赞 → 创建
      await prisma.commentLike.create({
        data: { commentId, userId },
      });
      logger.info({ userId, commentId }, "评论点赞");
    }

    // 4. 获取最新点赞数
    const likeCount = await prisma.commentLike.count({
      where: { commentId },
    });

    return NextResponse.json({
      liked: !existingLike,
      likeCount,
    });
  } catch (error) {
    logger.error({ err: error }, "评论点赞操作失败");
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}