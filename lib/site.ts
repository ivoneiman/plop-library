const urlExplicita = process.env.NEXT_PUBLIC_SITE_URL;
const urlVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

export const SITE_URL = urlExplicita ?? urlVercel ?? "http://localhost:3000";

export const NEGOCIO = {
  nombre: "Plop!",
  localidad: "Manuel B. Gonnet",
  partido: "La Plata",
  provincia: "Buenos Aires",
  pais: "AR",
  titulo: "Plop! — Librería y fotocopiadora en Manuel B. Gonnet, La Plata",
  descripcion:
    "Librería y fotocopiadora de barrio en Manuel B. Gonnet, La Plata. Libros, regalería y fotocopias con atención de barrio.",
};
