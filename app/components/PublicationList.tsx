import Image from "next/image";
import Link from "next/link";
import { entryHref, formatDateShort, type EntryListItem } from "../../lib/content";
import type { Locale } from "../../lib/i18n";
import { ui } from "../../content/site";
import { Arrow } from "./Arrow";

export function PublicationList({ items, lang, title, note, image }: {
  items: EntryListItem[];
  lang: Locale;
  title: string;
  note: string;
  image: string;
}) {
  return (
    <section className="publications" id="publications" aria-labelledby="publications-title">
      <div className="publications-head">
        <h2 id="publications-title">{title}</h2>
        <span>{lang === "zh" ? `共 ${items.length} 篇` : `${items.length} publications`}</span>
      </div>
      <div className="publications-grid">
        <table className="publication-table">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th scope="col">{ui.labelDate[lang]}</th>
              <th scope="col">{ui.labelCategory[lang]}</th>
              <th scope="col">{lang === "zh" ? "标题" : "Title"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td><time dateTime={item.date}>{formatDateShort(item.date, lang)}</time></td>
                <td>{item.category}</td>
                <td>
                  <Link className="publication-title" href={entryHref(lang, item.collection, item.slug)}>
                    <span>{item.title}{item.venue ? <small>{item.venue}</small> : null}</span>
                    <Arrow />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <aside className="publications-aside">
          <div className="publications-art">
            <Image src={image} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
          </div>
          <p>{note}</p>
        </aside>
      </div>
    </section>
  );
}
