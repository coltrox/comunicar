export interface MemoryItem {
  id: string;
  text: string;
  display: string;
}

export interface MemoryLevel {
  level: number;
  title: string;
  description: string;
  rhythm?: boolean;
  items: MemoryItem[];
}

export const memoryLevels: MemoryLevel[] = [
  {
    level: 1,
    title: "Sílabas Simples",
    description: "Sons isolados, fáceis e curtos.",
    items: [
      { id: "ba", text: "ba", display: "BA" },
      { id: "ma", text: "ma", display: "MA" },
      { id: "pa", text: "pa", display: "PA" },
      { id: "ta", text: "ta", display: "TA" },
      { id: "la", text: "la", display: "LA" },
      { id: "fa", text: "fa", display: "FA" },
    ],
  },
  {
    level: 2,
    title: "Monossílabas",
    description: "Palavras com uma sílaba.",
    items: [
      { id: "pai", text: "pai", display: "PAI" },
      { id: "sol", text: "sol", display: "SOL" },
      { id: "mar", text: "mar", display: "MAR" },
      { id: "pé", text: "pé", display: "PÉ" },
      { id: "luz", text: "luz", display: "LUZ" },
      { id: "flor", text: "flor", display: "FLOR" },
    ],
  },
  {
    level: 3,
    title: "Dissílabas",
    description: "Duas sílabas em ritmo claro.",
    items: [
      { id: "boca", text: "boca", display: "BOCA" },
      { id: "casa", text: "casa", display: "CASA" },
      { id: "bola", text: "bola", display: "BOLA" },
      { id: "gato", text: "gato", display: "GATO" },
      { id: "lua", text: "lua", display: "LUA" },
      { id: "rato", text: "rato", display: "RATO" },
    ],
  },
  {
    level: 4,
    title: "Trissílabas",
    description: "Três sílabas, mais desafiador.",
    items: [
      { id: "macaco", text: "macaco", display: "MACACO" },
      { id: "panela", text: "panela", display: "PANELA" },
      { id: "sapato", text: "sapato", display: "SAPATO" },
      { id: "cabelo", text: "cabelo", display: "CABELO" },
      { id: "borboleta", text: "borboleta", display: "BORBOLETA" },
      { id: "telefone", text: "telefone", display: "TELEFONE" },
    ],
  },
  {
    level: 5,
    title: "Diadococinesia",
    description: "Ritmo motor rápido com metrônomo visual.",
    rhythm: true,
    items: [
      { id: "pataca", text: "pa ta ca", display: "PATACA" },
      { id: "fasaxa", text: "fa sa xa", display: "FASAXA" },
      { id: "tukutuku", text: "tu ku tu ku", display: "TUKUTUKU" },
      { id: "pataka", text: "pa ta ka", display: "PATAKA" },
      { id: "balada", text: "ba la da", display: "BALADA" },
    ],
  },
];
