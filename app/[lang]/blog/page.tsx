import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../../lib/i18n";
import { getEntries } from "../../../lib/content";
import { blogPage, ui } from "../../../content/site";
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
    title: blogPage.title[lang],
    description: blogPage.lead[lang],
    alternates: {
      canonical: localePath(lang, "blog"),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], localePath(locale, "blog")]),
      ),
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const posts = getEntries("posts", lang);

  return (
    <>
      <SiteHeader lang={lang} path="blog" />

      <main id="main">
        <section className="band band-plain">
          <div className="container">
            <PageIntro title={blogPage.title[lang]} lead={blogPage.lead[lang]} />

            <hr className="rule" />

            {posts.length ? (
              <>
                <FeaturedEntries items={posts} lang={lang} archiveLabel={lang === "zh" ? "查看全部文章" : "View all articles"} />
                <PublicationList
                  items={posts}
                  lang={lang}
                  title={lang === "zh" ? "全部文章" : "All articles"}
                  note={lang === "zh" ? "工具实践与工作流记录。点击标题查看文章概要及博客园原文。" : "Tools and workflows in practice. Select a title for an overview and the original Chinese article on CNBlogs."}
                  image="/art/post-maples.jpg"
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
