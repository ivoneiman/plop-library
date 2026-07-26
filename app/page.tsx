import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/images/home/plop-libreria-frente-vidriera-costado.webp";
import { FotoPlaceholder } from "@/components/FotoPlaceholder";
import { getCatalogo, getConfig, getProductosPorNombre } from "@/lib/notion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 300;

// Placeholder gris genérico para imágenes remotas de Notion (no se puede generar blur real sin bajar cada foto).
const SHIMMER_BLUR =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="#e7ded1"/></svg>'
  ).toString("base64");

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const accesos = [
  {
    href: "/catalogo",
    titulo: "Catálogo de Libros",
    tituloCorto: "Catálogo",
    descripcion: "Novelas, ensayos, infantiles y más. Encontrá tu próxima lectura.",
    acento: "accent-pink" as const,
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" stroke="currentColor" strokeWidth={1.6}>
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
    tituloCorto: "Regalería",
    descripcion: "Detalles únicos, cuadernos artesanales y artículos de escritura.",
    acento: "turquoise" as const,
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" stroke="currentColor" strokeWidth={1.6}>
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
    tituloCorto: "Fotocopias & Impresiones",
    descripcion: "Servicio rápido y de calidad para tus apuntes y documentos.",
    acento: "mustard" as const,
    mobileSpan2: true,
    icono: (
      <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" stroke="currentColor" strokeWidth={1.6}>
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
  "accent-pink": {
    iconoBg: "bg-accent-pink-500/20",
    iconoTexto: "text-accent-pink-500",
    borde: "hover:border-accent-pink-500/30",
  },
  turquoise: {
    iconoBg: "bg-turquoise/20",
    iconoTexto: "text-turquoise",
    borde: "hover:border-turquoise/30",
  },
  mustard: {
    iconoBg: "bg-mustard-500/20",
    iconoTexto: "text-mustard-600",
    borde: "hover:border-mustard-500/30",
  },
};

const destacadosCopy = [
  {
    nombreNotion: "Día del niño",
    titulo: "Combo Día del Niño",
    descripcion:
      "Armamos un combo especial para el Día del Niño con marcadores, stickers y un librito para pintar sin límites. Ideal para sorprender sin vueltas.",
    tituloClase: "text-turquoise",
  },
  {
    nombreNotion: "Marcadores Acrílicos Trabí",
    titulo: "Marcadores Acrílicos Trabí",
    descripcion:
      "Vení a probar los marcadores de acrílico Trabí. Funcionan en todo: plástico, vidrio, madera, lo que quieras. Y lo mejor… ¡más económicos que los Posca!",
    tituloClase: "text-mustard-500",
  },
  {
    nombreNotion: "Kit Pink Elephant",
    titulo: "Colab Pink Elephant",
    descripcion:
      "Colaboración con @pinkelephantdeco. En Plop! encontrás estos kits con los combos más lindos y originales. Ideal para sorprender, para darte un gusto o simplemente porque sí 💖",
    tituloClase: "text-accent-pink-500",
  },
];

const testimonios = [
  {
    texto:
      "Siempre encuentro ese libro raro que estoy buscando. La atención de las chicas es increíble, te recomiendan con mucha pasión.",
    nombre: "Martín S.",
    rol: "Vecino hace 5 años",
    inicial: "M",
    acento: "accent-pink",
  },
  {
    texto:
      "Mis hijos aman la sección infantil. Los fines de semana venimos a las rondas de cuentos y siempre salimos con un librito nuevo.",
    nombre: "Carolina T.",
    rol: "Mamá de dos",
    inicial: "C",
    acento: "turquoise",
  },
  {
    texto:
      "Vengo a hacer las fotocopias para la facu y me termino llevando marcadores, libretas... es imposible resistirse a la regalería.",
    nombre: "Julieta L.",
    rol: "Estudiante",
    inicial: "J",
    acento: "mustard",
  },
] as const;

const testimonioClases = {
  "accent-pink": { bg: "bg-accent-pink-500/20", texto: "text-accent-pink-500", quote: "text-accent-pink-500/20" },
  turquoise: { bg: "bg-turquoise/20", texto: "text-turquoise", quote: "text-turquoise/20" },
  mustard: { bg: "bg-mustard-500/20", texto: "text-mustard-600", quote: "text-mustard-500/20" },
};

export default async function Home() {
  const [productos, productosDestacados, config] = await Promise.all([
    getCatalogo(),
    getProductosPorNombre(destacadosCopy.map((item) => item.nombreNotion)),
    getConfig(),
  ]);

  const novedades = [...productos]
    .sort((a, b) => Number(b.destacado) - Number(a.destacado))
    .slice(0, 10);

  const destacados = destacadosCopy
    .map((item) => {
      const producto = productosDestacados.find((p) => p.nombre === item.nombreNotion);
      return producto?.fotoUrl ? { ...item, imagen: producto.fotoUrl } : null;
    })
    .filter((item): item is (typeof destacadosCopy)[number] & { imagen: string } => item !== null);

  const mapsHref = config.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`
    : null;
  const whatsappHref = config.whatsapp
    ? buildWhatsAppUrl(config.whatsapp, "Hola! Tengo una consulta")
    : null;

  return (
    <main className="min-h-screen bg-paper-50">
      {/* Hero mobile: saludo + ícono, sin foto (idéntico a mockup mobile de Stitch) */}
      <section className="flex flex-col items-center gap-4 px-4 pt-6 text-center md:hidden">
        <div className="mb-1 flex h-24 w-24 rotate-3 items-center justify-center rounded-full border-2 border-kraft-500 bg-mustard-500 shadow-sticker">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-11 w-11 text-mustard-900">
            <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Zm7 12 .9 2.6L22 17.5l-2.1.9L19 21l-.9-2.6L16 17.5l2.1-.9L19 14ZM5 14l.9 2.6L8 17.5l-2.1.9L5 21l-.9-2.6L2 17.5l2.1-.9L5 14Z" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-black leading-[1.1] text-mustard-600">
          ¡Hola!
          <br />
          Bienvenidx a Plop!
        </h1>
        <p className="max-w-sm text-base font-medium text-kraft-600">
          Tu librería de barrio con onda. Libros, regalitos piolas y copias en el acto.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-16 lg:py-20">
        {/* Hero desktop: texto + foto (Stitch "Home - Plop! (Vibrant Alignment)") */}
        <section className="mb-16 hidden items-center gap-10 md:flex">
          <div className="flex flex-col gap-4 md:w-1/2">
            <div className="mb-1 flex h-20 w-20 rotate-[-3deg] items-center justify-center rounded-full border-2 border-kraft-500 bg-mustard-500 shadow-sticker">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9 text-mustard-900">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Zm7 12 .9 2.6L22 17.5l-2.1.9L19 21l-.9-2.6L16 17.5l2.1-.9L19 14ZM5 14l.9 2.6L8 17.5l-2.1.9L5 21l-.9-2.6L2 17.5l2.1-.9L5 14Z" />
              </svg>
            </div>
            <h1 className="font-display text-5xl font-black uppercase leading-[1.05] tracking-tight text-mustard-500 lg:text-6xl">
              Tu rincón de historias en el barrio
            </h1>
            <p className="max-w-lg text-xl font-bold text-kraft-500">
              Descubrí nuevos mundos, encontrá el regalo perfecto o imprimí tus ideas. Todo en un
              ambiente cálido y cerca tuyo.
            </p>
            {(config.direccion || config.horarioLunVie || config.horarioSab) && (
              <div className="inline-flex flex-col items-start gap-2 self-start rounded-2xl border-2 border-kraft-500 bg-mustard-50 p-4 text-sm font-bold text-kraft-700 shadow-sticker sm:flex-row sm:items-center sm:gap-4">
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
          <div className="relative aspect-[4/3] w-full -rotate-1 overflow-hidden rounded-[2rem] border-4 border-kraft-500 shadow-sticker-lg transition-transform duration-300 hover:rotate-0 md:w-1/2">
            <Image
              src={heroImg}
              alt="Vidriera de Plop!, librería de barrio"
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Accesos rápidos mobile: grilla 2x2 con Fotocopias ocupando 2 columnas */}
        <section className="mb-12 grid grid-cols-2 gap-3 md:hidden">
          {accesos.map((acceso) => (
            <Link
              key={acceso.href}
              href={acceso.href}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 border-kraft-500 bg-white p-4 text-center shadow-sticker transition-all active:translate-y-1 active:shadow-none ${
                acceso.mobileSpan2 ? "col-span-2 flex-row" : "flex-col"
              }`}
            >
              <span className={acentoClases[acceso.acento].iconoTexto}>{acceso.icono}</span>
              <span className="text-sm font-bold uppercase tracking-wide text-kraft-800">
                {acceso.tituloCorto}
              </span>
            </Link>
          ))}
        </section>

        {/* Accesos rápidos desktop: tarjetas centradas estilo sticker */}
        <section className="mb-16 hidden gap-6 md:grid md:grid-cols-3">
          {accesos.map((acceso) => {
            const clases = acentoClases[acceso.acento];
            return (
              <Link
                key={acceso.href}
                href={acceso.href}
                className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-kraft-500 bg-white p-6 text-center shadow-sticker transition-all duration-300 hover:-translate-y-1 hover:shadow-sticker-hover"
              >
                <div className={`flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 ${clases.iconoBg}`}>
                  <span className={clases.iconoTexto}>{acceso.icono}</span>
                </div>
                <div>
                  <h2 className="font-display mb-1 text-2xl font-black leading-tight text-mustard-500">
                    {acceso.titulo}
                  </h2>
                  <p className="font-medium text-kraft-600">{acceso.descripcion}</p>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Nuevos Ingresos: catálogo real de Notion, scroll horizontal */}
        {novedades.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="mb-4 flex items-end justify-between md:mb-6">
              <h2 className="font-display text-2xl font-black text-kraft-800 md:text-4xl">
                Nuevos Ingresos
              </h2>
              <Link
                href="/catalogo"
                className="hidden font-bold text-accent-pink-500 transition-colors hover:text-mustard-500 sm:block"
              >
                Ver todo el catálogo →
              </Link>
            </div>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-3">
              {novedades.map((producto) => {
                const linkWhatsapp = buildWhatsAppUrl(config.whatsapp, `Hola! Me interesa ${producto.nombre}`);
                const ultimasUnidades = producto.stock > 0 && producto.stock <= 3;
                return (
                  <a
                    key={producto.id}
                    href={linkWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-[140px] shrink-0 md:w-[220px]"
                  >
                    <div className="relative mb-2 aspect-[2/3] w-full overflow-hidden rounded-lg border-2 border-kraft-200 bg-paper-100 md:h-[200px] md:aspect-auto md:rounded-2xl">
                      {(producto.destacado || ultimasUnidades) && (
                        <span
                          className={`absolute right-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-bold text-white ${
                            producto.destacado ? "bg-accent-pink-500" : "bg-green-accent"
                          }`}
                        >
                          {producto.destacado ? "Destacado" : "¡Últimas unidades!"}
                        </span>
                      )}
                      {producto.fotoUrl ? (
                        <Image
                          src={producto.fotoUrl}
                          alt={producto.nombre}
                          fill
                          sizes="(max-width: 768px) 140px, 220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <FotoPlaceholder categoria={producto.categoria} />
                      )}
                    </div>
                    <p className="hidden text-xs font-bold uppercase tracking-wider text-mustard-600 md:block">
                      {producto.categoria}
                      {producto.subcategoria ? ` · ${producto.subcategoria}` : ""}
                    </p>
                    <h3 className="font-display line-clamp-1 text-sm font-bold text-kraft-800 md:text-xl">
                      {producto.nombre}
                    </h3>
                    <p className="font-display mt-1 text-sm font-black text-turquoise md:text-lg">
                      {formatoPrecio.format(producto.precio)}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Destacados: bloques promocionales */}
        <section className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-3">
          {destacados.map((item) => (
            <div
              key={item.titulo}
              className="group flex flex-col overflow-hidden rounded-[2rem] border-2 border-kraft-100 bg-white shadow-soft transition-all duration-300 md:border-kraft-500 md:shadow-sticker md:hover:-translate-y-1 md:hover:shadow-sticker-hover"
            >
              <div className="relative h-64 w-full md:h-80 md:border-b-2 md:border-kraft-500">
                <Image
                  src={item.imagen}
                  alt={item.titulo}
                  fill
                  placeholder="blur"
                  blurDataURL={SHIMMER_BLUR}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-grow flex-col justify-center p-6">
                <h3 className={`font-display mb-2 text-2xl font-black leading-tight md:text-3xl ${item.tituloClase}`}>
                  {item.titulo}
                </h3>
                <p className="font-medium text-kraft-600">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Voces del Barrio: solo desktop, tal como en el mockup de Stitch */}
        <section className="mb-4 hidden text-center md:block">
          <h2 className="font-display mb-2 text-4xl font-black text-mustard-500">Voces del Barrio</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-kraft-600">
            Lo que dicen nuestros vecinos y visitantes frecuentes sobre la experiencia en Plop!
          </p>
          <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
            {testimonios.map((testimonio) => {
              const clases = testimonioClases[testimonio.acento];
              return (
                <div
                  key={testimonio.nombre}
                  className="shadow-soft relative rounded-[2rem] border-2 border-kraft-100 p-6"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute right-4 top-4 h-14 w-14 ${clases.quote}`}>
                    <path d="M7 7h4v6l-2 4H6l2-4H7V7Zm8 0h4v6l-2 4h-3l2-4h-1V7Z" />
                  </svg>
                  <p className="relative z-10 mb-6 text-lg font-semibold text-kraft-700">
                    &quot;{testimonio.texto}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${clases.bg} ${clases.texto}`}>
                      {testimonio.inicial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-kraft-800">{testimonio.nombre}</h4>
                      <p className="text-xs text-kraft-500">{testimonio.rol}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Encontranos acá: solo mobile, el desktop ya muestra dirección/horario en el hero */}
        {(config.direccion || config.horarioLunVie || config.horarioSab) && (
          <section className="rounded-xl border-2 border-kraft-500 bg-mustard-500 p-5 text-mustard-900 shadow-sticker md:hidden">
            <div className="flex items-start gap-3">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0" stroke="currentColor" strokeWidth={1.6}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                />
              </svg>
              <div>
                <h3 className="font-display mb-1 text-xl font-black">Encontranos acá</h3>
                {config.direccion && <p className="mb-0.5 font-bold">{config.direccion}</p>}
                {config.horarioLunVie && <p className="text-sm opacity-90">Lun a Vie: {config.horarioLunVie}</p>}
                {config.horarioSab && <p className="text-sm opacity-90">Sáb: {config.horarioSab}</p>}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {mapsHref && (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-kraft-500 bg-white py-2 text-sm font-bold uppercase tracking-wide text-mustard-600 transition-transform active:scale-95"
                >
                  Cómo llegar
                </a>
              )}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-kraft-500 bg-kraft-700 py-2 text-sm font-bold uppercase tracking-wide text-white transition-transform active:scale-95"
                >
                  Escribinos
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
