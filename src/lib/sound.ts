/**
 * Tiny zero-asset sound engine built on the Web Audio API. All tones are
 * synthesised on the fly, so there are no audio files to ship. Every call is
 * guarded: if audio is muted, unsupported, or blocked by autoplay policy it
 * fails silently.
 */

const MUTE_KEY = "roadmap_muted";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

/** Play a single oscillator note with a quick attack + exponential decay. */
function note(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  peak: number
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Soft descending "whoosh" — used when entering a mission. */
export function playWhoosh(): void {
  if (isMuted()) return;
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, t);
  filter.frequency.exponentialRampToValueAtTime(300, t + 0.45);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(110, t + 0.45);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.12, t + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

  osc.connect(filter).connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.55);
}

/** Bright ascending arpeggio — used when a mission is solved. */
export function playSuccess(): void {
  if (isMuted()) return;
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  // C5 - E5 - G5 - C6 major arpeggio, bell-like
  const freqs = [523.25, 659.25, 783.99, 1046.5];
  freqs.forEach((f, i) => {
    note(audio, f, t + i * 0.09, 0.5, "triangle", 0.18);
    note(audio, f * 2, t + i * 0.09, 0.35, "sine", 0.05); // shimmer overtone
  });
}
