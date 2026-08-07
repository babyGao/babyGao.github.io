import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../../lib/i18n";
import { getEntries } from "../../../lib/content";
import { researchPage, ui } from "../../../content/site";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { EntryRow } from "../../components/EntryRow";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return {
    title: researchPage.title[lang],
    description: researchPage.lead[lang],
    alternates: {
      canonical: localePath(lang, "research"),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], localePath(locale, "research")]),
      ),
    },
  };
}

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const papers = getEntries("research", lang);
  const topics = researchPage.topics[lang];
  // 第一篇拿去当左边的大图，没有内容时就是 null
  const featured = papers.find((paper) => paper.cover) ?? null;

  return (
    <>
      <SiteHeader lang={lang} path="research" />

      <main id="main">
        <section className="band band-plain">
          <div className="container">
            <PageIntro title={researchPage.title[lang]} lead={researchPage.lead[lang]}>
              <p className="topic-links">
                <span>{lang === "zh" ? "研究方向：" : "Topics:"}</span>
                {topics.map((topic, index) => (
                  <a key={topic.name} href={`#topic-${index}`}>
                    {topic.name}
                  </a>
                ))}
              </p>
            </PageIntro>

            <hr className="rule" />

            <div className="topic-grid">
              {topics.map((topic, index) => (
                <div key={topic.name} id={`topic-${index}`} className="topic">
                  <h2>{topic.name}</h2>
                  <p>{topic.desc}</p>
                </div>
              ))}
            </div>

            <hr className="rule" />

            {papers.length ? (
              <div className="feature-split">
                {featured ? (
                  <Link
                    className="feature-image"
                    href={localePath(lang, `research/${featured.slug}`)}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={featured.cover}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 55vw"
                      priority
                    />
                  </Link>
                ) : null}

                <div className="row-list">
                  {papers.map((item) => (
                    <EntryRow key={item.slug} item={item} lang={lang} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="empty-note">{ui.empty[lang]}</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </>
  );
}
