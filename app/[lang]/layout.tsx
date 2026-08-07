import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../lib/i18n";
import { home, identity } from "../../content/site";
import { siteOrigin } from "../layout";

/** 预先生成两种语言的路由 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const origin = await siteOrigin();
  const title = `${identity.name[lang]} · ${identity.role[lang]}`;
  const description = home.hero.lead[lang];

  return {
    title: {
      default: title,
      template: `%s | ${identity.name[lang]}`,
    },
    description,
    alternates: {
      canonical: localePath(lang),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], localePath(locale)]),
      ),
    },
    openGraph: {
      type: "website",
      locale: HTML_LANG[lang],
      title,
      description,
      url: `${origin}${localePath(lang)}`,
      images: [{ url: `${origin}/og.png`, width: 1672, height: 941, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // /zh 和 /en 之外的地址一律 404，避免 [lang] 把任意路径都吞掉
  if (!isLocale(lang)) notFound();

  /*
   * 根布局拿不到路由参数，html 上的 lang 只能写死默认语言，
   * 所以这里再标一次。元素级的 lang 会覆盖文档级的，读屏软件、搜索引擎、
   * 以及样式表里的 :lang() 选择器都认这个。
   */
  return (
    <div className="locale-root" lang={HTML_LANG[lang]}>
      {children}
    </div>
  );
}
