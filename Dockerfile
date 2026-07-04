# ─── 第一阶段：依赖安装 & 构建 ───
FROM node:20-alpine AS builder
WORKDIR /app

# 安装构建所需的系统依赖（Prisma 二进制需要 openssl）
RUN apk add --no-cache openssl

# 先复制依赖文件，利用 Docker 缓存层
COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm ci

# 复制源代码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# ─── 第二阶段：运行时镜像 ───
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

# 复制构建产物和必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/prisma ./prisma

# 复制可能存在的运行时配置文件
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts

EXPOSE 3000

CMD ["npm", "start"]