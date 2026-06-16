import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Volume2, PartyPopper } from "lucide-react";
import { tongueTwisters } from "@/lib/data/tongueTwisters";
import { speak } from "@/lib/speech";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/desafios")({
  head: () => ({
    meta: [
      { title: "Desafios e Trava-Línguas — Comunicar+" },
      { name: "description", content: "Trava-línguas e frases funcionais com celebração." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const { addStars } = useApp();
  const [filter, setFilter] = useState<"todas" | "trava" | "frase">("todas");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const list = tongueTwisters.filter((t) => filter === "todas" || t.type === filter);

  const celebrate = (id: string) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"],
    });
    setTimeout(
      () =>
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
        }),
      250,
    );
    setDone((d) => ({ ...d, [id]: true }));
    addStars("desafios", 1);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">Desafios e Trava-Línguas</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ouça, repita e celebre cada conquista!
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          { k: "todas", l: "Todas" },
          { k: "trava", l: "Trava-Línguas" },
          { k: "frase", l: "Frases do dia a dia" },
        ] as const).map((b) => (
          <Button
            key={b.k}
            variant={filter === b.k ? "default" : "outline"}
            onClick={() => setFilter(b.k)}
            className="h-12 rounded-2xl px-5 text-base"
          >
            {b.l}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {list.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
          >
            <Card className="flex h-full flex-col gap-4 p-6">
              <div className="grid grid-cols-[auto_1fr_auto] items-start gap-4">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-4xl"
                  style={{ background: "var(--primary-soft)" }}
                  aria-hidden="true"
                >
                  {t.emoji}
                </div>
                <div className="min-w-0">
                  <Badge variant="secondary" className="mb-2">
                    {t.type === "trava" ? "Trava-língua" : "Frase social"}
                  </Badge>
                  <p className="font-display text-xl font-semibold leading-snug">{t.text}</p>
                </div>
                {done[t.id] && (
                  <span className="text-2xl" aria-label="Concluído">
                    ⭐
                  </span>
                )}
              </div>
              <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                💡 {t.hint}
              </p>
              <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => speak(t.text, { rate: 0.75 })}
                  className="h-12 flex-1 rounded-2xl text-base"
                >
                  <Volume2 className="mr-2 h-5 w-5" /> Ouvir
                </Button>
                <Button
                  onClick={() => celebrate(t.id)}
                  className="h-12 flex-1 rounded-2xl text-base"
                >
                  <PartyPopper className="mr-2 h-5 w-5" />
                  Gravei e Consegui!
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
