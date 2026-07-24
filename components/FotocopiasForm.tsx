"use client";

import { useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { PedidoFotocopia } from "@/types";

type Props = {
  whatsapp: string;
};

const TAMANIO_MAXIMO = 10 * 1024 * 1024;
const TIPOS_ACEPTADOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
];

type Estado = "idle" | "enviando" | "enviado" | "error";

export function FotocopiasForm({ whatsapp }: Props) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [pedido, setPedido] = useState<PedidoFotocopia | null>(null);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorMensaje("");

    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const archivo = datos.get("archivo") as File | null;

    if (!archivo || archivo.size === 0) {
      setErrorMensaje("Elegí un archivo para subir.");
      return;
    }
    if (archivo.size > TAMANIO_MAXIMO) {
      setErrorMensaje("El archivo supera el máximo de 10MB.");
      return;
    }
    if (!TIPOS_ACEPTADOS.includes(archivo.type)) {
      setErrorMensaje("Formato no admitido. Subí un PDF, Word o imagen.");
      return;
    }

    const nuevoPedido: PedidoFotocopia = {
      archivoUrl: "",
      archivoNombre: archivo.name,
      cantidad: Number(datos.get("cantidad")) || 1,
      color: datos.get("color") as PedidoFotocopia["color"],
      faz: datos.get("faz") as PedidoFotocopia["faz"],
      anillado: datos.get("anillado") === "on",
      comentario: (datos.get("comentario") as string) ?? "",
    };

    setEstado("enviando");

    try {
      const blob = await upload(archivo.name, archivo, {
        access: "public",
        handleUploadUrl: "/api/fotocopias/upload",
      });

      const pedidoConArchivo: PedidoFotocopia = { ...nuevoPedido, archivoUrl: blob.url };

      const respuesta = await fetch("/api/fotocopias/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoConArchivo),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo avisar al local");
      }

      setPedido(pedidoConArchivo);
      setEstado("enviado");
    } catch {
      setErrorMensaje("Hubo un problema al enviar el pedido. Probá de nuevo.");
      setEstado("error");
    }
  }

  if (estado === "enviado" && pedido) {
    const mensajeWhatsapp = `Hola! Acabo de enviar un pedido de fotocopias (${pedido.archivoNombre}, ${pedido.cantidad} copias, ${pedido.color.toLowerCase()}, ${pedido.faz.toLowerCase()}${pedido.anillado ? ", con anillado" : ""}). ¿Me confirman cuándo lo puedo pasar a retirar?`;
    const linkWhatsapp = buildWhatsAppUrl(whatsapp, mensajeWhatsapp);

    return (
      <div className="z-1-shadow mt-6 rounded-2xl border-2 border-green-accent bg-green-accent/10 px-4 py-6 text-center">
        <p className="font-display text-lg font-bold text-green-accent">¡Pedido enviado!</p>
        <p className="mt-1 text-sm text-kraft-600">
          Recibimos tu archivo y el detalle del pedido. Te confirmamos por WhatsApp cuándo pasarlo a
          retirar.
        </p>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-mustard-500 px-5 py-3 font-bold text-mustard-900 transition hover:brightness-95"
        >
          Avisar también por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="z-1-shadow space-y-6 rounded-3xl border-2 border-kraft-100 bg-white p-5 sm:p-8"
    >
      <div className="space-y-2">
        <label htmlFor="archivo" className="block text-sm font-bold text-kraft-700">
          Archivos a imprimir (PDF, Word o imagen, máx 10MB)
        </label>
        <div className="rounded-2xl border-2 border-dashed border-kraft-300 bg-paper-50 p-6 text-center transition-colors hover:bg-paper-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-2 h-9 w-9 text-accent-pink-500"
            stroke="currentColor"
            strokeWidth={1.7}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0 4 4m-4-4-4 4M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
            />
          </svg>
          <input
            id="archivo"
            name="archivo"
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            required
            className="mx-auto block text-sm text-kraft-700 file:mr-3 file:rounded-xl file:border-0 file:bg-kraft-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-kraft-800 hover:file:bg-kraft-200"
          />
          <p className="mt-2 text-xs text-kraft-400">Soporta PDF, Word, JPG, PNG</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="cantidad" className="block text-sm font-bold text-kraft-700">
            Cantidad de copias
          </label>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            min={1}
            defaultValue={1}
            required
            className="w-24 rounded-xl border-2 border-kraft-200 bg-paper-50 px-3 py-2.5 text-center font-bold text-kraft-900 focus:border-mustard-400 focus:outline-none"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-bold text-kraft-700">Color</legend>
          <div className="flex overflow-hidden rounded-xl border-2 border-kraft-200">
            <label className="flex-1">
              <input
                type="radio"
                name="color"
                value="Blanco y negro"
                defaultChecked
                required
                className="peer sr-only"
              />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Blanco y negro
              </span>
            </label>
            <label className="flex-1 border-l-2 border-kraft-200">
              <input type="radio" name="color" value="Color" className="peer sr-only" />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Color
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-bold text-kraft-700">Faz</legend>
          <div className="flex overflow-hidden rounded-xl border-2 border-kraft-200">
            <label className="flex-1">
              <input
                type="radio"
                name="faz"
                value="Simple faz"
                defaultChecked
                required
                className="peer sr-only"
              />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Simple faz
              </span>
            </label>
            <label className="flex-1 border-l-2 border-kraft-200">
              <input type="radio" name="faz" value="Doble faz" className="peer sr-only" />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Doble faz
              </span>
            </label>
          </div>
        </fieldset>

        <label className="flex items-center gap-2.5 text-sm font-bold text-kraft-700">
          <input
            type="checkbox"
            name="anillado"
            className="h-5 w-5 rounded border-2 border-kraft-300 text-mustard-500 focus:ring-mustard-400"
          />
          Anillado
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="comentario" className="block text-sm font-bold text-kraft-700">
          Comentario
        </label>
        <textarea
          id="comentario"
          name="comentario"
          rows={3}
          placeholder="Aclaraciones sobre el pedido (opcional)"
          className="w-full resize-none rounded-2xl border-2 border-kraft-200 bg-paper-50 px-4 py-3 text-kraft-900 placeholder:text-kraft-300 focus:border-mustard-400 focus:outline-none"
        />
      </div>

      {errorMensaje && <p className="text-sm font-semibold text-mustard-700">{errorMensaje}</p>}

      <div className="border-t-2 border-kraft-100 pt-5">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-mustard-500 py-4 font-bold text-mustard-900 shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : "Enviar pedido"}
        </button>
      </div>
    </form>
  );
}
