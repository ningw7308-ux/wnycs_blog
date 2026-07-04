import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";

/**
 * 设置页面（/settings）
 * 服务端组件，获取当前用户信息后传给客户端表单组件。
 * 需要登录，未登录 → 重定向 /login。
 */
export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/settings");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, bio: true, email: true },
  });

  return (
    <SettingsForm
      initialName={user?.name || ""}
      initialBio={user?.bio || ""}
      email={user?.email || ""}
    />
  );
}