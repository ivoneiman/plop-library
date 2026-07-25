# Plop! Librería

Proyecto personal que busca solucionar los problemas que identifiqué en la gestión y ventas de la librería **Plop!**.

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
