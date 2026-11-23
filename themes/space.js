// Theme: COSMIC VOYAGE – deep space
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, wallCanvas, starfield, sparkle, blob, chromeGrad, guideZones,
  laneMarks, drainFade, signPanel, fitText, displayWindow, rnd } from '../art.js';

const CYAN = '#5fd7ff';

function nebula(g, w, h, spots) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [x, y, r, col, a] of spots) blob(g, x, y, r, col, a);
  g.restore();
}
function ringedPlanet(g, x, y, r, tilt = -0.35) {
  const ring = (front) => {
    g.save(); g.translate(x, y); g.rotate(tilt); g.beginPath();
    g.ellipse(0, 0, r * 2.1, r * 0.55, 0, front ? 0 : Math.PI, front ? Math.PI : TAU);
    g.strokeStyle = 'rgba(255,225,170,0.85)'; g.lineWidth = r * 0.16; g.stroke();
    g.strokeStyle = 'rgba(200,150,90,0.6)'; g.lineWidth = r * 0.06; g.beginPath();
    g.ellipse(0, 0, r * 1.7, r * 0.43, 0, front ? 0 : Math.PI, front ? Math.PI : TAU); g.stroke(); g.restore();
  };
  ring(false);
  const gr = g.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
  gr.addColorStop(0, '#ffe3a8'); gr.addColorStop(0.5, '#d07a3a'); gr.addColorStop(1, '#3a1206');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.clip(); g.globalAlpha = 0.25; g.strokeStyle = '#6a2a10'; g.lineWidth = r * 0.12;
  for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(x - r, y + k * r * 0.28); g.lineTo(x + r, y + k * r * 0.28 + r * 0.15); g.stroke(); }
  g.restore();
  ring(true);
}
function blackHole(g, x, y, r) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    g.save(); g.translate(x, y); g.rotate(-0.25);
    const gr = g.createRadialGradient(0, 0, r * 0.5, 0, 0, r * (2 - i * 0.2));
    gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.35, 'rgba(255,170,60,0.7)'); gr.addColorStop(1, 'rgba(255,60,20,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * (2.1 - i * 0.2), r * (0.55 + i * 0.12), 0, 0, TAU); g.fill(); g.restore();
  }
  g.restore();
  g.fillStyle = '#000'; g.beginPath(); g.arc(x, y, r * 0.62, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(255,200,120,0.9)'; g.lineWidth = r * 0.06; g.shadowColor = '#ffb060'; g.shadowBlur = 20;
  g.beginPath(); g.arc(x, y, r * 0.66, 0, TAU); g.stroke(); g.shadowBlur = 0;
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h } = t;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#04051a'); bg.addColorStop(0.5, '#070a24'); bg.addColorStop(1, '#010208');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  nebula(g, w, h, [[X(-4), Z(-8), 9 * 50, 'rgba(122,44,255,A)', 0.45], [X(5), Z(2), 8 * 50, 'rgba(0,194,209,A)', 0.3],
    [X(-3), Z(9), 7 * 50, 'rgba(255,61,139,A)', 0.25], [X(4), Z(-14), 7 * 50, 'rgba(43,107,255,A)', 0.35], [X(0), Z(15), 9 * 50, 'rgba(90,30,200,A)', 0.25]]);
  starfield(g, w, h, 1100, h, ['#ffffff', '#cfe8ff', '#ffe0c0', '#c8b8ff']);
  for (let i = 0; i < 26; i++) sparkle(g, rnd(0, w), rnd(0, h), rnd(6, 16), ['#ffffff', '#9fdcff', '#ffd8f0'][i % 3]);
  // orbit rings in the arch + planet
  g.save(); g.setLineDash([18, 12]); g.strokeStyle = 'rgba(95,215,255,0.8)'; g.lineWidth = 4; g.shadowColor = CYAN; g.shadowBlur = 12;
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * 50, Math.PI, TAU); g.stroke(); g.setLineDash([]);
  g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 2; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * 50, Math.PI, TAU); g.stroke(); g.restore();
  ringedPlanet(g, X(0), Z(-15.0), 1.6 * 50);
  // bumper orbits
  BUMPERS.forEach((b, i) => {
    g.save(); g.translate(X(b.x), Z(b.z)); g.rotate(0.4 + i);
    g.strokeStyle = 'rgba(95,215,255,0.75)'; g.lineWidth = 3; g.setLineDash([10, 10]);
    g.beginPath(); g.ellipse(0, 0, (b.r + 1.3) * 50, (b.r + 0.7) * 50, 0, 0, TAU); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#cfe8ff'; g.shadowColor = '#fff'; g.shadowBlur = 10; g.beginPath(); g.arc((b.r + 1.3) * 50, 0, 7, 0, TAU); g.fill();
    g.restore();
  });
  // holo sign
  const s = signPanel(t, 'rgba(4,20,31,0.9)', CYAN, 'rgba(95,215,255,0.4)');
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'ORBITAL STATION 7', s.x1 - s.x0 - 90, 78);
  g.shadowColor = CYAN; g.shadowBlur = 18; g.fillStyle = '#dff6ff'; g.fillText('ORBITAL STATION 7', s.cx, s.y0 + 88);
  g.font = '700 28px "Trebuchet MS", sans-serif'; g.fillStyle = CYAN; g.shadowBlur = 8;
  g.fillText('DOCKING BAY  ·  SECTOR 9  ·  GRAVITY WELL AHEAD', s.cx, s.y0 + 130); g.restore();
  blackHole(g, X(0), Z(9.4), 1.6 * 50);
  guideZones(t, '#111111', '#ffc400', 16);
  laneMarks(t, 'rgba(0,0,0,0.55)', CYAN, CYAN);
  drainFade(t, '#000');
  return t.c;
}

function rocket(g, x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const fl = g.createLinearGradient(0, 60, 0, 170); fl.addColorStop(0, '#fff6c0'); fl.addColorStop(0.4, '#ff9a2a'); fl.addColorStop(1, 'rgba(255,60,20,0)');
  g.fillStyle = fl; g.beginPath(); g.moveTo(-18, 60); g.quadraticCurveTo(0, 200, 18, 60); g.fill();
  g.fillStyle = '#d02030'; g.beginPath(); g.moveTo(-26, 30); g.lineTo(-52, 75); g.lineTo(-20, 62); g.fill(); g.beginPath(); g.moveTo(26, 30); g.lineTo(52, 75); g.lineTo(20, 62); g.fill();
  const body = g.createLinearGradient(-26, 0, 26, 0); body.addColorStop(0, '#8a96a8'); body.addColorStop(0.45, '#ffffff'); body.addColorStop(1, '#6a7688');
  g.fillStyle = body; g.beginPath(); g.moveTo(0, -110); g.bezierCurveTo(34, -60, 30, 40, 22, 64); g.lineTo(-22, 64); g.bezierCurveTo(-30, 40, -34, -60, 0, -110); g.fill();
  g.fillStyle = '#5fd7ff'; g.strokeStyle = '#2a3442'; g.lineWidth = 5; g.beginPath(); g.arc(0, -30, 13, 0, TAU); g.fill(); g.stroke();
  g.restore();
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#02030f'); bg.addColorStop(1, '#0a0828');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  nebula(g, w, h, [[400, 300, 600, 'rgba(122,44,255,A)', 0.5], [1700, 500, 600, 'rgba(0,194,209,A)', 0.35], [1100, 100, 500, 'rgba(255,61,139,A)', 0.3]]);
  starfield(g, w, h, 900, h, ['#fff', '#cfe8ff', '#ffe0c0']);
  for (let i = 0; i < 18; i++) sparkle(g, rnd(0, w), rnd(0, h), rnd(8, 22));
  // big planet bottom-left with atmosphere
  const pg = g.createRadialGradient(180, 760, 40, 260, 900, 460); pg.addColorStop(0, '#9fe8ff'); pg.addColorStop(0.5, '#1f6fb8'); pg.addColorStop(1, '#061a3a');
  g.save(); g.shadowColor = '#5fd7ff'; g.shadowBlur = 60; g.fillStyle = pg; g.beginPath(); g.arc(260, 980, 460, 0, TAU); g.fill(); g.restore();
  ringedPlanet(g, 1950, 640, 120, -0.3);
  rocket(g, 1880, 330, 1.1, 0.6);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 190px "Arial Black", Impact, sans-serif';
  g.shadowColor = CYAN; g.shadowBlur = 36; g.fillStyle = chromeGrad(g, 70, 230, ['#ffffff', '#cfe8ff', '#3a5a8a', '#0c1a33', '#9fdcff']);
  g.fillText('COSMIC VOYAGE', w / 2, 150); g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = '#e8f6ff'; g.strokeText('COSMIC VOYAGE', w / 2, 150);
  g.fillStyle = 'rgba(4,20,31,0.9)'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = CYAN; g.lineWidth = 4; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = CYAN; g.font = '900 42px "Arial Black", Impact, sans-serif'; g.fillText('DEEP SPACE PINBALL  ·  EST. 2187', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#e8f2ff'); fr.addColorStop(0.5, '#7a8aa6'); fr.addColorStop(1, '#2a3446');
  displayWindow(g, fr, '#00040a');
  g.fillStyle = '#03060f'; g.fillRect(0, 850, w, 150); g.fillStyle = CYAN; g.fillRect(0, 846, w, 6);
  g.save(); g.fillStyle = CYAN; g.font = '700 42px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('MERCURY  ·  VENUS  ·  EARTH  ·  MARS  ·  JUPITER  ·  SATURN', w / 2, 925); g.restore();
  return c;
}

function wall() {
  const { c, g } = wallCanvas('#3a4352');
  for (let i = 0; i < 60; i++) { g.strokeStyle = `rgba(255,255,255,${rnd(0.02, 0.07)})`; g.beginPath(); const y = rnd(0, 256); g.moveTo(0, y); g.lineTo(512, y + rnd(-2, 2)); g.stroke(); }
  g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 3; for (let x = 0; x <= 512; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); }
  for (let x = 16; x < 512; x += 128) for (const y of [20, 236]) { g.fillStyle = '#8a94a6'; g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); g.fillStyle = '#1a2030'; g.beginPath(); g.arc(x + 1, y + 1, 2, 0, TAU); g.fill(); }
  return c;
}

export default {
  id: 'space', name: 'COSMIC VOYAGE', t1: 'COSMIC VOYAGE', t2: 'LIFTOFF!', bonus: 'WARP BONUS 1000',
  table, glass, wall,
  dm: { bg: '#00040a', off: '#05182a', glow: 'rgba(80,180,255,0.30)', mid: '#3fa9ff', hi: '#d8f2ff' },
  song: { style: 'ambient', bpm: 84, roots: [50, 46, 53, 48], arp: [0, 7, 12, 14, 19, 14, 12, 7, 0, 7, 12, 14, 17, 14, 12, 7] },
  apron: { bg: '#060a1c', fg: '#cfe8ff', line: '#5fd7ff', title: 'COSMIC VOYAGE · SECTOR 9' },
  colors: {
    bg: 0x01020a, hemi: [0x8fb8ff, 0x0a0a20, 0.45], sun: [0xdfe9ff, 1.5], warm: [0x6a5aff, 110],
    trim: { color: 0xa9bcd6, metalness: 0.9, roughness: 0.35, emissive: 0x000000, ei: 0 },
    accent: { color: 0x2f6bff, emissive: 0x0a2a8a }, cabinet: 0x0d1220,
    dome: 0x10a8ff, domeEmissive: 0x29e0ff, bulb: 0xffffff, bumperLight: 0x40c8ff,
    lamp: 0x5fd7ff, particles: [0xffffff, 0x5fd7ff], trail: 0x6aa8ff,
    bloom: [0.6, 0.45, 1.15], exposure: 1.05,
  },
};
