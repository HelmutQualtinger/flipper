// Theme: TESLA COIL – Nikola Tesla's high-voltage laboratory, art-deco + lightning
import { TAU, BUMPERS, WIN } from '../layout.js';
import { tableCanvas, glassCanvas, wallCanvas, sparkle, blob, chromeGrad, guideZones,
  laneMarks, drainFade, signPanel, fitText, displayWindow, rnd } from '../art.js';

const ARC = '#8fe3ff', COPPER = '#d9894a';

// jagged lightning bolt from (x0,y0) to (x1,y1) with random forks
function bolt(g, x0, y0, x1, y1, width = 6, color = ARC, depth = 0) {
  const pts = [[x0, y0]], n = 10, dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  for (let i = 1; i < n; i++) { const t = i / n, off = rnd(-1, 1) * len * 0.09; pts.push([x0 + dx * t + nx * off, y0 + dy * t + ny * off]); }
  pts.push([x1, y1]);
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [lw, col, blur] of [[width * 3, color, 30], [width, color, 14], [width * 0.4, '#ffffff', 6]]) {
    g.strokeStyle = col; g.lineWidth = lw; g.shadowColor = color; g.shadowBlur = blur; g.globalAlpha = lw === width * 3 ? 0.25 : 1;
    g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.stroke();
  }
  g.restore();
  if (depth < 2) for (let k = 0; k < 2; k++) {
    const [fx, fy] = pts[2 + Math.floor(rnd(0, n - 4))], a = Math.atan2(dy, dx) + rnd(-0.9, 0.9), L = len * rnd(0.2, 0.4);
    bolt(g, fx, fy, fx + Math.cos(a) * L, fy + Math.sin(a) * L, width * 0.55, color, depth + 1);
  }
}
// tesla coil: base, copper winding, toroid on top; returns toroid centre
function coil(g, x, yBase, s) {
  g.save(); g.translate(x, yBase); g.scale(s, s);
  g.fillStyle = '#20242c'; g.fillRect(-60, -30, 120, 30); g.fillStyle = '#3a414e'; g.fillRect(-50, -40, 100, 12);
  const cu = g.createLinearGradient(-28, 0, 28, 0); cu.addColorStop(0, '#6a3410'); cu.addColorStop(0.45, '#ffb070'); cu.addColorStop(1, '#5a2a0a');
  g.fillStyle = cu; g.fillRect(-26, -230, 52, 192);
  g.strokeStyle = 'rgba(60,25,5,0.55)'; g.lineWidth = 2; for (let y = -228; y < -40; y += 6) { g.beginPath(); g.moveTo(-26, y); g.lineTo(26, y + 2); g.stroke(); }
  g.fillStyle = '#3a414e'; g.fillRect(-6, -262, 12, 34);
  const tor = g.createLinearGradient(0, -300, 0, -240); tor.addColorStop(0, '#ffffff'); tor.addColorStop(0.5, '#9aa6b8'); tor.addColorStop(1, '#2a303c');
  g.fillStyle = tor; g.beginPath(); g.ellipse(0, -270, 78, 26, 0, 0, TAU); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, -266, 30, 8, 0, 0, TAU); g.fill();
  g.restore();
  return [x, yBase - 270 * s];
}
// art-deco sunburst fan
function decoFan(g, cx, cy, R, rays, color) {
  g.save(); g.strokeStyle = color; g.lineWidth = 4;
  for (let i = 0; i <= rays; i++) { const a = Math.PI + i * Math.PI / rays; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * 0.25, cy + Math.sin(a) * R * 0.25); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.stroke(); }
  for (const f of [0.25, 0.6, 1]) { g.beginPath(); g.arc(cx, cy, R * f, Math.PI, TAU); g.stroke(); }
  g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h } = t;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0b1220'); bg.addColorStop(0.5, '#101a2c'); bg.addColorStop(1, '#03060c');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // blueprint grid
  g.strokeStyle = 'rgba(120,190,255,0.08)'; g.lineWidth = 2;
  for (let x = 0; x < w; x += 50) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 50) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.save(); g.globalCompositeOperation = 'lighter';
  blob(g, X(0), Z(-6), 8 * 50, 'rgba(60,140,255,A)', 0.35); blob(g, X(0), Z(9), 6 * 50, 'rgba(120,80,255,A)', 0.2); g.restore();
  decoFan(g, X(0), Z(-10), 8.6 * 50, 18, 'rgba(217,137,74,0.55)');
  // central coil in the arch + arcs to the bumpers
  const [tx, ty] = coil(g, X(0), Z(-11.2), 0.9);
  BUMPERS.slice(0, 2).forEach(b => bolt(g, tx, ty, X(b.x), Z(b.z), 5));
  // copper rings + spark around each bumper
  BUMPERS.forEach(b => {
    g.save(); g.strokeStyle = COPPER; g.lineWidth = 10; g.shadowColor = '#ff9a40'; g.shadowBlur = 10;
    g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.9) * 50, 0, TAU); g.stroke();
    g.strokeStyle = 'rgba(143,227,255,0.8)'; g.lineWidth = 3; g.setLineDash([6, 14]); g.shadowColor = ARC;
    g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.3) * 50, 0, TAU); g.stroke(); g.restore();
  });
  bolt(g, X(-4), Z(-7), X(0), Z(-2.5), 4); bolt(g, X(4), Z(-7), X(0), Z(-2.5), 4);
  for (let i = 0; i < 20; i++) sparkle(g, rnd(0, w), rnd(Z(-17), Z(2)), rnd(6, 14), i % 2 ? ARC : '#ffffff');
  const s = signPanel(t, 'rgba(8,14,26,0.92)', COPPER, 'rgba(143,227,255,0.45)');
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'HIGH VOLTAGE LAB', s.x1 - s.x0 - 90, 78);
  g.shadowColor = ARC; g.shadowBlur = 18; g.fillStyle = '#e6f8ff'; g.fillText('HIGH VOLTAGE LAB', s.cx, s.y0 + 88);
  g.font = '700 28px "Trebuchet MS", sans-serif'; g.fillStyle = COPPER; g.shadowBlur = 6; g.shadowColor = '#ff9a40';
  g.fillText('COLORADO SPRINGS  ·  1899  ·  DANGER: 10 000 000 V', s.cx, s.y0 + 130); g.restore();
  // warning symbol between the flippers
  g.save(); g.translate(X(0), Z(9.4)); g.fillStyle = '#ffd21a'; g.strokeStyle = '#111'; g.lineWidth = 10; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(0, -80); g.lineTo(78, 56); g.lineTo(-78, 56); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#111'; g.beginPath(); g.moveTo(10, -46); g.lineTo(-20, 8); g.lineTo(2, 8); g.lineTo(-12, 46); g.lineTo(22, -6); g.lineTo(0, -6); g.closePath(); g.fill(); g.restore();
  guideZones(t, '#111111', '#ffd21a', 16);
  laneMarks(t, 'rgba(0,0,0,0.55)', ARC, COPPER);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#050a16'); bg.addColorStop(1, '#141c30');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.save(); g.globalCompositeOperation = 'lighter';
  blob(g, 260, 500, 520, 'rgba(60,140,255,A)', 0.4); blob(g, 1880, 500, 520, 'rgba(60,140,255,A)', 0.4); g.restore();
  decoFan(g, w / 2, 430, 900, 24, 'rgba(217,137,74,0.3)');
  const L = coil(g, 210, 860, 2.0), R = coil(g, 1930, 860, 2.0);
  bolt(g, L[0] + 120, L[1], WIN.x - 10, 560, 7); bolt(g, R[0] - 120, R[1], WIN.x + WIN.w + 10, 560, 7);
  bolt(g, L[0], L[1] - 50, 640, 60, 5); bolt(g, R[0], R[1] - 50, 1500, 60, 5);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 200px "Arial Black", Impact, sans-serif';
  g.shadowColor = ARC; g.shadowBlur = 40; g.fillStyle = chromeGrad(g, 60, 240, ['#ffffff', '#cfefff', '#4a6a9a', '#101a30', '#ffc890']);
  g.fillText('TESLA COIL', w / 2, 150); g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = '#f0fbff'; g.strokeText('TESLA COIL', w / 2, 150);
  g.fillStyle = 'rgba(8,14,26,0.92)'; g.fillRect(600, 262, 940, 80); g.strokeStyle = COPPER; g.lineWidth = 4; g.strokeRect(600, 262, 940, 80);
  g.fillStyle = COPPER; g.font = '900 42px "Arial Black", Impact, sans-serif'; g.fillText('ALTERNATING CURRENT PINBALL', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#ffd0a0'); fr.addColorStop(0.5, '#b0602a'); fr.addColorStop(1, '#4a2208');
  displayWindow(g, fr, '#00040a');
  g.fillStyle = '#05080f'; g.fillRect(0, 850, w, 150); g.fillStyle = COPPER; g.fillRect(0, 846, w, 6);
  g.save(); g.fillStyle = ARC; g.font = '700 42px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('VOLTAGE  ·  FREQUENCY  ·  RESONANCE  ·  WARDENCLYFFE', w / 2, 925); g.restore();
  return c;
}
function wall() {
  const { c, g } = wallCanvas('#2a2e36');
  g.strokeStyle = 'rgba(217,137,74,0.7)'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 30); g.lineTo(512, 30); g.moveTo(0, 226); g.lineTo(512, 226); g.stroke();
  for (let x = 0; x < 512; x += 64) { g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 30); g.lineTo(x, 226); g.stroke();
    g.fillStyle = '#c07a40'; for (const y of [30, 226]) { g.beginPath(); g.arc(x + 32, y, 6, 0, TAU); g.fill(); } }
  return c;
}

export default {
  id: 'tesla', name: 'TESLA COIL', t1: 'TESLA COIL', t2: 'HIGH VOLTAGE!', bonus: 'OVERLOAD BONUS 1000',
  table, glass, wall,
  dm: { bg: '#00050c', off: '#06202e', glow: 'rgba(120,220,255,0.30)', mid: '#5ad2ff', hi: '#e0f8ff' },
  song: { style: 'synth', bpm: 124, roots: [52, 52, 48, 50], arp: [0, 12, 7, 12, 3, 12, 7, 12, 0, 12, 7, 15, 3, 15, 10, 12] },
  apron: { bg: '#0a101c', fg: '#e0f8ff', line: '#d9894a', title: 'TESLA COIL · HIGH VOLTAGE LAB' },
  colors: {
    bg: 0x02040a, hemi: [0xa8d8ff, 0x0a0c14, 0.45], sun: [0xe6f2ff, 1.5], warm: [0xff9a50, 90],
    trim: { color: 0xc98a52, metalness: 1, roughness: 0.3, emissive: 0x000000, ei: 0 },
    accent: { color: 0x1a3a6a, emissive: 0x0a2050 }, cabinet: 0x14181f,
    dome: 0x60c8ff, domeEmissive: 0x40d8ff, bulb: 0xffffff, bumperLight: 0x70d8ff,
    lamp: 0x8fe3ff, particles: [0xffffff, 0x8fe3ff], trail: 0x9fe8ff,
    bloom: [0.65, 0.45, 1.1], exposure: 1.05,
  },
};
