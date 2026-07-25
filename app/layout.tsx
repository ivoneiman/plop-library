import type { Metadata } from "next";
import { Rubik, Quicksand } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getConfig } from "@/lib/notion";
import { buildLocalBusinessJsonLd } from "@/lib/schema";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { NEGOCIO, SITE_URL } from "@/lib/site";
import { BottomNav } from "@/components/BottomNav";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: NEGOCIO.titulo,
    template: "%s | Plop!",
  },
  description: NEGOCIO.descripcion,
  openGraph: {
    title: NEGOCIO.titulo,
    description: NEGOCIO.descripcion,
    url: SITE_URL,
    siteName: "Plop!",
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/regaleria", label: "Regalería" },
  { href: "/fotocopias", label: "Fotocopias" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfig();
  const jsonLd = buildLocalBusinessJsonLd(config);
  const instagramHref = config.instagram
    ? config.instagram.startsWith("http")
      ? config.instagram
      : `https://${config.instagram}`
    : null;
  const whatsappHref = config.whatsapp
    ? buildWhatsAppUrl(config.whatsapp, "Hola! Tengo una consulta")
    : null;
  const mapsHref = config.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`
    : null;

  return (
    <html lang="es" className={`${rubik.variable} ${quicksand.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-paper-50 pb-16 font-sans text-kraft-900 antialiased md:pb-0">
        <header className="sticky top-0 z-50 hidden bg-paper-50/95 shadow-sm backdrop-blur md:block">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-16">
            <Link href="/" className="font-display text-2xl font-black text-mustard-500 active:scale-95">
              Plop!
            </Link>
            <div className="flex flex-wrap items-center gap-6 font-sans text-base font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-kraft-500 transition-colors duration-200 hover:text-mustard-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
        <footer className="mt-16 border-t-2 border-kraft-100 bg-white px-4 py-10 sm:px-6 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <p className="font-display text-3xl font-black text-mustard-500">Plop!</p>
              <p className="mt-2 text-sm font-medium text-kraft-600">
                Tu librería de barrio. Un espacio pensado para los amantes de las historias y el
                papel.
              </p>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
              {(instagramHref || whatsappHref) && (
                <div>
                  <h3 className="font-display mb-2 text-sm font-black uppercase tracking-wide text-accent-pink-500">
                    Enlaces
                  </h3>
                  <ul className="flex flex-col gap-1.5 text-sm font-bold text-kraft-700">
                    {instagramHref && (
                      <li>
                        <a
                          href={instagramHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-mustard-500"
                        >
                          Instagram
                        </a>
                      </li>
                    )}
                    {whatsappHref && (
                      <li>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-turquoise"
                        >
                          WhatsApp
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {(config.direccion || config.horarioLunVie || config.horarioSab) && (
                <div>
                  <h3 className="font-display mb-2 text-sm font-black uppercase tracking-wide text-accent-pink-500">
                    Visitanos
                  </h3>
                  <ul className="flex flex-col gap-1.5 text-sm font-medium text-kraft-600">
                    {config.direccion && (
                      <li>
                        {mapsHref ? (
                          <a
                            href={mapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-mustard-500"
                          >
                            {config.direccion}
                          </a>
                        ) : (
                          config.direccion
                        )}
                      </li>
                    )}
                    {config.horarioLunVie && <li>Lun a Vie: {config.horarioLunVie}</li>}
                    {config.horarioSab && <li>Sáb: {config.horarioSab}</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-6xl text-xs font-medium text-kraft-400">
            © {new Date().getFullYear()} Plop! — Librería de barrio.
          </p>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
