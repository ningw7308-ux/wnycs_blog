# 温暖空间 (warmspace)

一个温暖的心理互助博客平台，分享治愈故事与心灵感悟。

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL (生产) / SQLite (本地开发)
- **认证**: NextAuth.js v5
- **ORM**: Prisma

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量（本地开发使用 SQLite）
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL="file:./dev.db"

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## Docker 部署

### 前置条件

- 安装 [Docker](https://docs.docker.com/get-docker/) 和 Docker Compose

### 快速启动

```bash
# 克隆项目
git clone <your-repo-url> warmspace
cd warmspace

# 启动全部服务（应用 + PostgreSQL）
docker compose up -d
```

### 首次启动后初始化数据库

```bash
# 执行数据库迁移
docker compose exec app npx prisma db push
```

### 常用命令

```bash
# 查看日志
docker compose logs -f app

# 重启服务
docker compose restart

# 停止服务
docker compose down

# 停止并清除数据（谨慎！）
docker compose down -v
```

访问 http://localhost:3000

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://warmspace:warmspace@db:5432/warmspace` |
| `NEXTAUTH_SECRET` | JWT 签名密钥 | 启动时自动生成 |
| `NEXTAUTH_URL` | 站点 URL | `http://localhost:3000` |

## 项目结构

```
src/
├── app/            # App Router 页面 + API 路由
│   ├── api/        # API 接口
│   ├── posts/      # 文章页面
│   ├── wall/       # 留言墙
│   └── settings/   # 用户设置
├── components/     # React 组件
├── lib/            # 工具函数（logger, prisma, utils）
└── auth.ts         # NextAuth.js 配置
prisma/
└── schema.prisma   # 数据库模型定义
```