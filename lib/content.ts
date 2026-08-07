/**
 * 内容数据层。全站三类内容都走这里，写法完全一样：
 *
 *     content/projects/<短名>.<语言>.md     项目
 *     content/research/<短名>.<语言>.md     研究（论文）
 *     content/posts/<短名>.<语言>.md        博客
 *
 * 同一个短名的中英两个文件会被认成同一条内容的两个版本，读者切换语言时停在同一条上。
 * 只写一种语言也可以，另一种语言的读者会看到原文加一句提示。
 *
 * 文件开头的信息块（frontmatter），各字段都可选：
 *
 *     ---
 *     title:    标题
 *     date:     2026-08-06          # 排序用
 *     summary:  列表页显示的一句话，不写会自动从正文截取
 *     cover:    /art/xxx.jpg        # 封面图，不写就是纯文字卡片
 *     category: 分类                # 显示在卡片和详情页顶部
 *     tags:     [标签一, 标签二]
 *     featured: true                # 首页优先展示
 *     draft:    true                # 写了就不发布
 *
 *     year:     2026                # 项目：年份
 *     role:     独立开发            # 项目：我的角色
 *     status:   已上线              # 项目：当前状态
 *
 *     venue:    NeurIPS 2026        # 研究：发表于
 *     authors:  [高泽林, 某某]       # 研究：作者
 *
 *     links:    [论文|https://…, 代码|https://…]   # 外部链接，竖线前是显示的字
 *     ---
 */

import { DEFAULT_LOCALE, LOCALES, isLocale, localePath, type Locale } from "./i18n";
import { autoExcerpt, parseFrontmatter, readingMinutes, renderMarkdown } from "./markdown";

export const COLLECTIONS = ["projects", "research", "posts"] as const;
export type Collection = (typeof COLLECTIONS)[number];

/**
 * 集合名到网址段的对应关系。
 * 只有博客不一样：目录叫 posts，但网址是 /blog。别直接拿集合名拼地址。
 */
export const COLLECTION_PATH: Record<Collection, string> = {
  projects: "projects",
  research: "research",
  posts: "blog",
};

/** 拼一条内容的站内地址 */
export function entryHref(locale: Locale, collection: Collection, slug: string): string {
  return localePath(locale, `${COLLECTION_PATH[collection]}/${slug}`);
}

/** 外部链接：显示的字 + 地址 */
export type EntryLink = { label: string; url: string };

export type Entry = {
  collection: Collection;
  slug: string;
  /** 这份内容实际是用哪种语言写的 */
  locale: Locale;
  title: string;
  /** ISO 日期字符串，用来排序 */
  date: string;
  summary: string;
  cover: string;
  category: string;
  tags: string[];
  featured: boolean;
  year: string;
  role: string;
  status: string;
  venue: string;
  authors: string[];
  links: EntryLink[];
  /** 渲染好的正文 HTML */
  html: string;
  /** 估算阅读时长（分钟） */
  minutes: number;
};

/** 列表页用不到正文，去掉 html 省一大截数据 */
export type EntryListItem = Omit<Entry, "html"> & {
  /** true 表示这条没有当前语言的版本，显示的是另一种语言的原文 */
  isFallback: boolean;
};

// import.meta.glob 只认写死的字面量路径，所以三个集合得分开写。
const RAW: Record<Collection, Record<string, string>> = {
  projects: import.meta.glob("../content/projects/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>,
  research: import.meta.glob("../content/research/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>,
  posts: import.meta.glob("../content/posts/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>,
};

/** 集合 -> 短名 -> 语言 -> 内容 */
const index = new Map<Collection, Map<string, Map<Locale, Entry>>>(
  COLLECTIONS.map((collection) => [collection, buildIndex(collection)]),
);

function buildIndex(collection: Collection): Map<string, Map<Locale, Entry>> {
  const result = new Map<string, Map<Locale, Entry>>();

  for (const [path, raw] of Object.entries(RAW[collection])) {
    const fileName = path.split("/").pop() ?? "";
    const match = fileName.match(/^(.+)\.([a-z]{2})\.md$/i);

    // 不符合 "短名.语言.md" 规则的文件直接跳过，不让它拖垮整个站
    if (!match) continue;

    const [, slug, localeCode] = match;
    const locale = localeCode.toLowerCase();
    if (!isLocale(locale)) continue;

    const { data, body } = parseFrontmatter(raw);

    // draft: true 的不发布
    if (String(data.draft ?? "").toLowerCase() === "true") continue;

    const entry: Entry = {
      collection,
      slug,
      locale,
      title: asText(data.title) || slug,
      date: asText(data.date),
      summary: asText(data.summary) || autoExcerpt(body),
      cover: asText(data.cover),
      category: asText(data.category),
      tags: asList(data.tags),
      featured: String(data.featured ?? "").toLowerCase() === "true",
      year: asText(data.year),
      role: asText(data.role),
      status: asText(data.status),
      venue: asText(data.venue),
      authors: asList(data.authors),
      links: asLinks(data.links),
      html: renderMarkdown(body),
      minutes: readingMinutes(body),
    };

    const byLocale = result.get(slug) ?? new Map<Locale, Entry>();
    byLocale.set(locale, entry);
    result.set(slug, byLocale);
  }

  return result;
}

function asText(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

function asList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** "论文|https://…" 拆成 { label, url }；没写竖线就拿地址当显示文字 */
function asLinks(value: string | string[] | undefined): EntryLink[] {
  return asList(value)
    .map((item) => {
      const bar = item.indexOf("|");
      if (bar === -1) return { label: item, url: item };
      return { label: item.slice(0, bar).trim(), url: item.slice(bar + 1).trim() };
    })
    .filter((link) => link.label && link.url);
}

/** 按请求语言取一条，没有对应语言版本就退回另一种语言 */
function resolve(
  collection: Collection,
  slug: string,
  locale: Locale,
): { entry: Entry; isFallback: boolean } | null {
  const byLocale = index.get(collection)?.get(slug);
  if (!byLocale) return null;

  const exact = byLocale.get(locale);
  if (exact) return { entry: exact, isFallback: false };

  for (const candidate of [DEFAULT_LOCALE, ...LOCALES]) {
    const fallback = byLocale.get(candidate);
    if (fallback) return { entry: fallback, isFallback: true };
  }

  return null;
}

/** 列表页用：某个语言下某个集合的全部内容，按日期倒序 */
export function getEntries(collection: Collection, locale: Locale): EntryListItem[] {
  const items: EntryListItem[] = [];

  for (const slug of index.get(collection)?.keys() ?? []) {
    const resolved = resolve(collection, slug, locale);
    if (!resolved) continue;

    const { html: _html, ...rest } = resolved.entry;
    void _html;
    items.push({ ...rest, isFallback: resolved.isFallback });
  }

  return items.sort(
    (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? 1 : -1),
  );
}

/** 首页用：最近几条。标了 featured 的排前面。 */
export function getHighlights(
  collection: Collection,
  locale: Locale,
  count: number,
): EntryListItem[] {
  const all = getEntries(collection, locale);
  const featured = all.filter((item) => item.featured);
  const rest = all.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, count);
}

/** 详情页用 */
export function getEntry(
  collection: Collection,
  locale: Locale,
  slug: string,
): { entry: Entry; isFallback: boolean } | null {
  return resolve(collection, slug, locale);
}

/** 详情页上一条 / 下一条，用来做页脚导航 */
export function getNeighbours(
  collection: Collection,
  locale: Locale,
  slug: string,
): { prev: EntryListItem | null; next: EntryListItem | null } {
  const all = getEntries(collection, locale);
  const at = all.findIndex((item) => item.slug === slug);
  if (at === -1) return { prev: null, next: null };
  return {
    prev: all[at - 1] ?? null,
    next: all[at + 1] ?? null,
  };
}

/** 预渲染用：某个集合下所有 (语言, 短名) 组合 */
export function getAllParams(collection: Collection): { lang: Locale; slug: string }[] {
  const params: { lang: Locale; slug: string }[] = [];
  for (const slug of index.get(collection)?.keys() ?? []) {
    for (const lang of LOCALES) {
      params.push({ lang, slug });
    }
  }
  return params;
}

/** 把 2026-08-06 显示成各语言习惯的写法 */
export function formatDate(date: string, locale: Locale): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const year = parsed.getUTCFullYear();
  const month = parsed.getUTCMonth();
  const day = parsed.getUTCDate();

  if (locale === "zh") return `${year} 年 ${month + 1} 月 ${day} 日`;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[month]} ${day}, ${year}`;
}

/** 列表里的日期用短格式，省得一行放不下 */
export function formatDateShort(date: string, locale: Locale): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  const year = parsed.getUTCFullYear();
  const month = parsed.getUTCMonth();
  const day = parsed.getUTCDate();

  if (locale === "zh") return `${year}.${String(month + 1).padStart(2, "0")}.${String(day).padStart(2, "0")}`;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[month]} ${day}, ${year}`;
}
