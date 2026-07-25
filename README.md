# Plop! Librería

Proyecto personal que busca solucionar los problemas que identifiqué en la gestión y ventas de la librería **Plop!**. Utilicé Claude Code Pro como code agent para un despliegue rápido y seguro. 

Tambien **considero este proyecto como un aprendizaje.** Al interactuar con agentes de código en proyectos reales, el trabajo debe ser más cauteloso y vigilado por el desarrollador, por eso, puse en práctica mis conocimientos de refactoring, protección de la calidad del producto, buenas prácticas de diseño, y demás.

## El problema

La librería manejaba sus ventas, fotocopias y consultas exclusivamente por Instagram y WhatsApp: sin catálogo centralizado, sin forma de que un cliente nuevo descubriera el local fuera de esas redes, y con pedidos de fotocopias coordinados a mano, mensaje por mensaje.

## La propuesta

Una página web que:

- **Automatiza parte de la gestión manual**: catálogo de productos centralizado (con datos que carga el propio local) en vez de fotos sueltas en el feed.
- **Suma un canal de captación de clientes nuevo**, además de Instagram/WhatsApp, con SEO local para aparecer en búsquedas de la zona.
- **Genera un flujo de usuarios más constante** gracias al pedido de fotocopias online: el cliente sube el archivo, elige color/blanco y negro, simple o doble faz, anillado, y solo tiene que pasar a retirarlo — sin ida y vuelta por chat para coordinar el pedido.

> Pendiente de desarrollo: cobro online antes de confirmar el pedido de fotocopias (hoy el pago se coordina al retirar).

## Stack técnico

- **[Next.js 14](https://nextjs.org/)** (App Router) + **React 18** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** para estilos
- **[Notion API](https://developers.notion.com/)** como CMS: el catálogo de productos y los datos de configuración del local (dirección, horarios, WhatsApp, Instagram) se cargan y editan desde bases de Notion, sin tocar código
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** para el almacenamiento de los archivos que suben los clientes al pedir fotocopias
- **[Resend](https://resend.com/)** para el envío del mail al local cuando entra un pedido de fotocopias
- Desplegado en **[Vercel](https://vercel.com/)**

## Estructura del proyecto

```
app/
  page.tsx            Home
  catalogo/            Catálogo de libros
  regaleria/           Regalería y papelería
  fotocopias/          Formulario de pedido de fotocopias
  api/fotocopias/      Endpoints de subida de archivos (Blob) y webhook de confirmación
components/           Componentes de UI compartidos
lib/
  notion.ts            Lectura del catálogo y configuración desde Notion
  whatsapp.ts           Helpers para armar links de WhatsApp
types/                 Tipos compartidos (Producto, Config, PedidoFotocopia)
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

| Variable | Uso |
| --- | --- |
| `NOTION_API_KEY` | Token de integración de Notion |
| `NOTION_DATABASE_ID` | Base de datos del catálogo de productos |
| `NOTION_CONFIG_DATABASE_ID` | Base de datos de configuración del local (dirección, horarios, contacto) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (para SEO/canonical) |
| `BLOB_READ_WRITE_TOKEN` | Storage temporal de los archivos de fotocopias |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` | Envío del mail de aviso de pedido al local |

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # levanta el build de producción
npm run lint     # ESLint
npm run format   # Prettier
```
