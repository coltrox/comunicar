import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vocabulario")({
  head: () => ({
    meta: [{ title: "Vocabulário — Comunicar+" }],
  }),
  component: VocabularyPage,
});

function VocabularyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Vocabulário</h1>
      <p className="mt-2 text-muted-foreground">Em construção...</p>
    </div>
  );
}
