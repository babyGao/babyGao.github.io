import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Kai Lin home">
        K/L
      </Link>
      <nav aria-label="Primary navigation">
        <Link className="nav-optional" href="/#about">About</Link>
        <Link className="nav-optional" href="/#work">View work</Link>
        <Link href="/work">Archive</Link>
        <Link className="nav-contact" href="mailto:hello@example.com">Contact</Link>
      </nav>
    </header>
  );
}
