import { Resend } from "resend";
import { NextResponse } from "next/server";
import type { PedidoFotocopia } from "@/types";

function esPedidoValido(valor: unknown): valor is PedidoFotocopia {
  if (typeof valor !== "object" || valor === null) return false;
  const pedido = valor as Record<string, unknown>;
  return (
    typeof pedido.archivoUrl === "string" &&
    typeof pedido.archivoNombre === "string" &&
    typeof pedido.paginasArchivo === "number" &&
    typeof pedido.cantidad === "number" &&
    (pedido.color === "Color" || pedido.color === "Blanco y negro") &&
    (pedido.faz === "Simple faz" || pedido.faz === "Doble faz") &&
    typeof pedido.anillado === "boolean" &&
    typeof pedido.comentario === "string"
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json();

  if (!esPedidoValido(body)) {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL as string,
    to: process.env.RESEND_TO_EMAIL as string,
    subject: `Nuevo pedido de fotocopias — ${body.archivoNombre}`,
    html: `
      <h2>Nuevo pedido de fotocopias</h2>
      <ul>
        <li><strong>Archivo:</strong> <a href="${body.archivoUrl}">${body.archivoNombre}</a> (${body.paginasArchivo} páginas)</li>
        <li><strong>Cantidad de copias:</strong> ${body.cantidad}</li>
        <li><strong>Total de hojas:</strong> ${body.paginasArchivo * body.cantidad}</li>
        <li><strong>Color:</strong> ${body.color}</li>
        <li><strong>Faz:</strong> ${body.faz}</li>
        <li><strong>Anillado:</strong> ${body.anillado ? "Sí" : "No"}</li>
        <li><strong>Comentario:</strong> ${body.comentario || "-"}</li>
      </ul>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo enviar el mail" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
