import Image from "next/image";
import Link from "next/link";
import { entryHref, formatDateShort, type EntryListItem } from "../../lib/content";
import type { Locale } from "../../lib/i18n";
import { EntryRow } from "./EntryRow";
import { Arrow } from "./Arrow";

export function FeaturedEntries({ items, lang, archiveLabel, layout = "caption" }: {
  items: EntryListItem[];
  lang: Locale;
  archiveLabel: string;
  layout?: "caption" | "aside";
}) {
  const featured = items.find((item) => item.featured && item.cover)
    ?? items.find((item) => item.cover) ?? items[0];
  if (!featured) return null;
  const rest = items.filter((item) => item.slug !== featured.slug).slice(0, 3);
  const sideItems = layout === "aside" ? [featured, ...rest] : rest;
  const href = entryHref(lang, featured.collection, featured.slug);

  return (
    <div className={`feature-split${layout === "aside" ? " feature-split-aside" : ""}`}>
      <article className="feature-main">
        {featured.cover ? (
          <Link className="feature-image" href={href} tabIndex={-1} aria-hidden="true">
            <Image src={featured.cover} alt="" fill sizes="(max-width: 1000px) 100vw, 66vw" priority />
          </Link>
        ) : null}
        {layout === "caption" ? <div className="feature-caption">
          <h2><Link href={href}>{featured.title}</Link></h2>
          <div>
            <p className="entry-row-meta">
              <span className="entry-row-category">{featured.category}</span>
              {featured.date ? <time dateTime={featured.date}>{formatDateShort(featured.date, lang)}</time> : null}
              {featured.venue ? <span>{featured.venue}</span> : null}
            </p>
            <p className="entry-row-summary">{featured.summary}</p>
          </div>
        </div> : null}
      </article>
      <div className="feature-side">
        <div className="row-list">
          {sideItems.map((item) => <EntryRow key={item.slug} item={item} lang={lang} />)}
        </div>
        <a className="inline-link feature-archive-link" href="#publications">
          {archiveLabel}<Arrow />
        </a>
      </div>
    </div>
  );
}
