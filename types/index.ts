export type Producto = {
  id: string;
  nombre: string;
  categoria: "Libros" | "Regalería";
  subcategoria: string | null;
  precio: number;
  stock: number;
  fotoUrl: string | null;
  disponible: boolean;
  destacado: boolean;
};

export type Config = {
  direccion: string;
  horarioLunVie: string;
  horarioSab: string;
  whatsapp: string;
  instagram: string;
};

export type PedidoFotocopia = {
  archivoUrl: string;
  archivoNombre: string;
  cantidad: number;
  color: "Color" | "Blanco y negro";
  faz: "Simple faz" | "Doble faz";
  anillado: boolean;
  comentario: string;
};

export type PreciosFotocopias = {
  precioCopiaByN: number;
  precioCopiaColor: number;
  descuentoDobleFazPorcentaje: number;
  precioAnillado: number;
};
