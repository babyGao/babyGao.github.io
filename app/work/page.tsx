import type { Metadata } from "next";
import Image from "next/image";
import { MagneticLink } from "../components/MagneticLink";
import { Reveal } from "../components/Reveal";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Project Archive",
  description: "Three speculative product case studies across research, ambient computing, and motion.",
};

const entries = [
  {
    id: "nova",
    name: "NOVA",
    category: "Research intelligence",
    summary: "A research environment designed to turn fragmented sources into clear, traceable arguments.",
    role: "Product direction, interaction design, creative development",
    image: "/project-nova.png",
    className: "work-entry work-entry-wide",
    sizes: "100vw",
  },
  {
    id: "lumen",
    name: "LUMEN",
    category: "Ambient computing",
    summary: "A screenless object that expresses system activity through light, rhythm, and material response.",
    role: "Industrial concept, experience design, motion direction",
    image: "/project-lumen.png",
    className: "work-entry work-entry-split",
    sizes: "(max-width: 768px) 100vw, 48vw",
  },
  {
    id: "kinetic",
    name: "KINETIC",
    category: "Generative motion",
    summary: "A motion framework for teams that need one coherent physical language across many products.",
    role: "System design, prototyping, implementation",
    image: "/project-kinetic.png",
    className: "work-entry work-entry-cinema",
    sizes: "100vw",
  },
];

export default function WorkPage() {
  return (
    <div className="site-shell work-page">
      <SiteHeader />
      <main>
        <section className="work-hero" aria-labelledby="archive-title">
          <Reveal>
            <p className="eyebrow">Project archive</p>
            <h1 id="archive-title">Three systems. One point of view.</h1>
            <p>Mock case studies for showing products with enough context, without turning the page into a report.</p>
          </Reveal>
        </section>

        <section className="work-list" aria-label="Project case studies">
          {entries.map((entry, index) => (
            <article className={entry.className} id={entry.id} key={entry.id}>
              <Reveal className="work-entry-visual" delay={index * 0.04}>
                <Image
                  src={entry.image}
                  alt={`${entry.name} project visual`}
                  fill
                  sizes={entry.sizes}
                  className="work-entry-image"
                />
              </Reveal>
              <Reveal className="work-entry-copy" delay={0.08}>
                <p className="work-category">{entry.category}</p>
                <h2>{entry.name}</h2>
                <p className="work-summary">{entry.summary}</p>
                <p className="work-role">{entry.role}</p>
              </Reveal>
            </article>
          ))}
        </section>

        <section className="next-step" aria-labelledby="next-title">
          <Reveal>
            <h2 id="next-title">Replace the story. Keep the structure.</h2>
            <p>Swap the mock names, descriptions, outcomes, links, and images when your real work is ready.</p>
            <MagneticLink href="mailto:hello@example.com" label="Contact" />
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
