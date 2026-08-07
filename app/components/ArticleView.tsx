import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
import { entryHref, formatDate, type Entry, type EntryListItem } from "../../lib/content";
import type { Locale } from "../../lib/i18n";
import { ui } from "../../content/site";

/**
 * 详情页正文，项目 / 研究 / 博客三类共用。
 * 版式对应参考站的文章页：居中的分类、大标题、日期，一张宽封面，
 * 然后是一栏窄的衬线正文。
 */
export function ArticleView({
  entry,
  lang,
  isFallback,
  backHref,
  backLabel,
  prev,
  next,
}: {
  entry: Entry;
  lang: Locale;
  isFallback: boolean;
  backHref: string;
  backLabel: string;
  prev: EntryListItem | null;
  next: EntryListItem | null;
}) {
  const meta = buildMeta(entry, lang);

  return (
    <article className="article">
      <header className="article-head">
        <p className="article-kicker">
          {entry.category ? <span>{entry.category}</span> : null}
          {entry.venue ? <span>{entry.venue}</span> : null}
        </p>

        <h1>{entry.title}</h1>

        <p className="article-date">
          {entry.date ? <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time> : null}
          <span className="article-reading">
            {entry.minutes} {ui.minutes[lang]}
          </span>
        </p>
      </header>

      {entry.cover ? (
        <figure className="article-cover">
          <Image
            src={entry.cover}
            alt=""
            fill
            sizes="(max-width: 1000px) 100vw, 900px"
            priority
          />
        </figure>
      ) : null}

      {isFallback ? <p className="article-note">{ui.fallbackNote[lang]}</p> : null}

      {/*
        正文 HTML 由 lib/markdown.ts 生成：原始 HTML 会被转义成文字，
        链接也只放行 http/https/mailto 这些协议，所以这里注入是安全的。
      */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: entry.html }} />

      {meta.length ? (
        <dl className="article-meta">
          {meta.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {entry.links.length ? (
        <div className="article-links">
          <h2>{ui.labelLinks[lang]}</h2>
          <ul>
            {entry.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer noopener">
                  {link.label}
                  <Arrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <nav className="article-nav" aria-label={lang === "zh" ? "上下篇" : "Adjacent entries"}>
        <Link className="article-nav-back" href={backHref}>
          {ui.backTo[lang]}
          {lang === "zh" ? "" : " "}
          {backLabel}
        </Link>

        <div className="article-nav-sides">
          {prev ? (
            <Link className="nav-prev" href={entryHref(lang, prev.collection, prev.slug)}>
              <span>{ui.prev[lang]}</span>
              {prev.title}
            </Link>
          ) : null}
          {next ? (
            <Link className="nav-next" href={entryHref(lang, next.collection, next.slug)}>
              <span>{ui.next[lang]}</span>
              {next.title}
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}

/** 详情页底部那张信息表，只列出填了内容的字段 */
function buildMeta(entry: Entry, lang: Locale): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  if (entry.role) rows.push({ label: ui.labelRole[lang], value: entry.role });
  if (entry.year) rows.push({ label: ui.labelYear[lang], value: entry.year });
  if (entry.status) rows.push({ label: ui.labelStatus[lang], value: entry.status });
  if (entry.venue) rows.push({ label: ui.labelVenue[lang], value: entry.venue });
  if (entry.authors.length) {
    rows.push({ label: ui.labelAuthors[lang], value: entry.authors.join("、") });
  }
  if (entry.tags.length) {
    rows.push({ label: lang === "zh" ? "标签" : "Tags", value: entry.tags.join("、") });
  }

  return rows;
}
