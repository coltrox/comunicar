export type Position = "inicio" | "meio" | "fim";

export interface Word {
  word: string;
  position: Position;
  emoji: string;
}

export interface Phoneme {
  id: string;
  letter: string;
  name: string;
  color: string;
  mouthInstruction: string;
  mouthTip: string;
  words: Word[];
}

export const phonemes: Phoneme[] = [
  {
    id: "p",
    letter: "P",
    name: "Fonema P",
    color: "oklch(0.78 0.14 30)",
    mouthInstruction:
      "Junte os lábios firmes, segure o ar atrás deles e solte de uma vez com um pequeno 'puff'.",
    mouthTip: "Coloque a mão na frente da boca: você sente o ventinho ao falar P!",
    words: [
      { word: "PATO", position: "inicio", emoji: "🦆" },
      { word: "PÉ", position: "inicio", emoji: "🦶" },
      { word: "PIPA", position: "inicio", emoji: "🪁" },
      { word: "PORTA", position: "inicio", emoji: "🚪" },
      { word: "SAPO", position: "meio", emoji: "🐸" },
      { word: "COPO", position: "meio", emoji: "🥛" },
      { word: "SOPA", position: "meio", emoji: "🍲" },
      { word: "LÁPIS", position: "fim", emoji: "✏️" },
      { word: "TAMPA", position: "meio", emoji: "🥫" },
    ],
  },
  {
    id: "f",
    letter: "F",
    name: "Fonema F",
    color: "oklch(0.75 0.13 220)",
    mouthInstruction:
      "Encoste os dentes de cima no lábio de baixo e sopre o ar devagar, como um vento fininho.",
    mouthTip: "É um som longo e contínuo: ffffff. Sem voz na garganta!",
    words: [
      { word: "FACA", position: "inicio", emoji: "🔪" },
      { word: "FOGO", position: "inicio", emoji: "🔥" },
      { word: "FOLHA", position: "inicio", emoji: "🍃" },
      { word: "FOCA", position: "inicio", emoji: "🦭" },
      { word: "CAFÉ", position: "meio", emoji: "☕" },
      { word: "GIRAFA", position: "meio", emoji: "🦒" },
      { word: "SOFÁ", position: "meio", emoji: "🛋️" },
      { word: "CHEF", position: "fim", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "r",
    letter: "R",
    name: "Fonema R",
    color: "oklch(0.7 0.18 25)",
    mouthInstruction:
      "Levante a ponta da língua atrás dos dentes de cima e faça vibrar com um sopro forte.",
    mouthTip: "Tente imitar o ronco de um motor: rrrrrrr!",
    words: [
      { word: "RATO", position: "inicio", emoji: "🐭" },
      { word: "ROSA", position: "inicio", emoji: "🌹" },
      { word: "RIO", position: "inicio", emoji: "🏞️" },
      { word: "RODA", position: "inicio", emoji: "☸️" },
      { word: "CARRO", position: "meio", emoji: "🚗" },
      { word: "FERRO", position: "meio", emoji: "🔩" },
      { word: "CORAÇÃO", position: "meio", emoji: "❤️" },
      { word: "FLOR", position: "fim", emoji: "🌸" },
      { word: "MAR", position: "fim", emoji: "🌊" },
    ],
  },
  {
    id: "l",
    letter: "L",
    name: "Fonema L",
    color: "oklch(0.72 0.14 145)",
    mouthInstruction:
      "Encoste a ponta da língua no céu da boca, atrás dos dentes de cima, e solte a voz.",
    mouthTip: "A língua fica grudada em cima e o som sai pelos lados.",
    words: [
      { word: "LUA", position: "inicio", emoji: "🌙" },
      { word: "LEÃO", position: "inicio", emoji: "🦁" },
      { word: "LIVRO", position: "inicio", emoji: "📚" },
      { word: "LIMÃO", position: "inicio", emoji: "🍋" },
      { word: "BOLA", position: "meio", emoji: "⚽" },
      { word: "PILHA", position: "meio", emoji: "🔋" },
      { word: "TELEFONE", position: "meio", emoji: "📞" },
      { word: "ANEL", position: "fim", emoji: "💍" },
      { word: "SOL", position: "fim", emoji: "☀️" },
    ],
  },
  {
    id: "t",
    letter: "T",
    name: "Fonema T",
    color: "oklch(0.75 0.13 290)",
    mouthInstruction:
      "Toque a ponta da língua atrás dos dentes de cima, segure o ar e solte rápido.",
    mouthTip: "É um som curtinho: 'tá', 'té', 'ti'. Sem ventinho longo!",
    words: [
      { word: "TATU", position: "inicio", emoji: "🦔" },
      { word: "TOMATE", position: "inicio", emoji: "🍅" },
      { word: "TREM", position: "inicio", emoji: "🚆" },
      { word: "GATO", position: "meio", emoji: "🐱" },
      { word: "PATO", position: "meio", emoji: "🦆" },
      { word: "MOTO", position: "meio", emoji: "🏍️" },
    ],
  },
  {
    id: "d",
    letter: "D",
    name: "Fonema D",
    color: "oklch(0.7 0.14 320)",
    mouthInstruction:
      "Igual ao T, mas com a voz ligada. Língua atrás dos dentes de cima e som forte.",
    mouthTip: "Coloque a mão na garganta: você sente a vibração ao falar D!",
    words: [
      { word: "DADO", position: "inicio", emoji: "🎲" },
      { word: "DEDO", position: "inicio", emoji: "👆" },
      { word: "DOCE", position: "inicio", emoji: "🍬" },
      { word: "NADA", position: "meio", emoji: "🏊" },
      { word: "MOEDA", position: "meio", emoji: "🪙" },
      { word: "MEDO", position: "meio", emoji: "😨" },
    ],
  },
  {
    id: "v",
    letter: "V",
    name: "Fonema V",
    color: "oklch(0.7 0.14 260)",
    mouthInstruction:
      "Igual ao F, dentes de cima no lábio de baixo, mas agora com a voz vibrando.",
    mouthTip: "Som contínuo e com vibração: vvvvvv.",
    words: [
      { word: "VACA", position: "inicio", emoji: "🐄" },
      { word: "VELA", position: "inicio", emoji: "🕯️" },
      { word: "VOVÓ", position: "inicio", emoji: "👵" },
      { word: "VIOLÃO", position: "inicio", emoji: "🎸" },
      { word: "UVA", position: "meio", emoji: "🍇" },
      { word: "OVO", position: "meio", emoji: "🥚" },
      { word: "CHUVA", position: "meio", emoji: "🌧️" },
    ],
  },
];
