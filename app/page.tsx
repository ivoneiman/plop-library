import Link from "next/link";
import { getConfig } from "@/lib/notion";

export const revalidate = 300;

const accesos = [
  {
    href: "/catalogo",
    titulo: "Catálogo",
    descripcion: "Libros nuevos y usados, por autor o género.",
  },
  {
    href: "/regaleria",
    titulo: "Regalería",
    descripcion: "Objetos y regalos para todas las ocasiones.",
  },
  {
    href: "/fotocopias",
    titulo: "Fotocopias",
    descripcion: "Blanco y negro, color, anillado y más.",
  },
];

export default async function Home() {
  const config = await getConfig();

  return (
    <main className="min-h-screen bg-paper-50 text-ink-800">
      <section className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-wood-800">Plop!</h1>
        <p className="text-ink-500">Librería de barrio</p>
        <div className="mt-4 space-y-1 text-sm text-ink-500">
          {config.direccion && <p>{config.direccion}</p>}
          {(config.horarioLunVie || config.horarioSab) && (
            <p>
              {config.horarioLunVie && <>Lun a Vie: {config.horarioLunVie}</>}
              {config.horarioLunVie && config.horarioSab && " · "}
              {config.horarioSab && <>Sáb: {config.horarioSab}</>}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-3xl gap-4 px-6 pb-16 sm:grid-cols-3">
        {accesos.map((acceso) => (
          <Link
            key={acceso.href}
            href={acceso.href}
            className="flex flex-col gap-2 rounded-xl border border-wood-100 bg-white p-5 shadow-sm transition hover:border-terracotta-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-terracotta-600">{acceso.titulo}</h2>
            <p className="text-sm text-ink-500">{acceso.descripcion}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
