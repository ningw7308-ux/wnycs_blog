// ──────────────────────────────────────────────
// 在线用户心跳 Map
// key: userId（已登录用户使用 session.user.id，未登录用户使用客户端生成的临时 ID）
// value: 最后心跳时间戳（毫秒）
// ──────────────────────────────────────────────
const onlineUsers = new Map<string, number>();

/** 清理超过 1 分钟未心跳的用户（定期清理防止内存泄漏） */
function cleanupStale() {
  const now = Date.now();
  onlineUsers.forEach((lastHeartbeat, userId) => {
    if (now - lastHeartbeat > 60_000) {
      onlineUsers.delete(userId);
    }
  });
}

// 每 30 秒清理一次过期用户
const CLEANUP_INTERVAL = 30_000;
if (typeof setInterval !== "undefined") {
  setInterval(cleanupStale, CLEANUP_INTERVAL);
}

/**
 * GET /api/online
 * 接收心跳请求，更新用户在线状态，返回当前在线人数。
 *
 * Query params:
 *   - userId: 用户唯一标识（已登录：session.user.id；未登录：客户端生成的临时 ID）
 *
 * 返回：
 *   { count: number }  — 最近 1 分钟内有心跳的在线用户数
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ count: 0 }, { status: 400 });
  }

  // 更新心跳时间
  onlineUsers.set(userId, Date.now());

  // 清理过期用户后计数
  cleanupStale();
  const count = onlineUsers.size;

  return Response.json({ count });
}