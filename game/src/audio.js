// Tiny synthesized sounds (Web Audio, no files): a chime on a find, a low buzz on
// a miss, and a little arpeggio on a win. Created lazily on the first user gesture.
export function createAudio() {
  let context = null;

  function ensure() {
    if (!context) {
      try {
        const AudioContext = window.AudioContext ?? window.webkitAudioContext;
        context = new AudioContext();
      } catch {
        context = null;
      }
    }
    if (context && context.state === 'suspended') context.resume().catch(() => {});
    return context;
  }

  function tone(frequency, startAt, duration, type, volume) {
    const ctx = ensure();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + startAt);
    oscillator.stop(ctx.currentTime + startAt + duration);
  }

  return {
    unlock() {
      ensure();
    },
    found() {
      tone(880, 0, 0.18, 'sine', 0.18);
      tone(1318, 0.09, 0.3, 'sine', 0.15);
    },
    wrong() {
      tone(160, 0, 0.25, 'sawtooth', 0.08);
    },
    hint() {
      tone(660, 0, 0.15, 'triangle', 0.12);
    },
    win() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.35, 'sine', 0.16));
    },
  };
}
