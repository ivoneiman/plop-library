export function buildWhatsAppUrl(numero: string, mensaje: string): string {
  const numeroLimpio = numero.replace(/[^\d]/g, "");
  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
}
