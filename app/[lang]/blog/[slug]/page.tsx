import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../../../lib/i18n";
import { getAllParams, getEntry, getNeighbours } from "../../../../lib/content";
import { blogPage } from "../../../../content/site";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { ArticleView } from "../../../components/ArticleView";

export function generateStaticParams() {
  return getAllParams("posts");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const found = getEntry("posts", lang, slug);
  if (!found) return {};

  return {
    title: found.entry.title,
    description: found.entry.summary,
    alternates: {
      canonical: localePath(lang, `blog/${slug}`),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], localePath(locale, `blog/${slug}`)]),
      ),
    },
    openGraph: {
      type: "article",
      title: found.entry.title,
      description: found.entry.summary,
      publishedTime: found.entry.date || undefined,
      images: found.entry.cover ? [{ url: found.entry.cover }] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const found = getEntry("posts", lang, slug);
  if (!found) notFound();

  const { prev, next } = getNeighbours("posts", lang, slug);

  return (
    <>
      <SiteHeader lang={lang} path={`blog/${slug}`} />

      <main id="main" className="band band-plain">
        <div className="container">
          <ArticleView
            entry={found.entry}
            lang={lang}
            isFallback={found.isFallback}
            backHref={localePath(lang, "blog")}
            backLabel={blogPage.title[lang]}
            prev={prev}
            next={next}
          />
        </div>
      </main>

      <SiteFooter lang={lang} />
    </>
  );
}
