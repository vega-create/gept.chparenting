// Sound effects using Web Audio API — zero external files
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.3, delay = 0) {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    o.connect(g);
    g.connect(c.destination);
    o.start(c.currentTime + delay);
    o.stop(c.currentTime + delay + duration);
  } catch {}
}

/** 🎉 Perfect / 100% — bright cheerful ascending arpeggio + sparkle */
export function playPerfect() {
  if (typeof window === "undefined") return;
  tone(523, 0.15, "sine", 0.35, 0);       // C5
  tone(659, 0.15, "sine", 0.35, 0.1);     // E5
  tone(784, 0.15, "sine", 0.35, 0.2);     // G5
  tone(1047, 0.35, "sine", 0.4, 0.3);     // C6 (hold)
  tone(1319, 0.25, "triangle", 0.2, 0.4); // E6 sparkle
  tone(1568, 0.3, "sine", 0.15, 0.5);     // G6 high sparkle
}

/** ✅ Correct answer — quick bright ding */
export function playCorrect() {
  if (typeof window === "undefined") return;
  tone(880, 0.12, "sine", 0.3, 0);        // A5
  tone(1175, 0.2, "sine", 0.35, 0.08);    // D6
}

/** ❌ Wrong answer — gentle descending "aww" */
export function playWrong() {
  if (typeof window === "undefined") return;
  tone(440, 0.18, "sine", 0.25, 0);       // A4
  tone(349, 0.22, "sine", 0.25, 0.12);    // F4
  tone(294, 0.3, "sine", 0.2, 0.28);      // D4
}

/** 🏆 Game complete / high score — victory fanfare */
export function playVictory() {
  if (typeof window === "undefined") return;
  tone(523, 0.12, "sine", 0.3, 0);        // C5
  tone(659, 0.12, "sine", 0.3, 0.1);      // E5
  tone(784, 0.12, "sine", 0.3, 0.2);      // G5
  tone(1047, 0.22, "sine", 0.35, 0.3);    // C6
  tone(784, 0.1, "sine", 0.2, 0.45);      // G5
  tone(1047, 0.15, "sine", 0.3, 0.5);     // C6
  tone(1319, 0.4, "triangle", 0.25, 0.6); // E6 (grand finish)
}

/** 🔘 Button click / tap feedback */
export function playTap() {
  if (typeof window === "undefined") return;
  tone(700, 0.06, "sine", 0.15, 0);
}
