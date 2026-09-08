import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath } from "../../lib/i18n";
import { entryHref, getHighlights } from "../../lib/content";
import { home, identity, ui } from "../../content/site";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Constellation } from "../components/Constellation";
import { EntryCard } from "../components/EntryCard";
import { Arrow } from "../components/Arrow";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = getHighlights("projects", lang, 3);
  const research = getHighlights("research", lang, 3);
  const posts = getHighlights("posts", lang, 2);
  const updates = [...research, ...posts];

  return (
    <>
      <SiteHeader lang={lang} path="" tone="tint" />

      <main id="main">
        {/* 首屏：左边大标题，右边一段导语 */}
        <section className="band band-tint hero">
          <div className="container hero-grid">
            <h1>
              {home.hero.title[lang].map((segment, index) =>
                segment.mark ? (
                  <span key={index} className="mark">
                    {segment.t}
                  </span>
                ) : (
                  <span key={index}>{segment.t}</span>
                ),
              )}
            </h1>
            <p className="lead">{home.hero.lead[lang]}</p>
          </div>
        </section>

        <div className="band band-tint band-flush home-visual">
          <Constellation lang={lang} />
        </div>

        {/* 项目：三张奶油卡 */}
        <section className="band band-tint home-projects">
          <div className="container">
            <SectionHead
              title={home.projects.title[lang]}
              lead={home.projects.lead[lang]}
              href={localePath(lang, "projects")}
              action={ui.viewAll[lang]}
            />
            {projects.length ? (
              <div className="card-grid">
                {projects.map((item) => (
                  <EntryCard
                    key={item.slug}
                    item={item}
                    lang={lang}
                    detailLabel={ui.projectDetail[lang]}
                    appearance="text"
                  />
                ))}
              </div>
            ) : (
              <p className="empty-note">{ui.empty[lang]}</p>
            )}
          </div>
        </section>

        {/* 简介与少量研究、文章入口 */}
        <section className="band band-tint home-overview" id="about">
          <div className="container home-overview-grid">
            <div className="home-overview-intro">
              <h2>{home.about.title[lang]}</h2>
              <p>{home.about.body[lang][0]}</p>
              <a className="inline-link" href={`mailto:${identity.email}`}>
                {identity.email}
                <Arrow />
              </a>
            </div>
            <nav aria-label={lang === "zh" ? "精选研究与文章" : "Selected research and articles"}>
              <ul className="home-updates">
                {updates.map((item) => (
                  <li key={`${item.collection}-${item.slug}`}>
                    <Link href={entryHref(lang, item.collection, item.slug)}>
                      <span>{item.title}</span>
                      <span className="home-update-category">{item.collection === "research" ? ui.navResearch[lang] : ui.navBlog[lang]}</span>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} layout="compact" />
    </>
  );
}

/** 区块标题：左边标题加一句话，右边一个"查看全部" */
function SectionHead({
  title,
  lead,
  href,
  action,
}: {
  title: string;
  lead: string;
  href: string;
  action: string;
}) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        <p>{lead}</p>
      </div>
      <Link className="inline-link" href={href}>
        {action}
        <Arrow />
      </Link>
    </div>
  );
}
