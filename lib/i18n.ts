/**
 * 站点语言配置。目前支持中文与英文。
 * 若要新增语言：在 LOCALES 里加代码，在 HTML_LANG 里加对应的 BCP-47 标签，
 * 然后把 content/ 下所有双语字段补上这门语言即可。
 */

export const LOCALES = ["zh", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** 访问 / 时若无法从浏览器语言判断，落到这门语言。 */
export const DEFAULT_LOCALE: Locale = "zh";

/** 写进 HTML lang 属性的标准标签。 */
export const HTML_LANG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
};

/** 语言切换按钮上显示的文字。 */
export const LOCALE_LABEL: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** 一段中英对照的文字。 */
export type Bilingual = Record<Locale, string>;

/** 一组中英对照的任意结构。 */
export type BilingualOf<T> = Record<Locale, T>;

/**
 * 拼出站内链接。path 不带语言前缀，例如 "" / "work" / "blog/my-post"。
 */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** 从 Accept-Language 请求头挑一门站点支持的语言。 */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }

  return DEFAULT_LOCALE;
}
