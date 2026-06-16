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

export const themeColors: Record<ThemeColor, { label: string; primary: string; soft: string; ring: string }> = {
  teal: { label: "Turquesa", primary: "oklch(0.62 0.13 200)", soft: "oklch(0.93 0.05 200)", ring: "oklch(0.62 0.13 200)" },
  coral: { label: "Coral", primary: "oklch(0.68 0.17 25)", soft: "oklch(0.94 0.05 25)", ring: "oklch(0.68 0.17 25)" },
  violet: { label: "Violeta", primary: "oklch(0.6 0.17 290)", soft: "oklch(0.94 0.04 290)", ring: "oklch(0.6 0.17 290)" },
  sunshine: { label: "Sol", primary: "oklch(0.75 0.16 75)", soft: "oklch(0.95 0.06 75)", ring: "oklch(0.7 0.16 75)" },
  forest: { label: "Floresta", primary: "oklch(0.6 0.13 150)", soft: "oklch(0.93 0.05 150)", ring: "oklch(0.6 0.13 150)" },
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
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mascotId, setMascotId] = useState<MascotId>("leo");
  const [themeColor, setThemeColor] = useState<ThemeColor>("teal");
  const [starsByArea, setStarsByArea] = useState<Record<string, number>>({});

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
      addStars: (area, n) =>
        setStarsByArea((p) => ({ ...p, [area]: (p[area] ?? 0) + n })),
      resetProgress: () => setStarsByArea({}),
    }),
    [mascotId, themeColor, starsByArea],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
