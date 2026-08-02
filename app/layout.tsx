import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:4173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Kai Lin | Creative Technologist",
      template: "%s | Kai Lin",
    },
    description: "A cinematic portfolio for product design, creative technology, and motion systems.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Kai Lin | Creative Technologist",
      description: "Digital products and spatial identities shaped through code, motion, and restraint.",
      images: [{ url: `${origin}/og.png`, width: 1672, height: 941, alt: "Kai Lin, Systems felt" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kai Lin | Creative Technologist",
      description: "Digital products and spatial identities shaped through code, motion, and restraint.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
