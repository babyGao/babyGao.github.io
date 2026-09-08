import Link from "next/link";
import { localePath, type Locale } from "../../lib/i18n";
import { footer, identity, ui } from "../../content/site";

/** 深色页脚，每一页都以它收尾。参考站的页脚永远是深色，不随页面反色。 */
export function SiteFooter({ lang, layout = "columns" }: { lang: Locale; layout?: "columns" | "compact" }) {
  const year = new Date().getUTCFullYear();

  return (
    <footer className={`site-footer${layout === "compact" ? " site-footer-compact" : ""}`}>
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link className="brand" href={localePath(lang)}>
            {identity.brand[lang]}
          </Link>
          {layout === "columns" ? <p>{identity.role[lang]}</p> : null}
        </div>

        {layout === "compact" ? (
          <nav className="site-footer-links" aria-label={lang === "zh" ? "页脚导航" : "Footer navigation"}>
            <Link href={localePath(lang, "research")}>{ui.navResearch[lang]}</Link>
            <Link href={localePath(lang, "projects")}>{ui.navProjects[lang]}</Link>
            <Link href={localePath(lang, "blog")}>{ui.navBlog[lang]}</Link>
            <a href={`mailto:${identity.email}`}>{ui.contact[lang]}</a>
          </nav>
        ) : <div className="site-footer-columns">
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
        </div>}
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
