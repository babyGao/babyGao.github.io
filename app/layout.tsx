import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import { headers } from "next/headers";
import { DEFAULT_LOCALE, HTML_LANG } from "../lib/i18n";
import { identity } from "../content/site";
import "./globals.css";

/*
 * 字体分工来自参考站：标题和界面用无衬线的粗体，正文用衬线。
 * Inter 顶替 StyreneB，Source Serif 4 顶替 Tiempos，都是最接近的开源替代。
 * 中文不配网络字体——思源系列一套好几兆，会把构建产物撑爆，走系统字体。
 *
 * ⚠️ fallback 里绝对不能写中文字体名。
 * 写了之后 vinext 会**静默跳过这个字体的下载**：本地 dev 看着一切正常，
 * 但构建产物里根本没有 Inter 和 Source Serif 4 的文件，上线才发现字全变了。
 * 判断方法：构建完看 dist/client/assets/_vinext_fonts/ 下是不是三个字体都在。
 *
 * 中文怎么排到通用族前面，见 globals.css 里 unicode-range 那两段 @font-face。
 */
const sans = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-serif-latin",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-latin",
  subsets: ["latin"],
  display: "swap",
});

/** 站点根地址。本地开发和线上域名都能自动适配，不用写死。 */
export async function siteOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:4173";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = await siteOrigin();

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${identity.name[DEFAULT_LOCALE]} · ${identity.role[DEFAULT_LOCALE]}`,
      template: `%s | ${identity.name[DEFAULT_LOCALE]}`,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

/**
 * 根布局。
 *
 * html 上的 lang 固定写默认语言：Next 的根布局拿不到路由参数。
 * 非默认语言的页面会在最外层容器上再标一次 lang（见 app/[lang]/layout.tsx），
 * 元素级的 lang 会覆盖文档级的，这是 HTML 标准行为，读屏软件和搜索引擎都认。
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * 字体变量必须挂在 html 上，不能挂 body。
     * globals.css 是在 :root 上用 var(--font-serif-latin) 拼出 --font-serif 的，
     * 自定义属性里的 var() 是在"声明它的那个元素"上求值的——挂在 body 上时
     * :root 处取不到，整条声明会静默失效，全站字体退回系统默认无衬线。
     */
    <html
      lang={HTML_LANG[DEFAULT_LOCALE]}
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
