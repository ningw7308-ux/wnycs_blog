import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/user
 * 更新当前登录用户的信息（name, bio）。
 * 需要登录。
 * 请求体：{ name?: string, bio?: string }
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { name, bio } = body;

    // 构建更新数据（只更新传入的字段）
    const data: Record<string, string> = {};
    if (name !== undefined) data.name = name.trim();
    if (bio !== undefined) data.bio = bio.trim();

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "没有需要更新的字段" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, bio: true, image: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}