export interface TongueTwister {
  id: string;
  text: string;
  emoji: string;
  type: "trava" | "frase";
  hint: string;
}

export const tongueTwisters: TongueTwister[] = [
  {
    id: "t1",
    text: "O rato roeu a roupa do rei de Roma.",
    emoji: "🐭",
    type: "trava",
    hint: "Capricha no R vibrante!",
  },
  {
    id: "t2",
    text: "Três pratos de trigo para três tigres tristes.",
    emoji: "🐯",
    type: "trava",
    hint: "Atenção nos encontros TR.",
  },
  {
    id: "t3",
    text: "O peito do pé do Pedro é preto.",
    emoji: "🦶",
    type: "trava",
    hint: "Lábios firmes no P.",
  },
  {
    id: "t4",
    text: "A aranha arranha a rã, a rã arranha a aranha.",
    emoji: "🕷️",
    type: "trava",
    hint: "Língua bem posicionada.",
  },
  {
    id: "f1",
    text: "Bom dia! Como você está hoje?",
    emoji: "👋",
    type: "frase",
    hint: "Cumprimento social do dia a dia.",
  },
  {
    id: "f2",
    text: "Por favor, eu quero um copo de água.",
    emoji: "💧",
    type: "frase",
    hint: "Pedido educado.",
  },
  {
    id: "f3",
    text: "Obrigado pela ajuda, foi muito legal.",
    emoji: "🙏",
    type: "frase",
    hint: "Agradecimento sincero.",
  },
  {
    id: "f4",
    text: "Eu gosto muito de brincar com você.",
    emoji: "🎈",
    type: "frase",
    hint: "Expressar sentimento.",
  },
  {
    id: "f5",
    text: "Vamos comer uma pizza no sábado?",
    emoji: "🍕",
    type: "frase",
    hint: "Fazer um convite.",
  },
];
