import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/memoria")({
  head: () => ({
    meta: [{ title: "Memória Auditiva — Comunicar+" }],
  }),
  component: MemoryPage,
});

function MemoryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Memória Auditiva</h1>
      <p className="mt-2 text-muted-foreground">Em construção...</p>
    </div>
  );
}
