# Warmspace 开发日志与环境记忆

## 1. 启动环境的命令
- **第一步（启动数据库）：** 打开 Docker Desktop，等待图标变绿，然后在终端运行：
  `docker-compose up -d`
- **第二步（启动博客）：** 在项目终端运行：
  `npm run dev`
- **访问入口：** [http://localhost:3000](http://localhost:3000)

## 2. 目前项目状态
- 数据库驱动：PostgreSQL
- 认证系统：NextAuth.js
- 核心配置：Prisma ORM (已配置 PostgreSQL)

## 3. 我干过什么（按日期记录）
- [2026-07-04] 重装了 Docker Desktop，解决了 WSL 权限冲突。
- [2026-07-04] 确立了 PostgreSQL 为最终数据库方案。

## 4. 常见问题补救
- 如果数据库连不上：执行 `docker-compose up -d` 并检查 .env 是否为 `db:5432`。
- 如果 Prisma 报错：执行 `npx prisma generate`。