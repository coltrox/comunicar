import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Star } from "lucide-react";
import { memoryLevels, type MemoryItem } from "@/lib/data/memoryLevels";
import { speak, playSuccess, playRetry } from "@/lib/speech";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/memoria")({
  head: () => ({
    meta: [
      { title: "Memória Auditiva — Comunicar+" },
      { name: "description", content: "Jogo de memória auditiva com progressão por níveis." },
    ],
  }),
  component: MemoryPage,
});

type Phase = "idle" | "playing" | "input" | "win" | "lose";

function MemoryPage() {
  const { addStars } = useApp();
  const [levelIdx, setLevelIdx] = useState(0);
  const [sequence, setSequence] = useState<MemoryItem[]>([]);
  const [userIdx, setUserIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef<number | null>(null);

  const level = memoryLevels[levelIdx];

  // Metronome for level 5
  useEffect(() => {
    if (level.rhythm && phase !== "idle") {
      const id = window.setInterval(() => setBeat((b) => b + 1), 500);
      beatRef.current = id;
      return () => window.clearInterval(id);
    }
    setBeat(0);
  }, [level.rhythm, phase]);

  const targetLen = useMemo(() => Math.min(2 + Math.floor(score / 2), 6), [score]);

  const startRound = () => {
    const pool = level.items;
    const seq: MemoryItem[] = Array.from({ length: targetLen }, () => pool[Math.floor(Math.random() * pool.length)]);
    setSequence(seq);
    setUserIdx(0);
    setPhase("playing");
    playSequence(seq);
  };

  const playSequence = async (seq: MemoryItem[]) => {
    for (let i = 0; i < seq.length; i++) {
      setHighlight(seq[i].id);
      speak(seq[i].text, { rate: level.rhythm ? 1.05 : 0.85 });
      await new Promise((r) => setTimeout(r, 1100));
      setHighlight(null);
      await new Promise((r) => setTimeout(r, 250));
    }
    setPhase("input");
  };

  const handleTap = (it: MemoryItem) => {
    if (phase !== "input") return;
    const expected = sequence[userIdx];
    if (it.id === expected.id) {
      const next = userIdx + 1;
      setHighlight(it.id);
      setTimeout(() => setHighlight(null), 200);
      if (next >= sequence.length) {
        playSuccess();
        setScore((s) => s + 1);
        addStars("memoria", 1);
        setPhase("win");
        toast.success("Você acertou tudo!");
      } else {
        setUserIdx(next);
      }
    } else {
      playRetry();
      setPhase("lose");
      toast("Quase! Vamos tentar de novo.", { icon: "💪" });
    }
  };

  const reset = () => {
    setPhase("idle");
    setSequence([]);
    setUserIdx(0);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Memória Auditiva</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ouça a sequência e toque na ordem certa.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-sm">
          <Star className="h-6 w-6 fill-warm text-warm" />
          <span className="text-xl font-bold">{score}</span>
          <span className="text-sm text-muted-foreground">rodadas</span>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="mb-3 text-base font-semibold">Escolha o nível</h2>
        <div className="grid gap-3 sm:grid-cols-5">
          {memoryLevels.map((l, i) => {
            const active = i === levelIdx;
            return (
              <button
                key={l.level}
                onClick={() => {
                  setLevelIdx(i);
                  reset();
                  setScore(0);
                }}
                aria-pressed={active}
                className={
                  "rounded-2xl border-2 p-4 text-left transition-all " +
                  (active
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/50")
                }
              >
                <div className="flex items-center gap-2">
                  <Badge variant={active ? "default" : "secondary"}>Nível {l.level}</Badge>
                </div>
                <p className="mt-2 font-bold">{l.title}</p>
                <p className="text-xs text-muted-foreground">{l.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl font-bold">{level.title}</p>
            <p className="text-sm text-muted-foreground">
              Sequência de {targetLen} {targetLen === 1 ? "item" : "itens"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startRound} className="h-12 rounded-2xl px-5 text-base">
              <Play className="mr-2 h-5 w-5" />
              {phase === "idle" ? "Começar" : "Nova rodada"}
            </Button>
            <Button variant="outline" onClick={reset} className="h-12 rounded-2xl">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {level.rhythm && phase !== "idle" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-warm/30 p-4">
            <motion.div
              key={beat}
              initial={{ scale: 0.6, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="h-6 w-6 rounded-full bg-warm-foreground"
              aria-hidden="true"
            />
            <p className="text-base font-semibold">Metrônomo visual — siga o ritmo!</p>
          </div>
        )}

        <div className="mt-6">
          {phase === "input" && (
            <div className="mb-4 rounded-2xl bg-primary/10 px-4 py-3 text-base">
              Sua vez! Toque{" "}
              <strong>
                {userIdx + 1} de {sequence.length}
              </strong>
              .
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {level.items.map((it) => {
              const isHl = highlight === it.id;
              return (
                <motion.button
                  key={it.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleTap(it)}
                  disabled={phase === "playing" || phase === "idle"}
                  animate={
                    isHl
                      ? { scale: [1, 1.08, 1], backgroundColor: "var(--primary)" }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.5 }}
                  className={
                    "big-tap h-28 rounded-3xl border-2 font-display text-3xl font-bold transition-all " +
                    (isHl
                      ? "border-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary disabled:opacity-50")
                  }
                >
                  {it.display}
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {phase === "win" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-success/15 p-5 text-center"
            >
              <p className="font-display text-2xl font-bold text-success">🎉 Mandou bem!</p>
              <Button onClick={startRound} className="mt-3 h-12 rounded-2xl px-6 text-base">
                Próxima rodada
              </Button>
            </motion.div>
          )}
          {phase === "lose" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-warm/30 p-5 text-center"
            >
              <p className="font-display text-2xl font-bold">Quase! Vamos de novo 💪</p>
              <Button onClick={startRound} className="mt-3 h-12 rounded-2xl px-6 text-base">
                Tentar de novo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
