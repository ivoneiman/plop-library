import { Client } from "@notionhq/client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDataSourceResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { list, put } from "@vercel/blob";
import type { Config, PreciosFotocopias, Producto } from "@/types";
import { normalizar } from "./normalizar";

/**
 * Busca un campo por nombre en una lista de pares {campo, valor} leídos de
 * Notion, comparando de forma normalizada (sin tildes/mayúsculas) para que
 * variaciones de tipeo en Notion (ej. "Direccion" vs "Dirección") no rompan
 * la lectura.
 */
export function buscarCampoConfig(
  campos: { campo: string; valor: string }[],
  nombreBuscado: string,
): string | undefined {
  const buscado = normalizar(nombreBuscado);
  return campos.find(({ campo }) => normalizar(campo) === buscado)?.valor;
}

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_DATABASE_ID as string;
const configDatabaseId = process.env.NOTION_CONFIG_DATABASE_ID as string;

function esPaginaCompleta(
  page: QueryDataSourceResponse["results"][number],
): page is PageObjectResponse {
  return page.object === "page" && "properties" in page;
}

function esUrlTemporalDeNotion(url: string): boolean {
  return url.includes("amazonaws.com") || url.includes("notion-static.com");
}

// ponytail: sin lock entre requests concurrentes; en el peor caso dos
// requests simultáneas migran la misma foto dos veces (subida duplicada
// inofensiva, misma pathname), no una condición de carrera destructiva.
async function obtenerFotoUrlEstable(pageId: string, notionUrl: string): Promise<string> {
  const pathname = `productos/${pageId}.jpg`;

  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const existente = blobs.find((blob) => blob.pathname === pathname);
  if (existente) return existente.url;

  try {
    const respuesta = await fetch(notionUrl);
    if (!respuesta.ok) throw new Error(`status ${respuesta.status}`);
    const buffer = await respuesta.arrayBuffer();

    const { url } = await put(pathname, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: respuesta.headers.get("content-type") ?? "image/jpeg",
    });

    return url;
  } catch (error) {
    console.error(`No se pudo migrar la foto de Notion a Blob (página ${pageId}):`, error);
    return notionUrl;
  }
}

async function mapearProducto(page: PageObjectResponse): Promise<Producto> {
  const props = page.properties;

  const nombre =
    props.Nombre?.type === "title"
      ? props.Nombre.title.map((texto) => texto.plain_text).join("")
      : "";

  const categoriaNotion =
    props.Categoria?.type === "select" ? (props.Categoria.select?.name ?? "") : "";
  const categoria =
    (buscarCampoConfig([{ campo: "Regaleria", valor: "Regalería" }], categoriaNotion) as
      | Producto["categoria"]
      | undefined) ?? "Libros";

  const subcategoria =
    props.Subcategoria?.type === "select" ? (props.Subcategoria.select?.name ?? null) : null;

  const precio = props.Precio?.type === "number" ? (props.Precio.number ?? 0) : 0;
  const stock = props.Stock?.type === "number" ? (props.Stock.number ?? 0) : 0;

  const primeraFoto = props.Foto?.type === "files" ? props.Foto.files[0] : undefined;
  const fotoUrlNotion = primeraFoto
    ? primeraFoto.type === "external"
      ? primeraFoto.external.url
      : primeraFoto.type === "file"
        ? primeraFoto.file.url
        : null
    : null;

  const fotoUrl =
    fotoUrlNotion && esUrlTemporalDeNotion(fotoUrlNotion)
      ? await obtenerFotoUrlEstable(page.id, fotoUrlNotion)
      : fotoUrlNotion;

  const disponible =
    props.Disponible?.type === "formula" && props.Disponible.formula.type === "boolean"
      ? (props.Disponible.formula.boolean ?? false)
      : false;
  const destacado = props.Destacado?.type === "checkbox" ? props.Destacado.checkbox : false;

  return {
    id: page.id,
    nombre,
    categoria,
    subcategoria,
    precio,
    stock,
    fotoUrl,
    disponible,
    destacado,
  };
}

async function getDataSourceId(databaseId: string): Promise<string> {
  const database = (await notion.databases.retrieve({
    database_id: databaseId,
  })) as DatabaseObjectResponse;

  return database.data_sources[0].id;
}

export async function getCatalogo(): Promise<Producto[]> {
  const dataSourceId = await getDataSourceId(databaseId);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "Disponible",
      formula: { checkbox: { equals: true } },
    },
  });

  return Promise.all(response.results.filter(esPaginaCompleta).map(mapearProducto));
}

export async function getProductosPorNombre(nombres: string[]): Promise<Producto[]> {
  const dataSourceId = await getDataSourceId(databaseId);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      or: nombres.map((nombre) => ({
        property: "Nombre",
        title: { equals: nombre },
      })),
    },
  });

  return Promise.all(response.results.filter(esPaginaCompleta).map(mapearProducto));
}

function mapearConfigItem(page: PageObjectResponse): { campo: string; valor: string } {
  const props = page.properties;

  const campo =
    props.Campo?.type === "title" ? props.Campo.title.map((texto) => texto.plain_text).join("") : "";

  const valor =
    props.Valor?.type === "rich_text"
      ? props.Valor.rich_text.map((texto) => texto.plain_text).join("")
      : "";

  return { campo, valor };
}

export async function getConfig(): Promise<Config> {
  const dataSourceId = await getDataSourceId(configDatabaseId);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
  });

  const items = response.results.filter(esPaginaCompleta).map(mapearConfigItem);

  return {
    direccion: buscarCampoConfig(items, "Dirección") ?? "",
    horarioLunVie: buscarCampoConfig(items, "Horario Lun-Vie") ?? "",
    horarioSab: buscarCampoConfig(items, "Horario Sáb") ?? "",
    whatsapp: buscarCampoConfig(items, "WhatsApp") ?? "",
    instagram: buscarCampoConfig(items, "Instagram") ?? "",
  };
}

export async function getPreciosFotocopias(): Promise<PreciosFotocopias> {
  const dataSourceId = await getDataSourceId(configDatabaseId);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
  });

  const items = response.results.filter(esPaginaCompleta).map(mapearConfigItem);

  return {
    precioCopiaByN: Number(buscarCampoConfig(items, "Precio Copia ByN")) || 0,
    precioCopiaColor: Number(buscarCampoConfig(items, "Precio Copia Color")) || 0,
    descuentoDobleFazPorcentaje: Number(buscarCampoConfig(items, "Descuento Doble Faz %")) || 0,
    precioAnillado: Number(buscarCampoConfig(items, "Precio Anillado")) || 0,
  };
}
