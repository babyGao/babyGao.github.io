/**
 * 极简 Markdown 渲染器，零依赖。
 *
 * 之所以不装 marked / remark：这个项目的 package-lock.json 记录了 Linux 构建
 * 需要的原生依赖，在 Windows 上跑 npm install 会把它们从 lock 里删掉，导致
 * 线上构建失败。博客用到的语法就这些，自己实现反而更稳。
 *
 * 支持：标题(#~####)、段落、粗体、斜体、行内代码、围栏代码块、链接、图片、
 *      无序/有序列表、引用块、分隔线。
 * 不支持：表格、脚注、嵌套列表、内嵌 HTML（会被转义显示，这是刻意的）。
 */

export type Frontmatter = Record<string, string | string[]>;

/** 把 --- 包起来的头部信息和正文拆开 */
export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const text = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) return { data: {}, body: text };

  const data: Frontmatter = {};

  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (!key) continue;

    // [a, b, c] 形式的列表
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => stripQuotes(item.trim()))
        .filter(Boolean);
      continue;
    }

    value = stripQuotes(value);
    data[key] = value;
  }

  return { data, body: text.slice(match[0].length) };
}

function stripQuotes(value: string): string {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 只放行安全协议，挡住 javascript: 之类的写法 */
function safeUrl(value: string): string {
  const url = value.trim();
  if (/^(https?:|mailto:|#|\/|\.{1,2}\/)/i.test(url)) return url;
  return "#";
}

const CODE_MARK = "\u0000";

/** 渲染行内语法 */
function renderInline(source: string): string {
  const codes: string[] = [];

  // 先把行内代码抠出来，避免里面的符号被当成 Markdown
  let text = source.replace(/`([^`]+)`/g, (_, code: string) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `${CODE_MARK}${codes.length - 1}${CODE_MARK}`;
  });

  text = escapeHtml(text);

  // 图片要在链接之前处理，否则 ![]() 会被当成链接
  text = text.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    (_, alt: string, src: string) =>
      `<img src="${safeUrl(src)}" alt="${alt}" loading="lazy" decoding="async" />`,
  );

  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
    const url = safeUrl(href);
    const external = /^https?:/i.test(url);
    const attrs = external ? ' target="_blank" rel="noreferrer noopener"' : "";
    return `<a href="${url}"${attrs}>${label}</a>`;
  });

  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  return text.replace(new RegExp(`${CODE_MARK}(\\d+)${CODE_MARK}`, "g"), (_, index: string) => codes[Number(index)]);
}

/** 把 Markdown 正文渲染成 HTML 字符串 */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // 围栏代码块
    const fence = line.match(/^```\s*([\w+-]*)\s*$/);
    if (fence) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        body.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过结束的 ```
      const language = fence[1] ? ` data-language="${escapeHtml(fence[1])}"` : "";
      out.push(`<pre${language}><code>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    // 分隔线
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    // 标题
    const heading = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    // 引用块
    if (/^>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${renderMarkdown(body.join("\n"))}</blockquote>`);
      continue;
    }

    // 无序列表
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^[-*+]\s+/, ""))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // 有序列表
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+[.)]\s+/, ""))}</li>`);
        i += 1;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // 普通段落：吃到空行或下一个块级结构为止
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    if (paragraph.length) {
      out.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    }
  }

  return out.join("\n");
}

function isBlockStart(line: string): boolean {
  return (
    /^```/.test(line) ||
    /^#{1,4}\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^[-*+]\s+/.test(line) ||
    /^\d+[.)]\s+/.test(line) ||
    /^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)
  );
}

/** 去掉标记，得到纯文字，用来算摘要和字数 */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 估算阅读时长。中文按每分钟 400 字，英文按每分钟 220 词。 */
export function readingMinutes(markdown: string): number {
  const text = toPlainText(markdown);
  const cjk = (text.match(/[一-鿿぀-ヿ]/g) ?? []).length;
  const words = text
    .replace(/[一-鿿぀-ヿ]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}

/** 文章没写 summary 时，从正文截一段当摘要 */
export function autoExcerpt(markdown: string, limit = 120): string {
  const text = toPlainText(markdown);
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}
