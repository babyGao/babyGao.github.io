import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../../lib/i18n";
import { getEntries } from "../../../lib/content";
import { researchPage, ui } from "../../../content/site";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { FeaturedEntries } from "../../components/FeaturedEntries";
import { PublicationList } from "../../components/PublicationList";

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
              <>
                <FeaturedEntries items={papers} lang={lang} archiveLabel={lang === "zh" ? "查看全部研究" : "View all research"} />
                <PublicationList
                  items={papers}
                  lang={lang}
                  title={lang === "zh" ? "研究论文" : "Publications"}
                  note={lang === "zh" ? "论文概要与发表进展。完整方法与实验见论文，投稿中与工作论文将持续更新。" : "Research overviews and publication updates. Full methods and experiments are described in the papers; manuscripts remain subject to updates."}
                  image="/art/research-astrolabe.jpg"
                />
              </>
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
