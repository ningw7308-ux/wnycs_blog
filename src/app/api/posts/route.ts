import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug, extractExcerpt } from "@/lib/utils";

/**
 * POST /api/posts
 * 创建新文章。需要登录。
 *
 * 请求体：{ title: string, content: string, anonymous?: boolean }
 * 返回：新创建的文章对象
 */
export async function POST(request: Request) {
  try {
    // 1. 验证登录状态
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    // 2. 解析请求体
    const body = await request.json();
    const { title, content, anonymous } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    // 3. 生成 slug（自动，基于标题）+ 提取摘要
    const slug = generateSlug(title);
    const excerpt = extractExcerpt(content);

    // 4. 存入数据库
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        excerpt,
        slug,
        published: true,
        anonymous: anonymous === true,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("创建文章失败:", error);
    return NextResponse.json({ error: "创建文章失败" }, { status: 500 });
  }
}