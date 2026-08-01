import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Comunicar+ — Início" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Comunicar+</h1>
      <p className="mt-2 text-muted-foreground">Em construção...</p>
    </div>
  );
}
