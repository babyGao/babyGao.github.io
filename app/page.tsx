import Image from "next/image";
import Link from "next/link";
import { HeroVisual } from "./components/HeroVisual";
import { MagneticLink } from "./components/MagneticLink";
import { Reveal } from "./components/Reveal";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

const projects = [
  {
    id: "nova",
    name: "NOVA",
    kind: "Research intelligence",
    description: "A calm workspace that turns scattered evidence into a clear, traceable line of thought.",
    image: "/project-nova.png",
    className: "project-card project-card-featured",
    sizes: "(max-width: 768px) 100vw, 88vw",
  },
  {
    id: "lumen",
    name: "LUMEN",
    kind: "Ambient computing",
    description: "A screenless object that makes complex systems present without demanding attention.",
    image: "/project-lumen.png",
    className: "project-card project-card-portrait",
    sizes: "(max-width: 768px) 100vw, 42vw",
  },
  {
    id: "kinetic",
    name: "KINETIC",
    kind: "Generative motion",
    description: "A modular motion language that gives digital products a coherent physical character.",
    image: "/project-kinetic.png",
    className: "project-card project-card-landscape",
    sizes: "(max-width: 768px) 100vw, 52vw",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <Reveal className="hero-copy">
            <p className="eyebrow">Independent creative technologist</p>
            <h1 id="hero-title">I build systems you can feel.</h1>
            <p className="hero-intro">
              Digital products and spatial identities shaped through code, motion, and restraint.
            </p>
            <MagneticLink href="#work" label="View work" />
          </Reveal>
          <HeroVisual />
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <Reveal className="section-heading">
            <h2 id="work-title">Selected work</h2>
            <p>Three speculative products, built as placeholders for your future case studies.</p>
          </Reveal>
          <div className="project-grid">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.06} className={project.className}>
                <Link href={`/work#${project.id}`} aria-label={`Open ${project.name} project`}>
                  <div className="project-image-wrap">
                    <Image
                      src={project.image}
                      alt={`${project.name} project concept`}
                      fill
                      sizes={project.sizes}
                      className="project-image"
                    />
                  </div>
                  <div className="project-meta">
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.kind}</p>
                    </div>
                    <p className="project-description">{project.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="archive-link-wrap">
            <MagneticLink href="/work" label="Archive" variant="secondary" />
          </Reveal>
        </section>

        <section className="manifesto" id="about" aria-labelledby="manifesto-title">
          <Reveal>
            <h2 id="manifesto-title">
              Useful is the baseline. The work begins when clarity gains character.
            </h2>
          </Reveal>
        </section>

        <section className="practice" aria-labelledby="practice-title">
          <Reveal className="practice-intro">
            <p className="eyebrow">Practice</p>
            <h2 id="practice-title">From first principle to final frame.</h2>
            <p>
              I work across product strategy, interface systems, creative development, and motion direction.
            </p>
          </Reveal>
          <div className="capability-grid">
            <Reveal className="capability capability-wide">
              <h3>Product direction</h3>
              <p>Defining the problem, narrative, and interaction model before polishing the surface.</p>
            </Reveal>
            <Reveal delay={0.08} className="capability capability-accent">
              <h3>Creative development</h3>
              <p>Building expressive, responsive interfaces with performance and accessibility intact.</p>
            </Reveal>
            <Reveal delay={0.14} className="capability capability-image">
              <Image
                src="/project-lumen.png"
                alt="Lumen ambient computing object"
                fill
                sizes="(max-width: 768px) 100vw, 46vw"
                className="capability-photo"
              />
            </Reveal>
            <Reveal delay={0.2} className="capability capability-bottom">
              <h3>Motion systems</h3>
              <p>Using timing, sequence, and physical response to make hierarchy visible.</p>
            </Reveal>
          </div>
        </section>

        <section className="cinematic-break" aria-labelledby="motion-title">
          <Image
            src="/project-kinetic.png"
            alt="Kinetic metallic installation"
            fill
            sizes="100vw"
            className="cinematic-image"
          />
          <div className="cinematic-scrim" />
          <Reveal className="cinematic-copy">
            <h2 id="motion-title">Motion should explain, not distract.</h2>
            <p>Every transition earns its place by revealing hierarchy, feedback, or change.</p>
          </Reveal>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <Reveal>
            <p className="contact-kicker">Have a difficult idea?</p>
            <h2 id="contact-title">Let&apos;s give it form.</h2>
            <MagneticLink href="mailto:hello@example.com" label="Contact" />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
