import Link from "next/link";
import { entryHref, formatDateShort, type EntryListItem } from "../../lib/content";
import type { Locale } from "../../lib/i18n";

/**
 * 列表里的一行：分类 + 日期，标题，摘要。行与行之间用一条发丝线分开。
 * 版式对应参考站研究页右侧那一列。
 */
export function EntryRow({ item, lang }: { item: EntryListItem; lang: Locale }) {
  const href = entryHref(lang, item.collection, item.slug);

  return (
    <article className="entry-row">
      <p className="entry-row-meta">
        {item.category ? <span className="entry-row-category">{item.category}</span> : null}
        {item.date ? <time dateTime={item.date}>{formatDateShort(item.date, lang)}</time> : null}
      </p>
      <h3>
        <Link href={href}>{item.title}</Link>
      </h3>
      <p className="entry-row-summary">{item.summary}</p>
    </article>
  );
}
