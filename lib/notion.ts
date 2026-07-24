import { Client } from "@notionhq/client";
import type {
  DatabaseObjectResponse,
  PageObjectResponse,
  QueryDataSourceResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Config, Producto } from "@/types";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_DATABASE_ID as string;
const configDatabaseId = process.env.NOTION_CONFIG_DATABASE_ID as string;

function esPaginaCompleta(
  page: QueryDataSourceResponse["results"][number],
): page is PageObjectResponse {
  return page.object === "page" && "properties" in page;
}

function mapearProducto(page: PageObjectResponse): Producto {
  const props = page.properties;

  const nombre =
    props.Nombre?.type === "title"
      ? props.Nombre.title.map((texto) => texto.plain_text).join("")
      : "";

  const categoria: Producto["categoria"] =
    props.Categoria?.type === "select" && props.Categoria.select?.name === "Regaleria"
      ? "Regalería"
      : "Libros";

  const subcategoria =
    props.Subcategoria?.type === "select" ? (props.Subcategoria.select?.name ?? null) : null;

  const precio = props.Precio?.type === "number" ? (props.Precio.number ?? 0) : 0;
  const stock = props.Stock?.type === "number" ? (props.Stock.number ?? 0) : 0;

  const primeraFoto = props.Foto?.type === "files" ? props.Foto.files[0] : undefined;
  const fotoUrl = primeraFoto
    ? primeraFoto.type === "external"
      ? primeraFoto.external.url
      : primeraFoto.type === "file"
        ? primeraFoto.file.url
        : null
    : null;

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

  return response.results.filter(esPaginaCompleta).map(mapearProducto);
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
  const valores = Object.fromEntries(items.map(({ campo, valor }) => [campo, valor]));

  return {
    direccion: valores["Dirección"] ?? "",
    horarioLunVie: valores["Horario Lun-Vie"] ?? "",
    horarioSab: valores["Horario Sáb"] ?? "",
    whatsapp: valores["WhatsApp"] ?? "",
    instagram: valores["Instagram"] ?? "",
  };
}
