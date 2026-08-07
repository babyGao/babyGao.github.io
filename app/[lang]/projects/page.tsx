import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HTML_LANG, LOCALES, isLocale, localePath } from "../../../lib/i18n";
import { getEntries } from "../../../lib/content";
import { projectsPage, ui } from "../../../content/site";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PageIntro } from "../../components/PageIntro";
import { EntryCard } from "../../components/EntryCard";

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
    title: projectsPage.title[lang],
    description: projectsPage.lead[lang],
    alternates: {
      canonical: localePath(lang, "projects"),
      languages: Object.fromEntries(
        LOCALES.map((locale) => [HTML_LANG[locale], localePath(locale, "projects")]),
      ),
    },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = getEntries("projects", lang);

  return (
    <>
      <SiteHeader lang={lang} path="projects" />

      <main id="main">
        <section className="band band-plain">
          <div className="container">
            <PageIntro title={projectsPage.title[lang]} lead={projectsPage.lead[lang]} />

            <hr className="rule" />

            {projects.length ? (
              <div className="card-grid">
                {projects.map((item) => (
                  <EntryCard
                    key={item.slug}
                    item={item}
                    lang={lang}
                    detailLabel={ui.projectDetail[lang]}
                  />
                ))}
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
