import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mic, BookOpen, Brain, Sparkles, Star, Flame } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunicando+ — Início" },
      {
        name: "description",
        content: "Escolha uma atividade de fala, vocabulário, memória ou desafios.",
      },
    ],
  }),
  component: Dashboard,
});

const shortcuts = [
  {
    title: "Banco de Fonemas",
    desc: "Treine sons como P, F, R, L.",
    url: "/fonemas",
    icon: Mic,
    color: "oklch(0.78 0.14 30)",
  },
  {
    title: "Vocabulário",
    desc: "Descubra palavras e suas partes.",
    url: "/vocabulario",
    icon: BookOpen,
    color: "oklch(0.78 0.13 240)",
  },
  {
    title: "Memória Auditiva",
    desc: "Jogo de sons em sequência.",
    url: "/memoria",
    icon: Brain,
    color: "oklch(0.78 0.13 145)",
  },
  {
    title: "Desafios e Trava-Línguas",
    desc: "Pronúncia divertida com confetes.",
    url: "/desafios",
    icon: Sparkles,
    color: "oklch(0.78 0.13 290)",
  },
] as const;

function Dashboard() {
  const { mascot, starsByArea, dailyGoal, dailyStars, streak } = useApp();
  const totalStars = Object.values(starsByArea).reduce((a, b) => a + b, 0);
  const goalReached = dailyStars >= dailyGoal;
  const dailyPct = Math.min(100, Math.round((dailyStars / dailyGoal) * 100));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl border border-border p-6 sm:p-10"
        style={{ background: "var(--primary-soft)" }}
      >
        <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="grid h-28 w-28 place-items-center rounded-3xl bg-background text-7xl shadow-sm"
            aria-hidden="true"
          >
            {mascot.emoji}
          </motion.div>
          <div className="min-w-0">
            <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
              Olá, eu sou
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{mascot.name}</h1>
            <p className="mt-2 text-lg text-foreground/80">{mascot.greeting}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-background px-5 py-4 shadow-sm">
            <Star className="h-7 w-7 fill-warm text-warm" />
            <div>
              <p className="text-2xl font-bold leading-none">{totalStars}</p>
              <p className="text-xs text-muted-foreground">estrelinhas</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold">Meta diária</h3>
            <span className="text-sm font-semibold text-muted-foreground">
              {Math.min(dailyStars, dailyGoal)} / {dailyGoal} ⭐
            </span>
          </div>
          <Progress value={dailyPct} className="mt-3" />
          <p className="mt-2 text-sm text-muted-foreground">
            {goalReached
              ? "Meta de hoje concluída! 🎉"
              : `Faltam ${dailyGoal - dailyStars} estrelinha${dailyGoal - dailyStars === 1 ? "" : "s"} para hoje.`}
          </p>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
            style={{ background: "var(--primary-soft)" }}
            aria-hidden="true"
          >
            <Flame className="h-7 w-7 fill-warm text-warm" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">
              {streak} {streak === 1 ? "dia" : "dias"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">seguidos batendo a meta</p>
          </div>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold">O que vamos praticar hoje?</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {shortcuts.map((s, i) => (
          <motion.div
            key={s.url}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.35 }}
            whileHover={{ y: -4 }}
          >
            <Link to={s.url} className="block focus-visible:outline-none">
              <Card className="group relative h-full overflow-hidden border-2 p-6 transition-shadow hover:shadow-xl">
                <div
                  className="grid h-20 w-20 place-items-center rounded-3xl"
                  style={{ background: s.color + "33" }}
                  aria-hidden="true"
                >
                  <s.icon className="h-10 w-10" style={{ color: s.color }} />
                </div>
                <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center text-base font-semibold text-primary">
                  Começar →
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6">
        <h3 className="text-xl font-bold">Quer mudar o mascote ou as cores?</h3>
        <p className="mt-1 text-muted-foreground">
          Personalize a experiência para deixar tudo do seu jeito.
        </p>
        <Button asChild className="mt-4 h-12 rounded-2xl px-6 text-base">
          <Link to="/personalizar">Personalizar</Link>
        </Button>
      </div>
    </div>
  );
}
