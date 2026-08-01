import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/personalizar")({
  head: () => ({
    meta: [{ title: "Personalizar — Comunicar+" }],
  }),
  component: CustomizePage,
});

function CustomizePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Personalizar</h1>
    </div>
  );
}
