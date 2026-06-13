import { DefaultSession } from "next-auth";

/**
 * NextAuth 类型扩展
 * 将自定义的 id 字段注入 Session.user，使得 session.user.id 在 TypeScript 中可用。
 * auth.ts 的 callbacks 中会将 user.id 写入 session.user.id。
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}