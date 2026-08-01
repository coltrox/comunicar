import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type MascotId = "leo" | "nina" | "tito";
export type ThemeColor = "teal" | "coral" | "violet" | "sunshine" | "forest";

export interface Mascot {
  id: MascotId;
  name: string;
  emoji: string;
  greeting: string;
  /** Stars needed per day when this mascot is the guide — also its difficulty. */
  dailyGoal: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  /** Punchy one-liner explaining the mascot's personality and why it's this hard. */
  tagline: string;
}

export const mascots: Mascot[] = [
  {
    id: "nina",
    name: "Nina, a Coelha",
    emoji: "🐰",
    greeting: "Oi! Pronta para pular nos sons?",
    dailyGoal: 2,
    difficulty: "Fácil",
    tagline: "Nina é gentil e calma — no ritmo dela, sem pressa nenhuma.",
  },
  {
    id: "tito",
    name: "Tito, o Tucano",
    emoji: "🦜",
    greeting: "Olá! Bora soltar a voz?",
    dailyGoal: 4,
    difficulty: "Médio",
    tagline: "Tito é esperto e cheio de energia — pronto pra voar mais alto.",
  },
  {
    id: "leo",
    name: "Léo, o Leão",
    emoji: "🦁",
    greeting: "Roar! Vamos brincar de falar?",
    dailyGoal: 6,
    difficulty: "Difícil",
    tagline: "Léo é bravo e corajoso — só encara quem não tem medo do desafio!",
  },
];

export const themeColors: Record<
  ThemeColor,
  { label: string; primary: string; soft: string; ring: string }
> = {
  teal: {
    label: "Turquesa",
    primary: "oklch(0.62 0.13 200)",
    soft: "oklch(0.93 0.05 200)",
    ring: "oklch(0.62 0.13 200)",
  },
  coral: {
    label: "Coral",
    primary: "oklch(0.68 0.17 25)",
    soft: "oklch(0.94 0.05 25)",
    ring: "oklch(0.68 0.17 25)",
  },
  violet: {
    label: "Violeta",
    primary: "oklch(0.6 0.17 290)",
    soft: "oklch(0.94 0.04 290)",
    ring: "oklch(0.6 0.17 290)",
  },
  sunshine: {
    label: "Sol",
    primary: "oklch(0.75 0.16 75)",
    soft: "oklch(0.95 0.06 75)",
    ring: "oklch(0.7 0.16 75)",
  },
  forest: {
    label: "Floresta",
    primary: "oklch(0.6 0.13 150)",
    soft: "oklch(0.93 0.05 150)",
    ring: "oklch(0.6 0.13 150)",
  },
};

/** Areas that count toward the daily goal — ids match the `area` used in addStars(). */
export const PRACTICE_AREAS = [
  { id: "fonemas", label: "Banco de Fonemas" },
  { id: "memoria", label: "Memória Auditiva" },
  { id: "desafios", label: "Trava-Línguas" },
  { id: "habilidades", label: "Habilidades Sociais" },
] as const;

interface AppContextValue {
  mascot: Mascot;
  setMascotId: (id: MascotId) => void;
  themeColor: ThemeColor;
  setThemeColor: (c: ThemeColor) => void;
  // in-memory progress
  starsByArea: Record<string, number>;
  addStars: (area: string, n: number) => void;
  resetProgress: () => void;
  // daily goal + streak: each practice area needs `dailyGoal` stars, and
  // `dailyGoal` comes from the chosen mascot's difficulty.
  dailyGoal: number;
  dailyStarsByArea: Record<string, number>;
  streak: number;
  // first-run mascot/goal setup
  needsSetup: boolean;
  completeSetup: (id: MascotId) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STARS_STORAGE_KEY = "comunicar-plus:stars";
const DAILY_STORAGE_KEY = "comunicar-plus:daily";
const MASCOT_STORAGE_KEY = "comunicar-plus:mascot";

interface DailyProgress {
  date: string;
  stars: Record<string, number>;
  goalMetAreas: Record<string, boolean>;
  streak: number;
  lastGoalDate: string | null;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dayBefore(date: string) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function freshDaily(today: string, streak = 0, lastGoalDate: string | null = null): DailyProgress {
  return { date: today, stars: {}, goalMetAreas: {}, streak, lastGoalDate };
}

function loadDaily(): DailyProgress {
  const today = todayStr();
  if (typeof window === "undefined") return freshDaily(today);
  try {
    const saved = window.localStorage.getItem(DAILY_STORAGE_KEY);
    const parsed: DailyProgress | null = saved ? JSON.parse(saved) : null;
    if (!parsed) return freshDaily(today);
    if (parsed.date === today) return parsed;
    // New day: the streak only survives if yesterday's goal was met.
    const streakContinues = parsed.lastGoalDate === dayBefore(today);
    return freshDaily(today, streakContinues ? parsed.streak : 0, parsed.lastGoalDate);
  } catch {
    return freshDaily(today);
  }
}

function loadMascotId(): MascotId | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(MASCOT_STORAGE_KEY) as MascotId | null;
    return saved && mascots.some((m) => m.id === saved) ? saved : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [needsSetup, setNeedsSetup] = useState(() => loadMascotId() === null);
  const [mascotId, setMascotId] = useState<MascotId>(() => loadMascotId() ?? "leo");
  const [themeColor, setThemeColor] = useState<ThemeColor>("teal");
  const [starsByArea, setStarsByArea] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(STARS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(starsByArea));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [starsByArea]);

  useEffect(() => {
    if (needsSetup) return;
    try {
      window.localStorage.setItem(MASCOT_STORAGE_KEY, mascotId);
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [mascotId, needsSetup]);

  const [daily, setDaily] = useState<DailyProgress>(loadDaily);

  useEffect(() => {
    try {
      window.localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(daily));
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [daily]);

  // Apply theme color to CSS variables
  useEffect(() => {
    const c = themeColors[themeColor];
    const root = document.documentElement;
    root.style.setProperty("--primary", c.primary);
    root.style.setProperty("--primary-soft", c.soft);
    root.style.setProperty("--ring", c.ring);
  }, [themeColor]);

  const mascot = mascots.find((m) => m.id === mascotId)!;

  const value = useMemo<AppContextValue>(
    () => ({
      mascot,
      setMascotId,
      themeColor,
      setThemeColor,
      starsByArea,
      addStars: (area, n) => {
        setStarsByArea((p) => ({ ...p, [area]: (p[area] ?? 0) + n }));
        setDaily((d) => {
          const today = todayStr();
          // Guard against the app being left open across midnight.
          const base = d.date === today ? d : loadDaily();
          const areaStars = (base.stars[area] ?? 0) + n;
          const stars = { ...base.stars, [area]: areaStars };
          const goalMetAreas = { ...base.goalMetAreas };
          if (areaStars >= mascot.dailyGoal) goalMetAreas[area] = true;

          const wasDayDone = PRACTICE_AREAS.every((a) => base.goalMetAreas[a.id]);
          const isDayDoneNow = PRACTICE_AREAS.every((a) => goalMetAreas[a.id]);
          const justFinishedDay = !wasDayDone && isDayDoneNow;

          return {
            date: today,
            stars,
            goalMetAreas,
            streak: justFinishedDay ? base.streak + 1 : base.streak,
            lastGoalDate: justFinishedDay ? today : base.lastGoalDate,
          };
        });
      },
      resetProgress: () => {
        setStarsByArea({});
        setDaily(freshDaily(todayStr()));
      },
      dailyGoal: mascot.dailyGoal,
      dailyStarsByArea: daily.stars,
      streak: daily.streak,
      needsSetup,
      completeSetup: (id) => {
        setMascotId(id);
        setNeedsSetup(false);
        setDaily(freshDaily(todayStr()));
      },
    }),
    [mascot, themeColor, starsByArea, daily, needsSetup],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
