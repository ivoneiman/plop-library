import type { Producto } from "@/types";

const iconos: Record<Producto["categoria"], string> = {
  Libros:
    "M12 6.5C10.5 5.2 8.2 4.5 5.5 4.5c-.8 0-1.5.7-1.5 1.5v11c0 .8.7 1.5 1.5 1.5 2.7 0 5 .7 6.5 2 1.5-1.3 3.8-2 6.5-2 .8 0 1.5-.7 1.5-1.5v-11c0-.8-.7-1.5-1.5-1.5-2.7 0-5 .7-6.5 2Zm0 0v13",
  Regalería:
    "M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Zm-1-3.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5V9H3V5.5ZM12 4v17M12 9c-1.5-3-5-3-5-1s2 2 5 1Zm0 0c1.5-3 5-3 5-1s-2 2-5 1Z",
};

export function FotoPlaceholder({ categoria }: { categoria: Producto["categoria"] }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mustard-100 to-kraft-100">
      <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-kraft-400" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d={iconos[categoria]} />
      </svg>
    </div>
  );
}
