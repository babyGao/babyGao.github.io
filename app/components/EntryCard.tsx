import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { entryHref, formatDate, type EntryListItem } from "../../lib/content";
import type { Locale } from "../../lib/i18n";
import { ui } from "../../content/site";

/**
 * 奶油色内容卡片，用在首页和项目列表页。
 * 版式对应参考站首页 "Latest releases" 那一排：
 * 封面、标题、摘要、行内链接，中间留白撑开，底部是元信息行加一个深色按钮。
 */
export function EntryCard({
  item,
  lang,
  detailLabel,
  appearance = "image",
}: {
  item: EntryListItem;
  lang: Locale;
  /** 摘要下面那行行内链接的文字，比如"项目详情" */
  detailLabel: string;
  appearance?: "image" | "text";
}) {
  const href = entryHref(lang, item.collection, item.slug);

  return (
    <article className="entry-card">
      {item.cover && appearance === "image" ? (
        <Link className="entry-card-cover" href={href} tabIndex={-1} aria-hidden="true">
          <Image src={item.cover} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
        </Link>
      ) : null}

      <div className="entry-card-body">
        <h3>
          <Link href={href}>{item.title}</Link>
        </h3>
        <p className="entry-card-summary">{item.summary}</p>
        <Link className="inline-link" href={href}>
          {detailLabel}
          <Arrow />
        </Link>
      </div>

      <dl className="entry-card-meta">
        <div>
          <dt>{ui.labelDate[lang]}</dt>
          <dd>{formatDate(item.date, lang)}</dd>
        </div>
        {item.category ? (
          <div>
            <dt>{ui.labelCategory[lang]}</dt>
            <dd>{item.category}</dd>
          </div>
        ) : null}
      </dl>

      <Link className="button button-dark" href={href}>
        {ui.readMore[lang]}
        <Arrow />
      </Link>
    </article>
  );
}
