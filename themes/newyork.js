// Theme: NEW YORK – Manhattan skyline at night, Broadway marquee, yellow cabs
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, wallCanvas, starfield, guideZones, laneMarks, drainFade, signPanel, fitText,
  displayWindow, chromeGrad, goldGrad, blob, rnd } from '../art.js';

const TAXI = '#ffc61a', NEON_R = '#ff3050', NEON_B = '#40c0ff', NIGHT = '#05060f';

function windows(g, x, y, w, h, lit = 0.45, col = '#ffd870') {
  for (let wy = y + 8; wy < y + h - 6; wy += 12) for (let wx = x + 6; wx < x + w - 6; wx += 10)
    if (Math.random() < lit) { g.fillStyle = col; g.globalAlpha = rnd(0.5, 1); g.fillRect(wx, wy, 5, 7); }
  g.globalAlpha = 1;
}
function empireState(g, x, base, s) {
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = NIGHT;
  g.fillRect(-60, -260, 120, 260); g.fillRect(-42, -340, 84, 80); g.fillRect(-28, -400, 56, 60); g.fillRect(-16, -440, 32, 40);
  g.fillRect(-7, -500, 14, 60); g.fillRect(-2, -560, 4, 60);
  g.fillStyle = '#ffe08a'; g.shadowColor = '#ffd060'; g.shadowBlur = 18; g.fillRect(-16, -440, 32, 6); g.fillRect(-7, -480, 14, 4);
  g.restore(); g.save(); g.translate(x, base); g.scale(s, s); windows(g, -56, -255, 112, 250); windows(g, -38, -335, 76, 70); g.restore();
}
function chrysler(g, x, base, s) {
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = NIGHT;
  g.fillRect(-45, -300, 90, 300); g.fillRect(-32, -360, 64, 60);
  g.beginPath(); g.moveTo(-32, -360); g.quadraticCurveTo(0, -470, 32, -360); g.fill(); g.fillRect(-2, -520, 4, 80);
  g.strokeStyle = '#ffe9b0'; g.lineWidth = 2.5; g.shadowColor = '#fff2c0'; g.shadowBlur = 10;
  for (let k = 0; k < 5; k++) { const r = 30 - k * 5, yy = -360 - k * 18; g.beginPath(); g.arc(0, yy, r, Math.PI, TAU); g.stroke(); }
  g.restore(); g.save(); g.translate(x, base); g.scale(s, s); windows(g, -42, -295, 84, 290); g.restore();
}
function skyline(g, x0, x1, base, hMax, seed = 1) {
  let x = x0;
  while (x < x1) {
    const bw = rnd(30, 90), bh = rnd(0.25, 1) * hMax;
    g.fillStyle = NIGHT; g.fillRect(x, base - bh, bw, bh);
    if (Math.random() < 0.3) { g.fillRect(x + bw * 0.3, base - bh - 20, bw * 0.4, 20); }
    if (Math.random() < 0.2) { g.fillRect(x + bw / 2 - 1, base - bh - 50, 2, 50); }
    windows(g, x + 2, base - bh + 4, bw - 4, bh - 8, 0.35);
    x += bw + rnd(-4, 6);
  }
}
function liberty(g, x, base, s) {
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = '#2a7a6a';
  g.fillRect(-30, -40, 60, 40); g.fillRect(-20, -80, 40, 40);
  g.beginPath(); g.moveTo(-16, -80); g.lineTo(-12, -170); g.lineTo(12, -170); g.lineTo(18, -80); g.fill();
  g.beginPath(); g.arc(0, -182, 13, 0, TAU); g.fill();
  for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(k * 5, -192); g.lineTo(k * 12, -210); g.lineTo(k * 5 + 3, -192); g.fill(); }
  g.lineWidth = 9; g.strokeStyle = '#2a7a6a'; g.lineCap = 'round'; g.beginPath(); g.moveTo(10, -160); g.lineTo(26, -232); g.stroke();
  g.fillStyle = '#ffd060'; g.shadowColor = '#ffb030'; g.shadowBlur = 24; g.beginPath(); g.ellipse(28, -246, 8, 14, 0.2, 0, TAU); g.fill();
  g.restore();
}
function apple(g, x, y, r) {
  g.save();
  const ag = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r * 1.1); ag.addColorStop(0, '#ff7a7a'); ag.addColorStop(0.6, '#d01020'); ag.addColorStop(1, '#6a0008');
  g.fillStyle = ag; g.beginPath();
  g.moveTo(x, y - r * 0.6); g.bezierCurveTo(x + r * 0.6, y - r * 1.05, x + r * 1.2, y - r * 0.4, x + r * 0.9, y + r * 0.35);
  g.bezierCurveTo(x + r * 0.7, y + r * 0.95, x + r * 0.2, y + r * 1.05, x, y + r * 0.85);
  g.bezierCurveTo(x - r * 0.2, y + r * 1.05, x - r * 0.7, y + r * 0.95, x - r * 0.9, y + r * 0.35);
  g.bezierCurveTo(x - r * 1.2, y - r * 0.4, x - r * 0.6, y - r * 1.05, x, y - r * 0.6); g.fill();
  g.strokeStyle = '#4a2a10'; g.lineWidth = r * 0.08; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y - r * 0.55); g.quadraticCurveTo(x + r * 0.05, y - r * 0.9, x + r * 0.15, y - r * 1.05); g.stroke();
  g.fillStyle = '#3aa83a'; g.beginPath(); g.ellipse(x + r * 0.42, y - r * 0.9, r * 0.32, r * 0.14, -0.5, 0, TAU); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(x - r * 0.4, y - r * 0.25, r * 0.12, r * 0.22, 0.4, 0, TAU); g.fill();
  g.restore();
}
function marqueeBulbs(g, x0, y0, x1, y1, step = 26, r = 6) {
  g.save(); g.fillStyle = '#fff4c0'; g.shadowColor = '#ffd060'; g.shadowBlur = 12;
  for (let x = x0; x <= x1; x += step) { g.beginPath(); g.arc(x, y0, r, 0, TAU); g.arc(x, y1, r, 0, TAU); g.fill(); }
  for (let y = y0 + step; y < y1; y += step) { g.beginPath(); g.arc(x0, y, r, 0, TAU); g.arc(x1, y, r, 0, TAU); g.fill(); }
  g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t, hz = Z(-8.6);
  const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#05061a'); sky.addColorStop(0.6, '#1a1a4a'); sky.addColorStop(1, '#5a2a5a');
  g.fillStyle = sky; g.fillRect(0, 0, w, hz);
  starfield(g, w, hz, 140, hz * 0.6);
  g.save(); g.shadowColor = '#fff6d0'; g.shadowBlur = 40; g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(X(6.0), Z(-15.6), 0.9 * PX, 0, TAU); g.fill(); g.restore();
  // skyline in the arch
  skyline(g, 0, w, hz, 3.2 * PX);
  empireState(g, X(0), hz, 0.72); chrysler(g, X(-3.4), hz, 0.6);
  // street level: asphalt + avenue grid + glowing street lights
  const st = g.createLinearGradient(0, hz, 0, h); st.addColorStop(0, '#1a1a24'); st.addColorStop(1, '#08080c');
  g.fillStyle = st; g.fillRect(0, hz, w, h - hz);
  g.save(); g.translate(X(0), Z(4)); g.rotate(0.5); g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 26;
  for (let k = -12; k <= 12; k++) { g.beginPath(); g.moveTo(k * 120, -1400); g.lineTo(k * 120, 1400); g.stroke(); g.beginPath(); g.moveTo(-1400, k * 70); g.lineTo(1400, k * 70); g.stroke(); }
  g.restore();
  g.strokeStyle = 'rgba(255,198,26,0.7)'; g.lineWidth = 5; g.setLineDash([26, 22]);
  g.beginPath(); g.moveTo(X(0), hz + 20); g.lineTo(X(0), h); g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 26; i++) blob(g, rnd(0, w), rnd(hz + 40, h), rnd(30, 70), 'rgba(255,200,90,A)', 0.18);
  // neon rings
  g.save(); g.strokeStyle = NEON_R; g.shadowColor = NEON_R; g.shadowBlur = 18; g.lineWidth = 6;
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = NEON_B; g.shadowColor = NEON_B; g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * PX, Math.PI, TAU); g.stroke(); g.restore();
  BUMPERS.forEach((b, i) => { g.save(); const col = i % 2 ? NEON_B : NEON_R; g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 20; g.lineWidth = 5;
    g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke(); g.restore(); });
  // Broadway marquee
  const s = signPanel(t, '#1a0408', null, null);
  marqueeBulbs(g, s.x0 + 14, s.y0 + 14, s.x1 - 14, s.y1 - 14);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'BROADWAY', s.x1 - s.x0 - 140, 96);
  g.fillStyle = goldGrad(g, s.y0 + 25, s.y0 + 100); g.shadowColor = NEON_R; g.shadowBlur = 20; g.fillText('BROADWAY', s.cx, s.y0 + 96);
  g.shadowBlur = 0; g.font = '700 26px "Trebuchet MS", sans-serif'; g.fillStyle = '#fff4c0';
  g.fillText('TIMES SQUARE  ·  42ND STREET  ·  SHOW TONIGHT', s.cx, s.y0 + 128); g.restore();
  apple(g, X(0), Z(9.6), 1.6 * PX);
  // taxi checker zones
  guideZones(t, TAXI, '#111', 22);
  laneMarks(t, 'rgba(0,0,0,0.5)', TAXI, NEON_R);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, 800); sky.addColorStop(0, '#060820'); sky.addColorStop(0.5, '#2a1a5a'); sky.addColorStop(0.85, '#c04a6a'); sky.addColorStop(1, '#ff9a4a');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 220, 380);
  blob(g, w / 2, 780, 800, 'rgba(255,140,80,A)', 0.35);
  // Brooklyn Bridge (left) + skyline + Liberty (right)
  g.save(); g.strokeStyle = NIGHT; g.fillStyle = NIGHT;
  for (const tx of [80, 330]) { g.fillRect(tx - 18, 560, 36, 290); g.fillRect(tx - 24, 560, 48, 18); }
  g.lineWidth = 3; g.beginPath(); g.moveTo(0, 640); g.quadraticCurveTo(205, 820, 410, 600); g.stroke();
  for (let x = 100; x < 320; x += 18) { const y = 720 - ((x - 205) / 205) ** 2 * 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x, 790); g.stroke(); }
  g.fillRect(0, 785, 420, 14); g.restore();
  skyline(g, 380, 1800, 850, 340);
  empireState(g, 1090, 850, 1.05); chrysler(g, 760, 850, 0.9);
  liberty(g, 1980, 850, 1.6);
  const water = g.createLinearGradient(0, 800, 0, 850); water.addColorStop(0, 'rgba(10,20,60,0.0)'); water.addColorStop(1, 'rgba(10,20,60,0.6)');
  g.fillStyle = water; g.fillRect(0, 800, w, 50);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 210px "Arial Black", Impact, sans-serif';
  g.lineWidth = 14; g.strokeStyle = '#000'; g.lineJoin = 'round'; g.strokeText('NEW YORK', w / 2, 150);
  g.shadowColor = NEON_R; g.shadowBlur = 36; g.fillStyle = chromeGrad(g, 60, 240, ['#ffffff', '#ffe9a0', '#d4a020', '#5a3a08', '#ffe9a0']); g.fillText('NEW YORK', w / 2, 150); g.shadowBlur = 0;
  g.fillStyle = '#1a0408'; g.fillRect(560, 262, 1020, 80); marqueeBulbs(g, 572, 272, 1568, 332, 24, 5);
  g.fillStyle = '#fff4c0'; g.font = '900 40px "Arial Black", Impact, sans-serif'; g.fillText('THE CITY THAT NEVER SLEEPS', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#ffe9a0'); fr.addColorStop(0.5, '#d4a020'); fr.addColorStop(1, '#5a3a08');
  displayWindow(g, fr, '#0a0000');
  g.fillStyle = '#05060f'; g.fillRect(0, 850, w, 150);
  for (let x = 0; x < w; x += 30) { g.fillStyle = (x / 30) % 2 ? '#111' : TAXI; g.fillRect(x, 846, 30, 12); }
  g.save(); g.fillStyle = TAXI; g.font = '700 44px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('MANHATTAN  ·  BROOKLYN  ·  QUEENS  ·  THE BRONX  ·  STATEN ISLAND', w / 2, 925); g.restore();
  return c;
}

function wall() {
  const { c, g } = wallCanvas('#7a3020');
  g.strokeStyle = 'rgba(220,200,180,0.55)'; g.lineWidth = 3;
  for (let y = 0, row = 0; y <= 256; y += 32, row++) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke();
    for (let x = (row % 2) * 32; x <= 512; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); }
  }
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(0,0,0,${rnd(0.05, 0.2)})`; g.fillRect(rnd(0, 512), rnd(0, 256), 3, 3); }
  return c;
}

export default {
  id: 'newyork', name: 'NEW YORK', t1: 'NEW YORK', t2: 'BIG APPLE', bonus: 'BROADWAY BONUS 1000',
  table, glass, wall,
  dm: { bg: '#0a0000', off: '#2a0606', glow: 'rgba(255,60,60,0.28)', mid: '#ff3a3a', hi: '#ffd0d0' },
  song: { style: 'jazz', bpm: 132, steps: 12, roots: [60, 57, 62, 55], arp: [12, 0, 0, 16, 0, 19, 17, 0, 0, 14, 0, 12] },
  apron: { bg: '#111118', fg: '#ffc61a', line: '#ff3050', title: 'NEW YORK · BROADWAY' },
  colors: {
    bg: 0x03040c, hemi: [0xa0b8ff, 0x201810, 0.5], sun: [0xe0e8ff, 1.4], warm: [0xffc040, 90],
    trim: { color: 0xc4cad4, metalness: 0.9, roughness: 0.38, emissive: 0x000000, ei: 0 },
    accent: { color: 0xffc61a, emissive: 0x4a3000 }, cabinet: 0x101218,
    dome: 0xff2a4a, domeEmissive: 0xff1030, bulb: 0xfff4d0, bumperLight: 0xff3050,
    lamp: 0xffd040, particles: [0xffd040, 0xff3050, 0x40c0ff], trail: 0xffd040,
    bloom: [0.55, 0.45, 1.25], exposure: 1.0,
  },
};
