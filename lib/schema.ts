import type { Config } from "@/types";
import { NEGOCIO, SITE_URL } from "@/lib/site";

type EspecificacionHorario = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
};

function parsearRangoHorario(rango: string): { opens: string; closes: string } | null {
  const match = rango.match(/(\d{1,2})(?::(\d{2}))?\s*(?:a|-)\s*(\d{1,2})(?::(\d{2}))?/i);
  if (!match) return null;

  const [, horaInicio, minutoInicio, horaFin, minutoFin] = match;
  const formatear = (hora: string, minuto?: string) =>
    `${hora.padStart(2, "0")}:${(minuto ?? "00").padStart(2, "0")}`;

  return { opens: formatear(horaInicio, minutoInicio), closes: formatear(horaFin, minutoFin) };
}

function buildOpeningHours(config: Config): EspecificacionHorario[] {
  const especificaciones: EspecificacionHorario[] = [];

  if (config.horarioLunVie) {
    const rango = parsearRangoHorario(config.horarioLunVie);
    if (rango) {
      especificaciones.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        ...rango,
      });
    }
  }

  if (config.horarioSab) {
    const rango = parsearRangoHorario(config.horarioSab);
    if (rango) {
      especificaciones.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        ...rango,
      });
    }
  }

  return especificaciones;
}

export function buildLocalBusinessJsonLd(config: Config) {
  const telefono = config.whatsapp ? `+${config.whatsapp.replace(/[^\d]/g, "")}` : undefined;
  const instagramUrl = config.instagram
    ? config.instagram.startsWith("http")
      ? config.instagram
      : `https://instagram.com/${config.instagram.replace(/^@/, "")}`
    : undefined;
  const openingHoursSpecification = buildOpeningHours(config);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#negocio`,
    name: NEGOCIO.nombre,
    description: NEGOCIO.descripcion,
    url: SITE_URL,
    ...(telefono && { telephone: telefono }),
    address: {
      "@type": "PostalAddress",
      ...(config.direccion && { streetAddress: config.direccion }),
      addressLocality: NEGOCIO.localidad,
      addressRegion: NEGOCIO.provincia,
      addressCountry: NEGOCIO.pais,
    },
    ...(instagramUrl && { sameAs: [instagramUrl] }),
    ...(openingHoursSpecification.length > 0 && { openingHoursSpecification }),
  };
}
