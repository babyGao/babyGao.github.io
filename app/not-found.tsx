import Link from "next/link";
import { DEFAULT_LOCALE, localePath } from "../lib/i18n";
import { identity, ui } from "../content/site";

/**
 * 404 页。这一层拿不到当前语言（根布局之外），所以用默认语言，
 * 中英各写一句，读者总能看懂其中一句。
 */
export default function NotFound() {
  return (
    <main id="main" className="band band-plain not-found">
      <div className="container">
        <p className="article-kicker">
          <span>404</span>
        </p>
        <h1>页面不存在 · Page not found</h1>
        <p className="lead">
          这个地址下没有内容，可能是链接过期了。
          <br />
          There is nothing at this address — the link may be out of date.
        </p>
        <p className="not-found-actions">
          <Link className="button button-dark" href={localePath(DEFAULT_LOCALE)}>
            回到首页
          </Link>
          <Link className="button button-outline" href={localePath("en")}>
            Go to homepage
          </Link>
        </p>
        <p className="not-found-contact">
          {ui.contact[DEFAULT_LOCALE]}：<a href={`mailto:${identity.email}`}>{identity.email}</a>
        </p>
      </div>
    </main>
  );
}
