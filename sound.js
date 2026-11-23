// WebAudio-Sound (komplett synthetisch)
export const Sound = (() => {
  let ctx, master, sfx, music, noiseBuf, musicOn = true, lastT = {};
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
    sfx = ctx.createGain(); sfx.gain.value = 1; sfx.connect(master);
    music = ctx.createGain(); music.gain.value = 0.35; music.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    startMusic();
  }

  function osc(f, when, dur, type, vol, dest, f2) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, when);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, when + dur);
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g); g.connect(dest); o.start(when); o.stop(when + dur + 0.02);
  }
  function noise(when, dur, vol, f, f2, dest, q = 1, type = 'bandpass') {
    const s = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; flt.type = type; flt.Q.value = q;
    flt.frequency.setValueAtTime(f, when);
    if (f2) flt.frequency.exponentialRampToValueAtTime(f2, when + dur);
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    s.connect(flt); flt.connect(g); g.connect(dest); s.start(when, Math.random() * 0.5); s.stop(when + dur + 0.02);
  }
  const ok = (name, gap) => { // Drosselung pro Soundtyp
    const n = performance.now();
    if (lastT[name] && n - lastT[name] < gap) return false;
    lastT[name] = n; return true;
  };

  // ---------------- music: one scheduler, several instrument styles (song comes from the theme)
  let song = { style: 'chip', bpm: 120, roots: [57, 53, 60, 55], arp: [0, 12, 7, 12, 0, 12, 7, 15, 0, 12, 7, 12, 3, 12, 7, 10] };
  function oscF(f, when, dur, type, vol, dest, cutoff, attack = 0.005) {
    const o = ctx.createOscillator(), flt = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, when); flt.type = 'lowpass'; flt.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, when); g.gain.linearRampToValueAtTime(vol, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(flt); flt.connect(g); g.connect(dest); o.start(when); o.stop(when + dur + 0.05);
  }
  function startMusic() {
    let next = ctx.currentTime + 0.1, i = 0;
    setInterval(() => {
      const steps = song.steps || 16, step = 60 / song.bpm / 4;
      while (next < ctx.currentTime + 0.3) {
        if (musicOn) {
          const bar = Math.floor(i / steps) % song.roots.length, s = i % steps, root = song.roots[bar];
          let n = song.arp[s];
          if (song.minor && !song.minor[bar] && n % 12 === 3) n += 1;           // major third on major bars
          switch (song.style) {
            case 'uke':
              osc(mtof(root + 12 + n), next, step * 2.2, 'triangle', 0.07, music);
              osc(mtof(root + 24 + n), next, step * 0.7, 'sine', 0.02, music);
              if (s % 8 === 0) osc(mtof(root - 12), next, step * 6, 'sine', 0.22, music);
              if (s % 8 === 4) osc(mtof(root - 5), next, step * 3, 'sine', 0.12, music);
              if (s % 4 === 2) noise(next, 0.06, 0.05, 5500, null, music, 1, 'highpass');
              break;
            case 'synth':
              oscF(mtof(root + 12 + n), next, step * 1.6, 'sawtooth', 0.06, music, 2200);
              if (s % 2 === 0) oscF(mtof(root - 24), next, step * 1.8, 'sawtooth', 0.12, music, 500);
              if (s % 4 === 0) osc(150, next, 0.25, 'sine', 0.5, music, 42);
              if (s === 4 || s === 12) { noise(next, 0.22, 0.22, 1800, 900, music, 0.7); osc(190, next, 0.1, 'triangle', 0.1, music, 120); }
              if (s % 2 === 1) noise(next, 0.03, 0.04, 9000, null, music, 1, 'highpass');
              break;
            case 'ambient':
              if (s === 0) for (const iv of [0, 7, 12, 16]) oscF(mtof(root + iv), next, step * 16, 'sawtooth', 0.025, music, 900, step * 6);
              if (s % 2 === 0) {
                osc(mtof(root + 24 + n), next, step * 3, 'sine', 0.06, music);
                osc(mtof(root + 24 + n), next + step * 3, step * 3, 'sine', 0.025, music);
              }
              if (s === 0 || s === 8) osc(mtof(root - 24), next, step * 8, 'sine', 0.18, music);
              break;
            case 'shanty':
              osc(mtof(root + 12 + n), next, step * 0.9, 'square', 0.028, music);
              osc(mtof(root + 12 + n) * 1.006, next, step * 0.9, 'square', 0.022, music);
              if (s % 6 === 0) osc(mtof(root - 12), next, step * 2, 'triangle', 0.22, music);
              if (s % 6 === 3) { osc(mtof(root + (song.minor && !song.minor[bar] ? 4 : 3)), next, step * 1.2, 'sawtooth', 0.04, music); osc(mtof(root + 7), next, step * 1.2, 'sawtooth', 0.04, music); noise(next, 0.08, 0.06, 7000, null, music, 1, 'highpass'); }
              break;
            default: // chip
              osc(mtof(root + n), next, step * 0.8, 'square', 0.035, music);
              if (s % 4 === 0) osc(mtof(root - 24), next, step * 3, 'triangle', 0.16, music);
              if (s % 2 === 1) noise(next, 0.04, 0.05, 7000, null, music, 1, 'highpass');
              if (s === 0 || s === 8) osc(110, next, 0.12, 'sine', 0.25, music, 40);
          }
        }
        next += step; i++;
      }
    }, 80);
  }

  return {
    init,
    setSong(sg) { song = sg; },
    themeJingle() { if (!ctx) return; const t = ctx.currentTime;
      [784, 988, 1175, 1568].forEach((f, k) => osc(f, t + k * 0.06, 0.18, 'triangle', 0.12, sfx)); },
    toggleMusic() { musicOn = !musicOn; return musicOn; },
    flipper() { if (!ctx) return; const t = ctx.currentTime;
      osc(150, t, 0.08, 'sine', 0.45, sfx, 55); noise(t, 0.04, 0.3, 1800, 600, sfx, 2); },
    flipperUp() { if (!ctx || !ok('fu', 40)) return; const t = ctx.currentTime;
      noise(t, 0.03, 0.12, 1200, 500, sfx, 2); },
    bumper() { if (!ctx || !ok('bump', 40)) return; const t = ctx.currentTime;
      osc(320, t, 0.18, 'square', 0.16, sfx, 900);
      osc(1318, t, 0.35, 'sine', 0.2, sfx); osc(1976, t + 0.03, 0.3, 'sine', 0.1, sfx); },
    sling() { if (!ctx || !ok('sling', 60)) return; const t = ctx.currentTime;
      noise(t, 0.1, 0.35, 3000, 500, sfx, 1.5); osc(220, t, 0.1, 'sawtooth', 0.14, sfx, 90); },
    post() { if (!ctx || !ok('post', 50)) return; const t = ctx.currentTime;
      osc(880, t, 0.12, 'triangle', 0.18, sfx, 1400); },
    wall(v) { if (!ctx || !ok('wall', 55)) return; const t = ctx.currentTime;
      const vol = Math.min(0.3, v / 90);
      osc(700 + Math.random() * 300, t, 0.05, 'triangle', vol, sfx, 300);
      noise(t, 0.04, vol, 2500, 1000, sfx, 1); },
    charge(p) { if (!ctx) return; const t = ctx.currentTime;
      noise(t, 0.025, 0.12, 600 + p * 1800, null, sfx, 3); osc(120 + p * 220, t, 0.04, 'square', 0.05, sfx); },
    launch(p) { if (!ctx) return; const t = ctx.currentTime;
      noise(t, 0.35, 0.3, 400, 3500, sfx, 1.2);
      osc(120, t, 0.4, 'sawtooth', 0.15 + p * 0.1, sfx, 500 + p * 400); },
    drain() { if (!ctx) return; const t = ctx.currentTime;
      osc(440, t, 0.9, 'sawtooth', 0.25, sfx, 55);
      osc(330, t + 0.05, 0.9, 'square', 0.1, sfx, 40); },
    start() { if (!ctx) return; const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, k) => osc(f, t + k * 0.09, 0.25, 'square', 0.14, sfx)); },
    over() { if (!ctx) return; const t = ctx.currentTime;
      [523, 466, 392, 330, 262].forEach((f, k) => osc(f, t + k * 0.22, 0.4, 'triangle', 0.25, sfx)); },
    nudge() { if (!ctx) return; const t = ctx.currentTime;
      noise(t, 0.15, 0.4, 200, 80, sfx, 1, 'lowpass'); },
  };
})();
