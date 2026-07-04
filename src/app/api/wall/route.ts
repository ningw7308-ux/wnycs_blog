import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * GET /api/wall
 * 获取全部留言，按时间倒序排列（最新的在前）。
 * 公开接口，无需登录。
 */
export async function GET() {
  try {
    const messages = await prisma.wallMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(
      messages.map((m) => ({
        id: m.id,
        content: m.content,
        authorName: m.user.name || "匿名用户",
        createdAt: m.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    logger.error({ err: error }, "获取留言墙数据失败");
    return NextResponse.json({ error: "获取留言失败" }, { status: 500 });
  }
}

/**
 * POST /api/wall
 * 创建留言。需要登录。
 * 请求体：{ content: string }（最多 200 字）
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    if (content.length > 200) {
      return NextResponse.json({ error: "内容最多200字" }, { status: 400 });
    }

    const message = await prisma.wallMessage.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    logger.info(
      { userId: session.user.id, messageId: message.id },
      "留言墙新留言"
    );

    return NextResponse.json(
      {
        id: message.id,
        content: message.content,
        authorName: message.user.name || "匿名用户",
        createdAt: message.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ err: error }, "留言墙创建留言失败");
    return NextResponse.json({ error: "发布留言失败" }, { status: 500 });
  }
}