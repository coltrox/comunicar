import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type MascotId = "leo" | "nina" | "tito";
export type ThemeColor = "teal" | "coral" | "violet" | "sunshine" | "forest";

export interface Mascot {
  id: MascotId;
  name: string;
  emoji: string;
  greeting: string;
}

export const mascots: Mascot[] = [
  { id: "leo", name: "Léo, o Leão", emoji: "🦁", greeting: "Roar! Vamos brincar de falar?" },
  { id: "nina", name: "Nina, a Coelha", emoji: "🐰", greeting: "Oi! Pronta para pular nos sons?" },
  { id: "tito", name: "Tito, o Tucano", emoji: "🦜", greeting: "Olá! Bora soltar a voz?" },
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

interface AppContextValue {
  mascot: Mascot;
  setMascotId: (id: MascotId) => void;
  themeColor: ThemeColor;
  setThemeColor: (c: ThemeColor) => void;
  // in-memory progress
  starsByArea: Record<string, number>;
  addStars: (area: string, n: number) => void;
  resetProgress: () => void;
  // daily goal + streak
  dailyGoal: number;
  dailyStars: number;
  streak: number;
}

const AppContext = createContext<AppContextValue | null>(null);

const STARS_STORAGE_KEY = "comunicando-plus:stars";
const DAILY_STORAGE_KEY = "comunicando-plus:daily";
export const DAILY_GOAL = 5;

interface DailyProgress {
  date: string;
  stars: number;
  goalMet: boolean;
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
  return { date: today, stars: 0, goalMet: false, streak, lastGoalDate };
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [mascotId, setMascotId] = useState<MascotId>("leo");
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

  const value = useMemo<AppContextValue>(
    () => ({
      mascot: mascots.find((m) => m.id === mascotId)!,
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
          const stars = base.stars + n;
          const justMet = !base.goalMet && stars >= DAILY_GOAL;
          return {
            date: today,
            stars,
            goalMet: base.goalMet || stars >= DAILY_GOAL,
            streak: justMet ? base.streak + 1 : base.streak,
            lastGoalDate: justMet ? today : base.lastGoalDate,
          };
        });
      },
      resetProgress: () => {
        setStarsByArea({});
        setDaily(freshDaily(todayStr()));
      },
      dailyGoal: DAILY_GOAL,
      dailyStars: daily.stars,
      streak: daily.streak,
    }),
    [mascotId, themeColor, starsByArea, daily],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
