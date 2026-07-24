import { getCatalogo } from "@/lib/notion";

export const revalidate = 300;

export default async function Home() {
  const catalogo = await getCatalogo();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper-50 px-6 text-ink-800">
      <h1 className="text-4xl font-bold text-wood-800">Plop!</h1>
      <p className="mt-2 text-ink-500">Librería de barrio</p>
      <pre className="mt-8 w-full max-w-3xl overflow-x-auto rounded bg-ink-900 p-4 text-xs text-paper-100">
        {JSON.stringify(catalogo, null, 2)}
      </pre>
    </main>
  );
}
