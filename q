[1mdiff --git a/app/page.tsx b/app/page.tsx[m
[1mindex 1aa5417..d8de0a3 100644[m
[1m--- a/app/page.tsx[m
[1m+++ b/app/page.tsx[m
[36m@@ -188,18 +188,23 @@[m [mexport default async function Home() {[m
       </section>[m
 [m
       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-16 lg:py-20">[m
[31m-        {/* Hero desktop: texto + foto (idéntico a mockup desktop de Stitch) */}[m
[31m-        <section className="mb-16 hidden items-center gap-8 md:flex">[m
[32m+[m[32m        {/* Hero desktop: texto + foto (Stitch "Home - Plop! (Vibrant Alignment)") */}[m
[32m+[m[32m        <section className="mb-16 hidden items-center gap-10 md:flex">[m
           <div className="flex flex-col gap-4 md:w-1/2">[m
[31m-            <h1 className="font-display text-4xl font-black uppercase leading-[1.05] text-mustard-500 sm:text-5xl">[m
[32m+[m[32m            <div className="mb-1 flex h-20 w-20 rotate-[-3deg] items-center justify-center rounded-full border-2 border-kraft-500 bg-mustard-500 shadow-[4px_4px_0_0_rgba(147,105,59,1)]">[m
[32m+[m[32m              <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9 text-mustard-900">[m
[32m+[m[32m                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Zm7 12 .9 2.6L22 17.5l-2.1.9L19 21l-.9-2.6L16 17.5l2.1-.9L19 14ZM5 14l.9 2.6L8 17.5l-2.1.9L5 21l-.9-2.6L2 17.5l2.1-.9L5 14Z" />[m
[32m+[m[32m              </svg>[m
[32m+[m[32m            </div>[m
[32m+[m[32m            <h1 className="font-display text-5xl font-black uppercase leading-[1.05] tracking-tight text-mustard-500 lg:text-6xl">[m
               Tu rincón de historias en el barrio[m
             </h1>[m
[31m-            <p className="text-lg font-semibold text-kraft-500">[m
[32m+[m[32m            <p className="max-w-lg text-xl font-bold text-kraft-500">[m
               Descubrí nuevos mundos, encontrá el regalo perfecto o imprimí tus ideas. Todo en un[m
               ambiente cálido y cerca tuyo.[m
             </p>[m
             {(config.direccion || config.horarioLunVie || config.horarioSab) && ([m
[31m-              <div className="z-1-shadow inline-flex flex-col items-start gap-2 self-start rounded-xl border-2 border-mustard-500/20 bg-mustard-50 p-3 text-sm font-bold text-kraft-700 sm:flex-row sm:items-center sm:gap-4">[m
[32m+[m[32m              <div className="inline-flex flex-col items-start gap-2 self-start rounded-2xl border-2 border-kraft-500 bg-mustard-50 p-4 text-sm font-bold text-kraft-700 shadow-[4px_4px_0_0_rgba(147,105,59,1)] sm:flex-row sm:items-center sm:gap-4">[m
                 {config.direccion && ([m
                   <span className="flex items-center gap-1.5">[m
                     <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-accent-pink-500" stroke="currentColor" strokeWidth={1.8}>[m
[36m@@ -228,7 +233,7 @@[m [mexport default async function Home() {[m
               </div>[m
             )}[m
           </div>[m
[31m-          <div className="z-1-shadow relative h-[400px] w-full overflow-hidden rounded-[2rem] border-4 border-mustard-500/30 md:w-1/2">[m
[32m+[m[32m          <div className="relative aspect-[4/3] w-full -rotate-1 overflow-hidden rounded-[2rem] border-4 border-kraft-500 shadow-[8px_8px_0_0_rgba(147,105,59,1)] transition-transform duration-300 hover:rotate-0 md:w-1/2">[m
             <Image[m
               src="/images/home/plop-libreria-frente-vidriera-costado.webp"[m
               alt="Vidriera de Plop!, librería de barrio"[m
[36m@@ -258,7 +263,7 @@[m [mexport default async function Home() {[m
           ))}[m
         </section>[m
 [m
[31m-        {/* Accesos rápidos desktop: tarjetas grandes con ícono, título y descripción */}[m
[32m+[m[32m        {/* Accesos rápidos desktop: tarjetas centradas estilo sticker */}[m
         <section className="mb-16 hidden gap-6 md:grid md:grid-cols-3">[m
           {accesos.map((acceso) => {[m
             const clases = acentoClases[acceso.acento];[m
[36m@@ -266,9 +271,9 @@[m [mexport default async function Home() {[m
               <Link[m
                 key={acceso.href}[m
                 href={acceso.href}[m
[31m-                className={`group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[2rem] border-2 border-kraft-100 bg-white p-6 transition-transform duration-300 hover:-translate-y-2 z-1-shadow ${clases.borde}`}[m
[32m+[m[32m                className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-kraft-500 bg-white p-6 text-center shadow-[4px_4px_0_0_rgba(147,105,59,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(147,105,59,1)]"[m
               >[m
[31m-                <div className={`mb-6 flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 ${clases.iconoBg}`}>[m
[32m+[m[32m                <div className={`flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6 ${clases.iconoBg}`}>[m
                   <span className={clases.iconoTexto}>{acceso.icono}</span>[m
                 </div>[m
                 <div>[m
[36m@@ -354,9 +359,9 @@[m [mexport default async function Home() {[m
           {destacados.map((item) => ([m
             <div[m
               key={item.titulo}[m
[31m-              className="z-1-shadow flex flex-col overflow-hidden rounded-[2rem] border-2 border-kraft-100 bg-white"[m
[32m+[m[32m              className="group flex flex-col overflow-hidden rounded-[2rem] border-2 border-kraft-100 bg-white shadow-[0_8px_24px_rgba(147,105,59,0.1)] transition-all duration-300 md:border-kraft-500 md:shadow-[4px_4px_0_0_rgba(147,105,59,1)] md:hover:-translate-y-1 md:hover:shadow-[6px_6px_0_0_rgba(147,105,59,1)]"[m
             >[m
[31m-              <div className="relative h-64 w-full md:h-72">[m
[32m+[m[32m              <div className="relative h-64 w-full md:h-80 md:border-b-2 md:border-kraft-500">[m
                 <Image[m
                   src={item.imagen}[m
                   alt={item.titulo}[m
[36m@@ -366,7 +371,7 @@[m [mexport default async function Home() {[m
                 />[m
               </div>[m
               <div className="flex flex-grow flex-col justify-center p-6">[m
[31m-                <h3 className={`font-display mb-2 text-2xl font-black leading-tight ${item.tituloClase}`}>[m
[32m+[m[32m                <h3 className={`font-display mb-2 text-2xl font-black leading-tight md:text-3xl ${item.tituloClase}`}>[m
                   {item.titulo}[m
                 </h3>[m
                 <p className="font-medium text-kraft-600">{item.descripcion}</p>[m
