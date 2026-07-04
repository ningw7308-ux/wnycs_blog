# 个人博客_wnycs_blog

仰春氏的个人博客。记录学习、思考与探索的过程。

## 视觉风格

- 衬线标题字体 Cormorant Garamond，正文 Inter
- 暗大理石背景 + 半透明米白卡片
- 强调色：暗红 `#8B0000` / 古铜绿 `#5F7D6B`
- 日期格式 `YYYY·MM·DD`，分隔线暗红细线，留白慷慨

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + 自定义配色 |
| 字体 | next/font (Cormorant Garamond) |
| 认证 | NextAuth.js v5 (JWT + Credentials) |
| 数据库 | PostgreSQL (Prisma ORM) |
| 内容 | react-markdown + remark-gfm |
| 日志 | pino (Node.js) / console (Edge 回退) |
| 部署 | Docker Compose |

## 本地开发

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

访问 http://localhost:3000

## Docker 部署

```bash
git clone https://github.com/ningw7308-ux/wnycs_blog.git
cd wnycs_blog
docker compose up -d
docker compose exec app npx prisma db push
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/                    # 页面 + API 路由
│   ├── page.tsx            # 首页：一句话 + 引言轮播 + 最新文章
│   ├── about/              # 关于页：素描 + 个人介绍
│   ├── posts/              # 文章列表 + 详情
│   ├── login/              # 登录
│   ├── register/           # 注册
│   ├── new-post/           # 写文章
│   ├── profile/            # 个人主页
│   ├── settings/           # 设置
│   ├── wall/               # 留言墙
│   ├── quotes/             # 语录
│   └── api/                # API 路由
├── components/             # React 组件
│   ├── Navbar.tsx          # 导航栏（首页/文章/关于/RSS）
│   ├── PostCard.tsx        # 文章卡片
│   ├── LikeButton.tsx      # 大拇指点赞
│   ├── CommentSection.tsx  # 回应区
│   ├── OnlineCounter.tsx   # 在线阅读人数
│   ├── DeskPet.tsx         # 桌宠（默认开启，可隐藏）
│   └── ...
├── lib/
│   ├── prisma.ts           # Prisma 单例
│   ├── logger.ts           # 环境感知日志
│   └── utils.ts            # slug 生成 + 摘要提取
├── auth.ts                 # NextAuth 配置
└── middleware.ts           # 认证中间件
prisma/
└── schema.prisma           # 数据模型
```

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | JWT 签名密钥 | 随机长字符串 |
| `NEXTAUTH_URL` | 站点地址 | `http://localhost:3000` |