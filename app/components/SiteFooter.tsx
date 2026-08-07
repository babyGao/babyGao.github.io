import Link from "next/link";
import { localePath, type Locale } from "../../lib/i18n";
import { footer, identity } from "../../content/site";

/** 深色页脚，每一页都以它收尾。参考站的页脚永远是深色，不随页面反色。 */
export function SiteFooter({ lang }: { lang: Locale }) {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link className="brand" href={localePath(lang)}>
            {identity.brand[lang]}
          </Link>
          <p>{identity.role[lang]}</p>
        </div>

        <div className="site-footer-columns">
          {footer.columns[lang].map((column) => (
            <div key={column.title} className="site-footer-column">
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("#") ? (
                      <Link href={`${localePath(lang)}${link.href}`}>{link.label}</Link>
                    ) : (
                      <Link href={localePath(lang, link.href)}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="site-footer-column">
            <h2>{lang === "zh" ? "联系" : "Contact"}</h2>
            <ul>
              <li>
                <a href={`mailto:${identity.email}`}>{identity.email}</a>
              </li>
              {identity.links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer noopener">
                    {link.label[lang]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer-base" id="credits">
        <p>
          © {year} {identity.name[lang]}. {footer.rights[lang]}
        </p>
        <p>{footer.credits[lang]}</p>
      </div>
    </footer>
  );
}
