"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { PDFDocument } from "pdf-lib";
import { buildWhatsAppUrl, construirMensajeFotocopias } from "@/lib/whatsapp";
import { calcularTotalFotocopias } from "@/lib/cotizacion";
import { CotizacionFotocopias } from "@/components/CotizacionFotocopias";
import type { PedidoFotocopia, PreciosFotocopias } from "@/types";

type Props = {
  whatsapp: string;
  precios: PreciosFotocopias;
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
const LIMITE_HOJAS = 400;

type Estado = "idle" | "enviando" | "enviado" | "error";
type ModoPaginas = "auto" | "manual";

export function FotocopiasForm({ whatsapp, precios }: Props) {
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [pedido, setPedido] = useState<PedidoFotocopia | null>(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [totalPedido, setTotalPedido] = useState(0);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoError, setArchivoError] = useState("");
  const [paginasArchivo, setPaginasArchivo] = useState(1);
  const [modoPaginas, setModoPaginas] = useState<ModoPaginas>("manual");
  const [leyendoPdf, setLeyendoPdf] = useState(false);

  const [cantidad, setCantidad] = useState(1);
  const [color, setColor] = useState<PedidoFotocopia["color"]>("Blanco y negro");
  const [faz, setFaz] = useState<PedidoFotocopia["faz"]>("Simple faz");
  const [anillado, setAnillado] = useState(false);

  const hojasTotal = archivo ? paginasArchivo * cantidad : 0;
  const totalEstimado = calcularTotalFotocopias(hojasTotal, color, faz, anillado, precios);
  const superaLimite = hojasTotal > LIMITE_HOJAS;

  async function handleArchivoChange(evento: ChangeEvent<HTMLInputElement>) {
    const nuevoArchivo = evento.target.files?.[0] ?? null;
    setArchivoError("");
    setArchivo(null);

    if (!nuevoArchivo) return;

    if (nuevoArchivo.size > TAMANIO_MAXIMO) {
      setArchivoError("El archivo supera el máximo de 10MB.");
      evento.target.value = "";
      return;
    }
    if (!TIPOS_ACEPTADOS.includes(nuevoArchivo.type)) {
      setArchivoError("Formato no admitido. Subí un PDF, Word o imagen.");
      evento.target.value = "";
      return;
    }

    setArchivo(nuevoArchivo);

    if (nuevoArchivo.type === "application/pdf") {
      setLeyendoPdf(true);
      try {
        const bytes = await nuevoArchivo.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setPaginasArchivo(Math.max(1, pdf.getPageCount()));
        setModoPaginas("auto");
      } catch {
        setModoPaginas("manual");
        setPaginasArchivo(1);
      } finally {
        setLeyendoPdf(false);
      }
    } else {
      setModoPaginas("manual");
      setPaginasArchivo(1);
    }
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErrorMensaje("");

    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const nombre = ((datos.get("nombre") as string) ?? "").trim();

    if (!archivo) {
      setErrorMensaje("Elegí un archivo para subir.");
      return;
    }
    if (!nombre) {
      setErrorMensaje("Contanos tu nombre para poder confirmarte el pedido.");
      return;
    }
    if (superaLimite) return;

    const comentario = (datos.get("comentario") as string) ?? "";

    setEstado("enviando");

    try {
      const blob = await upload(archivo.name, archivo, {
        access: "public",
        handleUploadUrl: "/api/fotocopias/upload",
      });

      const pedidoConArchivo: PedidoFotocopia = {
        archivoUrl: blob.url,
        archivoNombre: archivo.name,
        paginasArchivo,
        cantidad,
        color,
        faz,
        anillado,
        comentario,
      };

      const total = calcularTotalFotocopias(hojasTotal, color, faz, anillado, precios);
      const mensaje = construirMensajeFotocopias({
        nombreArchivo: pedidoConArchivo.archivoNombre,
        urlArchivo: pedidoConArchivo.archivoUrl,
        paginasArchivo,
        cantidadCopias: cantidad,
        hojasTotal,
        color,
        dobleFaz: faz === "Doble faz",
        anillado,
        total,
        nombre,
      });
      const linkWhatsapp = buildWhatsAppUrl(whatsapp, mensaje);

      // Best-effort: no bloquea el envío por WhatsApp si el mail al local falla.
      fetch("/api/fotocopias/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoConArchivo),
      }).catch(() => {});

      setPedido(pedidoConArchivo);
      setNombreCliente(nombre);
      setTotalPedido(total);
      setEstado("enviado");

      window.open(linkWhatsapp, "_blank", "noopener,noreferrer");
    } catch {
      setErrorMensaje("Hubo un problema al subir el archivo. Probá de nuevo.");
      setEstado("error");
    }
  }

  if (estado === "enviado" && pedido) {
    const mensajeWhatsapp = construirMensajeFotocopias({
      nombreArchivo: pedido.archivoNombre,
      urlArchivo: pedido.archivoUrl,
      paginasArchivo: pedido.paginasArchivo,
      cantidadCopias: pedido.cantidad,
      hojasTotal: pedido.paginasArchivo * pedido.cantidad,
      color: pedido.color,
      dobleFaz: pedido.faz === "Doble faz",
      anillado: pedido.anillado,
      total: totalPedido,
      nombre: nombreCliente,
    });
    const linkWhatsapp = buildWhatsAppUrl(whatsapp, mensajeWhatsapp);

    return (
      <div className="shadow-soft mt-6 rounded-2xl border-2 border-green-accent bg-green-accent/10 px-4 py-6 text-center">
        <p className="font-display text-lg font-bold text-green-accent">¡Pedido enviado!</p>
        <p className="mt-1 text-sm text-kraft-600">
          Ya te abrimos WhatsApp con el detalle del pedido. Si no se abrió, tocá el botón de abajo.
        </p>
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-mustard-500 px-5 py-3 font-bold text-mustard-900 transition hover:brightness-95"
        >
          Enviar pedido por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-soft space-y-6 rounded-3xl border-2 border-kraft-100 bg-white p-5 sm:p-8"
    >
      <div className="space-y-2">
        <label htmlFor="archivo" className="block text-sm font-bold text-kraft-700">
          Archivo a imprimir (PDF, Word o imagen, máx 10MB)
        </label>
        <p className="text-xs text-kraft-500">
          Por ahora aceptamos un archivo por pedido. ¿Tenés varios? Mandanos uno por pedido, así
          los organizamos mejor 🙂
        </p>

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
            ref={inputArchivoRef}
            id="archivo"
            name="archivo"
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleArchivoChange}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => inputArchivoRef.current?.click()}
            className="rounded-xl bg-kraft-100 px-4 py-2 text-sm font-bold text-kraft-800 transition hover:bg-kraft-200"
          >
            Seleccionar archivo
          </button>
          <p className="mt-2 text-xs text-kraft-400">Soporta PDF, Word, JPG, PNG</p>
        </div>

        {archivo && (
          <div className="flex items-center gap-2 rounded-xl border-2 border-green-accent bg-green-accent/10 px-4 py-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 flex-shrink-0 text-green-accent"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="break-words text-sm font-semibold text-kraft-800">{archivo.name}</span>
          </div>
        )}
        {archivoError && <p className="text-sm font-semibold text-mustard-700">{archivoError}</p>}
      </div>

      {archivo && (
        <div className="space-y-2">
          <label className="block text-sm font-bold text-kraft-700">
            Cantidad de páginas de tu archivo
          </label>
          {modoPaginas === "auto" ? (
            <p className="w-fit rounded-xl border-2 border-kraft-200 bg-paper-50 px-4 py-2.5 font-bold text-kraft-900">
              {leyendoPdf ? "Contando páginas…" : `${paginasArchivo} páginas detectadas`}
            </p>
          ) : (
            <>
              <input
                type="number"
                min={1}
                value={paginasArchivo}
                onChange={(evento) =>
                  setPaginasArchivo(Math.max(1, Number(evento.target.value) || 1))
                }
                required
                className="w-24 rounded-xl border-2 border-kraft-200 bg-paper-50 px-3 py-2.5 text-center font-bold text-kraft-900 focus:border-mustard-400 focus:outline-none"
              />
              <p className="text-xs text-kraft-400">
                El local confirma la cantidad real al revisar tu pedido.
              </p>
            </>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-bold text-kraft-700">
          Tu nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          placeholder="¿Cómo te llamamos?"
          className="w-full rounded-xl border-2 border-kraft-200 bg-paper-50 px-4 py-2.5 text-kraft-900 placeholder:text-kraft-300 focus:border-mustard-400 focus:outline-none"
        />
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
            value={cantidad}
            onChange={(evento) => setCantidad(Math.max(1, Number(evento.target.value) || 1))}
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
                checked={color === "Blanco y negro"}
                onChange={() => setColor("Blanco y negro")}
                required
                className="peer sr-only"
              />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Blanco y negro
              </span>
            </label>
            <label className="flex-1 border-l-2 border-kraft-200">
              <input
                type="radio"
                name="color"
                value="Color"
                checked={color === "Color"}
                onChange={() => setColor("Color")}
                className="peer sr-only"
              />
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
                checked={faz === "Simple faz"}
                onChange={() => setFaz("Simple faz")}
                required
                className="peer sr-only"
              />
              <span className="block cursor-pointer px-3 py-2.5 text-center text-sm font-bold text-kraft-700 transition-colors peer-checked:bg-mustard-100 peer-checked:text-mustard-700">
                Simple faz
              </span>
            </label>
            <label className="flex-1 border-l-2 border-kraft-200">
              <input
                type="radio"
                name="faz"
                value="Doble faz"
                checked={faz === "Doble faz"}
                onChange={() => setFaz("Doble faz")}
                className="peer sr-only"
              />
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
            checked={anillado}
            onChange={(evento) => setAnillado(evento.target.checked)}
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

      <CotizacionFotocopias
        totalEstimado={totalEstimado}
        hayArchivo={Boolean(archivo)}
        paginasArchivo={paginasArchivo}
        cantidad={cantidad}
        hojasTotal={hojasTotal}
      />

      {superaLimite && (
        <div className="rounded-2xl border-2 border-mustard-300 bg-mustard-50 px-4 py-3 text-sm font-semibold text-mustard-800">
          Este pedido supera lo que podemos resolver en el momento (400 hojas). Escribinos directo
          por WhatsApp para coordinarlo.
          <a
            href={buildWhatsAppUrl(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block underline"
          >
            Abrir WhatsApp
          </a>
        </div>
      )}

      {errorMensaje && <p className="text-sm font-semibold text-mustard-700">{errorMensaje}</p>}

      <div className="border-t-2 border-kraft-100 pt-5">
        <button
          type="submit"
          disabled={estado === "enviando" || leyendoPdf || superaLimite}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-mustard-500 py-4 font-bold text-mustard-900 shadow-md transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : "Enviar pedido"}
        </button>
      </div>
    </form>
  );
}
