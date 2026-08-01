import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fonemas")({
  head: () => ({
    meta: [{ title: "Banco de Fonemas — Comunicar+" }],
  }),
  component: PhonemesPage,
});

function PhonemesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Banco de Fonemas</h1>
    </div>
  );
}
