// Lightweight wrappers around the Web Speech API.
export function speak(text: string, opts: { rate?: number; pitch?: number } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = opts.rate ?? 0.9;
    u.pitch = opts.pitch ?? 1;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith("pt"));
    if (ptVoice) u.voice = ptVoice;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function playTone(freq: number, duration = 220, type: OscillatorType = "sine") {
  if (typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
    osc.stop(ctx.currentTime + duration / 1000);
    setTimeout(() => ctx.close(), duration + 100);
  } catch {
    /* ignore */
  }
}

export function playSuccess() {
  playTone(660, 140, "triangle");
  setTimeout(() => playTone(880, 220, "triangle"), 140);
}

export function playRetry() {
  playTone(300, 200, "sine");
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult:
    | ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

// Lightweight wrapper around the Web Speech API's recognition side, used to
// check whether what the child said matches the target word.
export function listenOnce(opts: {
  onResult: (transcript: string) => void;
  onError?: () => void;
  onEnd?: () => void;
}): boolean {
  if (typeof window === "undefined") return false;
  const SpeechRecognitionCtor =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike })
      .SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
      .webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) return false;

  try {
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      opts.onResult(transcript);
    };
    recognition.onerror = () => opts.onError?.();
    recognition.onend = () => opts.onEnd?.();
    recognition.start();
    return true;
  } catch {
    return false;
  }
}

function normalizeWord(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function matchesWord(transcript: string, target: string) {
  const heard = normalizeWord(transcript);
  const expected = normalizeWord(target);
  if (!heard) return false;
  return heard === expected || heard.includes(expected) || expected.includes(heard);
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Checks a full sentence/tongue-twister word by word: every occurrence of
// every target word must show up in what was heard (repeated words count
// each time), so getting just one word wrong — even the last one — fails.
export function matchesPhrase(transcript: string, target: string, threshold = 1) {
  const targetWords = normalizeText(target).split(" ").filter(Boolean);
  if (targetWords.length === 0) return false;
  const heardWords = normalizeText(transcript).split(" ").filter(Boolean);
  if (heardWords.length === 0) return false;

  const remaining = new Map<string, number>();
  for (const w of heardWords) remaining.set(w, (remaining.get(w) ?? 0) + 1);

  let matched = 0;
  for (const w of targetWords) {
    const count = remaining.get(w) ?? 0;
    if (count > 0) {
      matched++;
      remaining.set(w, count - 1);
    }
  }
  return matched / targetWords.length >= threshold;
}
