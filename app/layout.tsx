import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plop! — Librería de barrio",
  description: "Plop! Librería de barrio",
};

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/regaleria", label: "Regalería" },
  { href: "/fotocopias", label: "Fotocopias" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <header className="sticky top-0 z-10 border-b border-wood-100 bg-paper-50/95 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
            <Link href="/" className="text-lg font-bold text-wood-800">
              Plop!
            </Link>
            <div className="flex flex-wrap gap-4 text-sm text-ink-600">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-terracotta-600">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
