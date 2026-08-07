import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath } from "../../lib/i18n";
import { getHighlights } from "../../lib/content";
import { home, identity, ui } from "../../content/site";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Constellation } from "../components/Constellation";
import { EntryCard } from "../components/EntryCard";
import { EntryRow } from "../components/EntryRow";
import { Arrow } from "../components/Arrow";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const projects = getHighlights("projects", lang, 3);
  const research = getHighlights("research", lang, 3);
  const posts = getHighlights("posts", lang, 3);

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

        <div className="band band-tint band-flush">
          <div className="container">
            <Constellation lang={lang} />
          </div>
        </div>

        {/* 项目：三张奶油卡 */}
        <section className="band band-tint">
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
                  />
                ))}
              </div>
            ) : (
              <p className="empty-note">{ui.empty[lang]}</p>
            )}
          </div>
        </section>

        {/* 研究：一列条目 */}
        <section className="band band-plain">
          <div className="container">
            <SectionHead
              title={home.research.title[lang]}
              lead={home.research.lead[lang]}
              href={localePath(lang, "research")}
              action={ui.viewAll[lang]}
            />
            {research.length ? (
              <div className="row-list">
                {research.map((item) => (
                  <EntryRow key={item.slug} item={item} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="empty-note">{ui.empty[lang]}</p>
            )}
          </div>
        </section>

        {/* 博客 */}
        <section className="band band-tint">
          <div className="container">
            <SectionHead
              title={home.journal.title[lang]}
              lead={home.journal.lead[lang]}
              href={localePath(lang, "blog")}
              action={ui.viewAll[lang]}
            />
            {posts.length ? (
              <div className="row-list">
                {posts.map((item) => (
                  <EntryRow key={item.slug} item={item} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="empty-note">{ui.empty[lang]}</p>
            )}
          </div>
        </section>

        {/* 关于 */}
        <section className="band band-plain about" id="about">
          <div className="container">
            <div className="about-grid">
              <h2>{home.about.title[lang]}</h2>
              <div className="about-body">
                {home.about.body[lang].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="skill-grid">
              {home.about.skills[lang].map((skill) => (
                <div key={skill.name} className="skill">
                  <h3>{skill.name}</h3>
                  <p>{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 收尾的联系卡片，全站唯一一处珊瑚色 */}
        <section className="band band-plain band-flush">
          <div className="container">
            <div className="callout">
              <h2>{home.contact.title[lang]}</h2>
              <p>{home.contact.lead[lang]}</p>
              <a className="button button-light" href={`mailto:${identity.email}`}>
                {identity.email}
                <Arrow />
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
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
