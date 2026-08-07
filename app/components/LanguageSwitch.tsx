import Link from "next/link";
import { LOCALES, LOCALE_LABEL, localePath, type Locale } from "../../lib/i18n";

/**
 * 语言开关。
 *
 * 这里刻意不用 usePathname()：那会把整个导航变成客户端组件。
 * 当前路径由页面显式传进来（path 不含语言前缀），切换后停在同一个页面上。
 */
export function LanguageSwitch({ lang, path = "" }: { lang: Locale; path?: string }) {
  return (
    <span className="language-switch">
      {LOCALES.map((locale) =>
        locale === lang ? (
          <span key={locale} className="language-option is-current" aria-current="true">
            {LOCALE_LABEL[locale]}
          </span>
        ) : (
          <Link
            key={locale}
            className="language-option"
            href={localePath(locale, path)}
            hrefLang={locale}
          >
            {LOCALE_LABEL[locale]}
          </Link>
        ),
      )}
    </span>
  );
}
