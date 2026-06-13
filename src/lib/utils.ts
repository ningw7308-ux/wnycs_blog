/**
 * 从标题生成 URL 友好的 slug。
 * 规则：转小写 → 替换中文/特殊字符为拼音简化 → 去除非字母数字 → 加随机后缀防碰撞
 *
 * 对于中文标题，用随机字符串 + 英文单词策略。
 * 英文标题直接转换为 kebab-case。
 */
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    // 尝试保留英文和数字，中文替换为连字符
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    // 如果包含中文，截取前 30 个字符
    .slice(0, 30);

  // 如果处理后是空的（纯中文被过滤），用随机
  const hasLatin = /[a-z0-9]/.test(base);
  const slug = hasLatin ? base : "post";

  // 追加 6 位随机串防碰撞
  const random = Math.random().toString(36).slice(2, 8);
  return `${slug}-${random}`;
}

/**
 * 从 Markdown 内容中提取纯文本，截取前 150 字作为摘要。
 */
export function extractExcerpt(content: string, maxLength = 150): string {
  const plain = content
    // 去掉 Markdown 标题标记
    .replace(/^#{1,6}\s+/gm, "")
    // 去掉加粗/斜体
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // 去掉链接 [text](url)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 去掉图片 ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 去掉行内代码
    .replace(/`([^`]*)`/g, "$1")
    // 去掉代码块
    .replace(/```[\s\S]*?```/g, "")
    // 去掉引用标记
    .replace(/^>\s+/gm, "")
    // 去掉列表标记
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // 去掉水平线
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // 合并多个空白
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}