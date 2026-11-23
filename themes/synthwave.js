// Theme: NEON DRIVE – 80s synthwave / outrun
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, wallCanvas, starfield, stripedSun, perspectiveGrid, chromeGrad, guideZones,
  laneMarks, drainFade, signPanel, fitText, displayWindow, palm, rnd } from '../art.js';

const PINK = '#ff2bd6', CYAN = '#2de2ff';

function mountains(g, x0, x1, yBase, hMax, fill, stroke, seed = 1) {
  g.save(); g.fillStyle = fill; g.strokeStyle = stroke; g.lineWidth = 3; g.shadowColor = stroke; g.shadowBlur = 10;
  g.beginPath(); g.moveTo(x0, yBase);
  let x = x0, k = seed;
  while (x < x1) { x += 30 + ((k * 37) % 60); k++; g.lineTo(Math.min(x, x1), yBase - (0.25 + ((k * 53) % 100) / 130) * hMax); }
  g.lineTo(x1, yBase); g.closePath(); g.fill(); g.stroke(); g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h } = t, hz = Z(-9);
  const sky = g.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, '#07011a'); sky.addColorStop(0.55, '#2b0a55'); sky.addColorStop(1, '#a0207a');
  g.fillStyle = sky; g.fillRect(0, 0, w, hz);
  const floor = g.createLinearGradient(0, hz, 0, h); floor.addColorStop(0, '#2a0040'); floor.addColorStop(0.3, '#12002a'); floor.addColorStop(1, '#05000d');
  g.fillStyle = floor; g.fillRect(0, hz, w, h - hz);
  starfield(g, w, hz, 260, hz * 0.8, ['#ffffff', '#9ff6ff', '#ffb0f0']);
  // sun + mountains
  g.save(); g.beginPath(); g.rect(0, 0, w, hz); g.clip();
  stripedSun(g, X(0), hz, 4.6 * t.PX, '#ffe35a', '#ff2d95');
  g.restore();
  mountains(g, 0, w, hz, 2.2 * t.PX, '#1a0636', CYAN, 3);
  // neon grid floor
  perspectiveGrid(g, 0, w, hz, h, 'rgba(255,43,214,0.65)', 16, 26, 3);
  // arch rings
  g.save(); g.shadowBlur = 18;
  g.shadowColor = PINK; g.strokeStyle = PINK; g.lineWidth = 6; g.beginPath(); g.arc(X(0), Z(-12), 9.2 * t.PX, Math.PI, TAU); g.stroke();
  g.shadowColor = CYAN; g.strokeStyle = CYAN; g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * t.PX, Math.PI, TAU); g.stroke();
  g.font = 'italic 900 58px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#ffffff'; g.shadowColor = CYAN; g.fillText('OUTRUN', X(0), Z(-15.4));
  g.restore();
  // bumper rings
  BUMPERS.forEach(b => {
    g.save(); g.shadowBlur = 18;
    g.shadowColor = CYAN; g.strokeStyle = CYAN; g.lineWidth = 5; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * t.PX, 0, TAU); g.stroke();
    g.shadowColor = PINK; g.strokeStyle = PINK; g.lineWidth = 3; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.4) * t.PX, 0, TAU); g.stroke();
    g.restore();
  });
  // sign
  const s = signPanel(t, 'rgba(5,0,20,0.92)', CYAN, PINK);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'NEON DRIVE', s.x1 - s.x0 - 90, 96, '"Arial Black", Impact, sans-serif', 'italic 900');
  g.shadowColor = PINK; g.shadowBlur = 20; g.fillStyle = chromeGrad(g, s.y0 + 20, s.y0 + 95); g.fillText('NEON DRIVE', s.cx, s.y0 + 94);
  g.shadowBlur = 8; g.font = '700 28px "Trebuchet MS", sans-serif'; g.fillStyle = CYAN; g.shadowColor = CYAN;
  g.fillText('MIAMI 1986  ·  TURBO  ·  NIGHT CALL', s.cx, s.y0 + 132); g.restore();
  // neon triangle roundel
  g.save(); g.lineJoin = 'round';
  const tri = (r, col, lw) => { g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 22; g.lineWidth = lw; g.beginPath();
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * TAU / 3; g[i ? 'lineTo' : 'moveTo'](X(0) + Math.cos(a) * r, Z(9.5) + Math.sin(a) * r); } g.closePath(); g.stroke(); };
  tri(2.1 * t.PX, CYAN, 8); tri(1.3 * t.PX, PINK, 6); g.restore();
  guideZones(t, '#12002a', 'rgba(255,43,214,0.8)', 8);
  laneMarks(t, 'rgba(0,0,0,0.55)', CYAN, PINK);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#07011a'); sky.addColorStop(0.45, '#3b0b5e'); sky.addColorStop(0.8, '#ff3f8e'); sky.addColorStop(1, '#ffb84d');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 400, 420, ['#fff', '#9ff6ff', '#ffb0f0']);
  stripedSun(g, w / 2, 560, 330, '#ffe35a', '#ff2d95');
  mountains(g, 0, w, 720, 160, '#1a0636', CYAN, 7);
  g.fillStyle = '#12002a'; g.fillRect(0, 720, w, 130);
  perspectiveGrid(g, 0, w, 720, 850, 'rgba(255,43,214,0.8)', 18, 6, 3);
  palm(g, 120, 850, 220, 470, 210, 26, '#05000d', '#05000d', null);
  palm(g, 2030, 850, 1930, 500, 190, 22, '#05000d', '#05000d', null);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic 900 200px "Arial Black", Impact, sans-serif';
  g.shadowColor = PINK; g.shadowBlur = 40; g.fillStyle = chromeGrad(g, 60, 240); g.fillText('NEON DRIVE', w / 2, 150);
  g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#ffffff'; g.strokeText('NEON DRIVE', w / 2, 150);
  g.fillStyle = 'rgba(5,0,20,0.85)'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = CYAN; g.lineWidth = 4; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = CYAN; g.shadowColor = CYAN; g.shadowBlur = 14; g.font = 'italic 900 44px "Arial Black", Impact, sans-serif';
  g.fillText('SYNTHWAVE  ·  PINBALL  ·  1986', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(396, 0, 1744, 0); fr.addColorStop(0, PINK); fr.addColorStop(1, CYAN);
  displayWindow(g, fr, '#05000a');
  g.fillStyle = '#05000d'; g.fillRect(0, 850, w, 150);
  g.fillStyle = PINK; g.fillRect(0, 846, w, 6);
  g.save(); g.fillStyle = CYAN; g.shadowColor = CYAN; g.shadowBlur = 12; g.font = 'italic 700 44px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('MIAMI  ·  TOKYO  ·  LOS ANGELES  ·  VICE CITY  ·  1986', w / 2, 925); g.restore();
  return c;
}

function wall() {
  const { c, g } = wallCanvas('#160a2a');
  g.strokeStyle = 'rgba(255,43,214,0.25)'; g.lineWidth = 2;
  for (let x = 0; x <= 512; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  for (let y = 0; y <= 256; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(45,226,255,${rnd(0.1, 0.4)})`; g.fillRect(rnd(0, 512), rnd(0, 256), 2, 2); }
  return c;
}

export default {
  id: 'synthwave', name: 'NEON DRIVE', t1: 'NEON DRIVE', t2: 'OUTRUN 1986', bonus: 'TURBO BONUS 1000',
  table, glass, wall,
  dm: { bg: '#0a0010', off: '#2a0630', glow: 'rgba(255,60,200,0.30)', mid: '#ff3bd0', hi: '#ffd0f4' },
  song: { style: 'synth', bpm: 112, roots: [57, 53, 48, 55], arp: [0, 7, 12, 7, 3, 7, 12, 15, 0, 7, 12, 7, 3, 10, 12, 15] },
  apron: { bg: '#0b0020', fg: '#2de2ff', line: '#ff2bd6', title: 'NEON DRIVE · MIAMI 1986' },
  colors: {
    bg: 0x07011a, hemi: [0x8a6aff, 0x200030, 0.5], sun: [0xd8c8ff, 1.3], warm: [0xff2bd6, 60],
    trim: { color: 0xff2bd6, metalness: 0.2, roughness: 0.3, emissive: 0xff2bd6, ei: 0.55 },
    accent: { color: 0x22e5ff, emissive: 0x0a6a80 }, cabinet: 0x120626,
    dome: 0xff2bd6, domeEmissive: 0xff2bd6, bulb: 0x9ff6ff, bumperLight: 0xff3bd0,
    lamp: 0x2de2ff, particles: [0xff2bd6, 0x2de2ff], trail: 0xff2bd6,
    bloom: [0.7, 0.5, 1.0], exposure: 1.0,
  },
};
