export type Producto = {
  id: string;
  nombre: string;
  categoria: "Libros" | "Regalería";
  precio: number;
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
