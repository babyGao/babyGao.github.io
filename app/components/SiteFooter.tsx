import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026 Kai Lin. Mock portfolio.</p>
      <div>
        <Link href="/work">Archive</Link>
        <Link href="mailto:hello@example.com">Contact</Link>
      </div>
    </footer>
  );
}
