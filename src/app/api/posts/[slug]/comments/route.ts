import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * GET /api/posts/[slug]/comments
 * 获取指定文章的所有评论，含作者信息，按时间正序排列。
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    logger.error({ err: error }, "获取评论失败");
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 });
  }
}

/**
 * POST /api/posts/[slug]/comments
 * 创建新评论。需要登录。
 * 请求体：{ content: string }
 */
export async function POST(
  request: Request,
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

    // 3. 解析请求体
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "评论内容不能为空" }, { status: 400 });
    }

    // 4. 创建评论
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: post.id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    logger.info({ userId: session.user.id, commentId: comment.id, postId: post.id }, "评论发布");

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    logger.error({ err: error }, "创建评论失败");
    return NextResponse.json({ error: "创建评论失败" }, { status: 500 });
  }
}