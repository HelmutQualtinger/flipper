// Theme: STAR PATROL – original 1960s-TV-style space exploration (own ship design and emblem)
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, starfield, guideZones, laneMarks, drainFade, signPanel, fitText,
  displayWindow, goldGrad, blob, sparkle, star, rnd } from '../art.js';

const GOLD = '#ffd23a', BLUE = '#3a8aff', RED = '#e03030', HULL = '#c8d0dc';

// warp streaks radiating from a vanishing point
function warp(g, cx, cy, n, rMin, rMax, colors) {
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, r0 = rnd(rMin, rMax * 0.6), r1 = r0 + rnd(30, rMax * 0.4);
    g.strokeStyle = colors[i % colors.length]; g.globalAlpha = rnd(0.25, 0.8); g.lineWidth = rnd(1, 3.5);
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke();
  }
  g.restore();
}
// original starship: arrowhead hull with swept wings and two glowing engine pods (nose points to -x)
function ship(g, x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const hg = g.createLinearGradient(0, -60, 0, 60); hg.addColorStop(0, '#ffffff'); hg.addColorStop(0.5, HULL); hg.addColorStop(1, '#6a7484');
  g.strokeStyle = '#2a3040'; g.lineWidth = 3; g.lineJoin = 'round';
  // wings
  g.fillStyle = '#8a94a6';
  for (const sy of [-1, 1]) {
    g.beginPath(); g.moveTo(40, 8 * sy); g.lineTo(150, 95 * sy); g.lineTo(205, 98 * sy); g.lineTo(120, 10 * sy); g.closePath(); g.fill(); g.stroke();
    // engine pod
    g.fillStyle = hg; g.beginPath(); g.moveTo(120, 88 * sy); g.lineTo(250, 88 * sy); g.quadraticCurveTo(262, 100 * sy, 250, 112 * sy); g.lineTo(120, 112 * sy); g.quadraticCurveTo(108, 100 * sy, 120, 88 * sy); g.fill(); g.stroke();
    g.fillStyle = BLUE; g.shadowColor = '#7ab8ff'; g.shadowBlur = 24; g.beginPath(); g.ellipse(256, 100 * sy, 9, 11, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
    g.fillStyle = RED; g.beginPath(); g.arc(126, 100 * sy, 6, 0, TAU); g.fill();
    g.fillStyle = '#8a94a6';
  }
  // hull
  g.fillStyle = hg; g.beginPath(); g.moveTo(-190, 0); g.quadraticCurveTo(-120, -34, 30, -40); g.lineTo(220, -24); g.lineTo(240, 0); g.lineTo(220, 24); g.lineTo(30, 40); g.quadraticCurveTo(-120, 34, -190, 0); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(40,48,64,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-150, 0); g.lineTo(220, 0); g.stroke();
  // bridge dome + window band + hull stripe
  g.fillStyle = '#e8eef8'; g.strokeStyle = '#2a3040'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(-20, 0, 42, 20, 0, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = '#ffe9a0'; for (let k = 0; k < 9; k++) g.fillRect(40 + k * 18, -14, 9, 5);
  g.fillStyle = GOLD; g.fillRect(-120, 18, 220, 5);
  g.fillStyle = BLUE; g.shadowColor = '#7ab8ff'; g.shadowBlur = 30; g.beginPath(); g.ellipse(244, 0, 10, 16, 0, 0, TAU); g.fill();
  g.restore();
}
// original emblem: golden star inside an orbit ring
function emblem(g, x, y, R) {
  g.save();
  g.fillStyle = '#0a1030'; g.strokeStyle = GOLD; g.lineWidth = R * 0.08; g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill(); g.stroke();
  g.strokeStyle = '#7ab8ff'; g.lineWidth = R * 0.05; g.beginPath(); g.ellipse(x, y, R * 0.85, R * 0.32, -0.45, 0, TAU); g.stroke();
  star(g, x, y, R * 0.55, R * 0.22, 5); g.fillStyle = goldGrad(g, y - R * 0.55, y + R * 0.5); g.shadowColor = GOLD; g.shadowBlur = 20; g.fill();
  g.restore();
}
function gasGiant(g, x, y, r) {
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip();
  const pg = g.createLinearGradient(0, y - r, 0, y + r); ['#ffb07a', '#c8502a', '#ffd0a0', '#a03a1a', '#ff9a5a', '#6a1a0a'].forEach((c, i, a) => pg.addColorStop(i / (a.length - 1), c));
  g.fillStyle = pg; g.fillRect(x - r, y - r, r * 2, r * 2);
  const sh = g.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.2, x, y, r * 1.1); sh.addColorStop(0, 'rgba(255,255,255,0.15)'); sh.addColorStop(1, 'rgba(0,0,0,0.65)');
  g.fillStyle = sh; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
// retro control panel with coloured buttons
function panelButtons(g, x0, y0, w, h, rows, cols) {
  const cs = ['#e03030', '#ffd23a', '#3a8aff', '#3ad06a', '#ff8a2a', '#ffffff'];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const bw = w / cols, bh = h / rows; g.fillStyle = cs[(r * 7 + c * 3) % cs.length]; g.globalAlpha = Math.random() < 0.6 ? 0.95 : 0.35;
    g.fillRect(x0 + c * bw + 3, y0 + r * bh + 3, bw - 6, bh - 6);
  }
  g.globalAlpha = 1;
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t;
  const bg = g.createRadialGradient(X(0), Z(-12), 20, X(0), Z(-12), h); bg.addColorStop(0, '#1a1a4a'); bg.addColorStop(0.4, '#070a24'); bg.addColorStop(1, '#010208');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 700, h, ['#fff', '#cfe0ff', '#ffe0c0']);
  warp(g, X(0), Z(-12), 260, 60, 1500, ['#ffffff', '#9fc8ff', '#c8b8ff']);
  blob(g, X(0), Z(-12), 3 * PX, 'rgba(160,200,255,A)', 0.5);
  gasGiant(g, X(5.6), Z(-14.6), 1.6 * PX);
  ship(g, X(-1.2), Z(-14.6), 0.42, -0.12);
  // arch rings (gold + blue)
  g.save(); g.strokeStyle = GOLD; g.lineWidth = 6; g.shadowColor = GOLD; g.shadowBlur = 12; g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = BLUE; g.shadowColor = BLUE; g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * PX, Math.PI, TAU); g.stroke(); g.restore();
  // shield rings around bumpers
  BUMPERS.forEach(b => { g.save(); for (const [rr, a] of [[0.8, 0.9], [1.2, 0.5], [1.6, 0.25]]) { g.strokeStyle = `rgba(90,160,255,${a})`; g.shadowColor = BLUE; g.shadowBlur = 14; g.lineWidth = 4; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + rr) * PX, 0, TAU); g.stroke(); } g.restore(); });
  // control-panel sign
  const s = signPanel(t, '#14161e', GOLD, null);
  panelButtons(g, s.x0 + 20, s.y0 + 18, 90, s.y1 - s.y0 - 36, 4, 2);
  panelButtons(g, s.x1 - 110, s.y0 + 18, 90, s.y1 - s.y0 - 36, 4, 2);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'WARP SPEED', s.x1 - s.x0 - 300, 92, '"Arial Black", Impact, sans-serif', 'italic 900');
  g.fillStyle = goldGrad(g, s.y0 + 25, s.y0 + 100); g.shadowColor = GOLD; g.shadowBlur = 16; g.fillText('WARP SPEED', s.cx, s.y0 + 92);
  g.shadowBlur = 0; g.font = '700 24px "Courier New", monospace'; g.fillStyle = '#9fc8ff';
  g.fillText('SECTOR 001 · DEEP SPACE PATROL · ALL HANDS', s.cx, s.y0 + 128); g.restore();
  emblem(g, X(0), Z(9.4), 1.75 * PX);
  for (let i = 0; i < 14; i++) sparkle(g, rnd(0, w), rnd(0, h), rnd(6, 14), '#cfe0ff');
  // uniform-colour stripes under the guides
  guideZones(t, '#0a1030', 'rgba(255,210,58,0.75)', 10);
  laneMarks(t, 'rgba(0,0,0,0.5)', GOLD, RED);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const bg = g.createRadialGradient(1300, 560, 30, 1300, 560, 1500); bg.addColorStop(0, '#2a2a6a'); bg.addColorStop(0.4, '#0a0c2a'); bg.addColorStop(1, '#010208');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 600, h);
  warp(g, 1300, 560, 420, 40, 1600, ['#ffffff', '#9fc8ff', '#c8b8ff', '#ffe0c0']);
  blob(g, 1300, 560, 260, 'rgba(170,210,255,A)', 0.6);
  gasGiant(g, 1960, 760, 190);
  g.save(); g.strokeStyle = 'rgba(255,220,170,0.7)'; g.lineWidth = 10; g.beginPath(); g.ellipse(1960, 760, 300, 60, -0.25, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); g.restore();
  ship(g, 230, 640, 0.95, -0.18);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'italic 900 190px "Arial Black", Impact, sans-serif';
  g.lineWidth = 14; g.strokeStyle = '#05061a'; g.lineJoin = 'round'; g.strokeText('STAR PATROL', w / 2, 150);
  g.fillStyle = goldGrad(g, 60, 240); g.shadowColor = '#ffb030'; g.shadowBlur = 28; g.fillText('STAR PATROL', w / 2, 150); g.shadowBlur = 0;
  g.fillStyle = '#14161e'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = GOLD; g.lineWidth = 4; g.strokeRect(560, 262, 1020, 80);
  panelButtons(g, 566, 268, 80, 68, 2, 2); panelButtons(g, 1494, 268, 80, 68, 2, 2);
  g.fillStyle = '#9fc8ff'; g.font = '900 38px "Arial Black", Impact, sans-serif'; g.fillText('TO EXPLORE THE UNKNOWN', w / 2, 304); g.restore();
  emblem(g, 1960, 330, 90);
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#fff2b0'); fr.addColorStop(0.5, '#e2a928'); fr.addColorStop(1, '#6a4a10');
  displayWindow(g, fr, '#0a0700');
  g.fillStyle = '#05061a'; g.fillRect(0, 850, w, 150);
  for (let x = 0, k = 0; x < w; x += 60, k++) { g.fillStyle = [GOLD, BLUE, RED][k % 3]; g.fillRect(x, 846, 60, 10); }
  g.save(); g.fillStyle = GOLD; g.font = '700 42px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('COMMAND  ·  SCIENCE  ·  ENGINEERING  ·  NAVIGATION', w / 2, 925); g.restore();
  return c;
}

function wall() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#2a2e3a'; g.fillRect(0, 0, 512, 256);
  g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 3; for (let x = 0; x <= 512; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  for (let x = 20; x < 512; x += 128) panelButtons(g, x, 100, 80, 50, 2, 4);
  return c;
}

export default {
  id: 'starpatrol', name: 'STAR PATROL', t1: 'STAR PATROL', t2: 'WARP SPEED', bonus: 'WARP BONUS 1000',
  table, glass, wall,
  dm: { bg: '#0a0700', off: '#2a2006', glow: 'rgba(255,210,80,0.28)', mid: '#ffd23a', hi: '#fff6c8' },
  song: { style: 'fanfare', bpm: 96, roots: [50, 55, 57, 53], arp: [0, 0, 7, 0, 12, 0, 0, 0, 11, 0, 7, 0, 9, 0, 0, 0] },
  apron: { bg: '#0a1030', fg: '#ffd23a', line: '#3a8aff', title: 'STAR PATROL · SECTOR 001' },
  colors: {
    bg: 0x01020a, hemi: [0x9fb8ff, 0x0a0a1a, 0.45], sun: [0xe0e8ff, 1.5], warm: [0x6a8aff, 100],
    trim: { color: 0xe0b040, metalness: 0.9, roughness: 0.32, emissive: 0x000000, ei: 0 },
    accent: { color: 0xd02020, emissive: 0x400606 }, cabinet: 0x0d1020,
    dome: 0x3a8aff, domeEmissive: 0x2060ff, bulb: 0xffffff, bumperLight: 0x4a9aff,
    lamp: 0xffd040, particles: [0xffffff, 0x9fc8ff, 0xffd040], trail: 0x9fc8ff,
    bloom: [0.6, 0.45, 1.15], exposure: 1.0,
  },
};
