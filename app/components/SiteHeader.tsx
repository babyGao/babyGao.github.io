import Link from "next/link";
import { localePath, type Locale } from "../../lib/i18n";
import { identity, ui } from "../../content/site";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * 顶部导航。
 *
 * path 是当前页去掉语言前缀后的路径，交给语言开关拼跳转地址用。
 * tone 要和这一页第一屏的底色一致：导航是吸顶的，颜色对不上会露出一条色差。
 * 首页第一屏是浅奶油色，其余页面是米白色。
 */
export function SiteHeader({
  lang,
  path = "",
  tone = "plain",
}: {
  lang: Locale;
  path?: string;
  tone?: "plain" | "tint";
}) {
  return (
    <header className={`site-header ${tone === "tint" ? "site-header-tint" : ""}`.trim()}>
      <div className="site-header-inner">
        <Link className="brand" href={localePath(lang)}>
          {identity.brand[lang]}
        </Link>

        <nav className="site-nav" aria-label={lang === "zh" ? "主导航" : "Primary navigation"}>
          <Link href={localePath(lang, "research")}>{ui.navResearch[lang]}</Link>
          <Link href={localePath(lang, "projects")}>{ui.navProjects[lang]}</Link>
          <Link href={localePath(lang, "blog")}>{ui.navBlog[lang]}</Link>
          <Link className="nav-optional" href={`${localePath(lang)}#about`}>
            {ui.navAbout[lang]}
          </Link>

          <LanguageSwitch lang={lang} path={path} />

          <a className="button button-primary" href={`mailto:${identity.email}`}>
            {ui.contact[lang]}
          </a>
        </nav>
      </div>
    </header>
  );
}
