import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getConfig } from "@/lib/notion";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const accesos = [
  {
    href: "/catalogo",
    titulo: "Catálogo de Libros",
    descripcion: "Novelas, ensayos, infantiles y más. Encontrá tu próxima lectura.",
    acento: "accent-pink" as const,
    imagen: "/images/home/libros-home.jpg",
    imagenAlt: "Estantería de libros en Plop!",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-5 sm:w-5 md:h-9 md:w-9" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.5C10.5 5.2 8.2 4.5 5.5 4.5c-.8 0-1.5.7-1.5 1.5v11c0 .8.7 1.5 1.5 1.5 2.7 0 5 .7 6.5 2 1.5-1.3 3.8-2 6.5-2 .8 0 1.5-.7 1.5-1.5v-11c0-.8-.7-1.5-1.5-1.5-2.7 0-5 .7-6.5 2Zm0 0v13"
        />
      </svg>
    ),
  },
  {
    href: "/regaleria",
    titulo: "Regalería y Papelería",
    descripcion: "Detalles únicos, cuadernos artesanales y artículos de escritura.",
    acento: "turquoise" as const,
    imagen: "/images/home/regaleria-home.jpg",
    imagenAlt: "Regalería y papelería en Plop!",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-5 sm:w-5 md:h-9 md:w-9" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Zm-1-3.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5V9H3V5.5ZM12 4v17M12 9c-1.5-3-5-3-5-1s2 2 5 1Zm0 0c1.5-3 5-3 5-1s-2 2-5 1Z"
        />
      </svg>
    ),
  },
  {
    href: "/fotocopias",
    titulo: "Fotocopias e Impresiones",
    descripcion: "Servicio rápido y de calidad para tus apuntes y documentos.",
    acento: "mustard" as const,
    imagen: "/images/home/escolares-home.jpg",
    imagenAlt: "Útiles escolares y fotocopias en Plop!",
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-5 sm:w-5 md:h-9 md:w-9" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9V4h9l3 3v2M6 9H4.5A1.5 1.5 0 0 0 3 10.5v6A1.5 1.5 0 0 0 4.5 18H6m0-9h12a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H18M6 14h12v6H6v-6Z"
        />
      </svg>
    ),
  },
];

const acentoClases = {
  "accent-pink": "text-accent-pink-500",
  turquoise: "text-turquoise",
  mustard: "text-mustard-500",
};

export default async function Home() {
  const config = await getConfig();

  return (
    <main className="min-h-screen bg-paper-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-16 lg:py-20">
        {/* Hero */}
        <section className="mb-16 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <div className="flex flex-col gap-4 md:w-1/2">
            <h1 className="font-display text-4xl font-black uppercase leading-[1.05] text-mustard-500 sm:text-5xl">
              Tu rincón de historias en el barrio
            </h1>
            <p className="text-lg font-semibold text-kraft-500">
              Descubrí nuevos mundos, encontrá el regalo perfecto o imprimí tus ideas. Todo en un
              ambiente cálido y cerca tuyo.
            </p>
            {(config.direccion || config.horarioLunVie || config.horarioSab) && (
              <div className="z-1-shadow inline-flex flex-col items-start gap-2 self-center rounded-xl border-2 border-mustard-500/20 bg-mustard-50 p-3 text-sm font-bold text-kraft-700 sm:flex-row sm:items-center sm:gap-4 md:self-start">
                {config.direccion && (
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent-pink-500" stroke="currentColor" strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      />
                    </svg>
                    {config.direccion}
                  </span>
                )}
                {(config.horarioLunVie || config.horarioSab) && (
                  <>
                    <span className="hidden text-mustard-500 sm:inline">|</span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-turquoise" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                      </svg>
                      {config.horarioLunVie && <>Lun a Vie: {config.horarioLunVie}</>}
                      {config.horarioLunVie && config.horarioSab && " · "}
                      {config.horarioSab && <>Sáb: {config.horarioSab}</>}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="z-1-shadow relative h-[260px] w-full overflow-hidden rounded-[2rem] border-4 border-mustard-500/30 md:h-[380px] md:w-1/2">
            <Image
              src="/images/home/libreria-estanterias-local.png"
              alt="Interior de Plop!, librería de barrio con estanterías de libros"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {accesos.map((acceso) => {
            const colorIcono = acentoClases[acceso.acento];
            return (
              <Link
                key={acceso.href}
                href={acceso.href}
                className="group z-1-shadow flex flex-col overflow-hidden rounded-xl border-2 border-kraft-100 bg-white transition-transform duration-300 hover:-translate-y-2 sm:rounded-2xl md:rounded-[2rem]"
              >
                <div className="relative h-16 w-full overflow-hidden sm:h-24 md:h-36">
                  <Image
                    src={acceso.imagen}
                    alt={acceso.imagenAlt}
                    fill
                    sizes="(max-width: 768px) 33vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-1 left-1 flex h-6 w-6 -rotate-3 items-center justify-center rounded-md bg-white/90 shadow-md backdrop-blur-sm transition-transform group-hover:rotate-0 sm:bottom-2 sm:left-2 sm:h-9 sm:w-9 sm:rounded-lg md:bottom-3 md:left-3 md:h-14 md:w-14 md:rounded-2xl">
                    <span className={colorIcono}>{acceso.icono}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-1.5 sm:p-3 md:p-6">
                  <h2 className="font-display mb-0.5 text-[11px] font-black leading-tight text-mustard-500 sm:mb-1 sm:text-base md:text-2xl">
                    {acceso.titulo}
                  </h2>
                  <p className="hidden font-medium text-kraft-600 sm:block sm:text-xs md:text-base">
                    {acceso.descripcion}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
