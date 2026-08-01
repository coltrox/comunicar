import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [{ title: "Desafios e Trava-Línguas — Comunicar+" }],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Desafios e Trava-Línguas</h1>
      <p className="mt-2 text-muted-foreground">Em construção...</p>
    </div>
  );
}
