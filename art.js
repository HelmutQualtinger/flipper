// Shared canvas drawing helpers for theme artwork
import { TAU, PX, TW, TH, GW, GH, WIN, Z_TOP, DIVIDER_X, GUIDE_ZONES, BUMPERS } from './layout.js';
export { TAU, BUMPERS };

export function tableCanvas() {
  const c = document.createElement('canvas'); c.width = TW; c.height = TH;
  const g = c.getContext('2d');
  return { c, g, w: TW, h: TH, X: x => (x + 10) * PX, Z: z => (z - Z_TOP) * PX, PX };
}
export function glassCanvas() {
  const c = document.createElement('canvas'); c.width = GW; c.height = GH;
  return { c, g: c.getContext('2d'), w: GW, h: GH };
}
export function wallCanvas(base) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 512, 256); return { c, g };
}
export const rnd = (a, b) => a + Math.random() * (b - a);

export function star(g, cx, cy, R, r, n = 5, rot = -Math.PI / 2) {
  g.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 ? r : R, a = rot + i * Math.PI / n;
    g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  g.closePath();
}
export function metroM(g, cx, cy, R, ring = '#f4c542') {
  g.fillStyle = '#d4101c'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.strokeStyle = ring; g.lineWidth = R * 0.12; g.stroke();
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `900 ${R * 1.25}px "Arial Black", Impact, sans-serif`; g.fillText('M', cx, cy + R * 0.06);
}
export function goldGrad(g, y0, y1) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  gr.addColorStop(0, '#fff2b0'); gr.addColorStop(0.5, '#e2a928'); gr.addColorStop(1, '#8a5a10'); return gr;
}
export function chromeGrad(g, y0, y1, stops = ['#ffffff', '#9fd8ff', '#2a2f6a', '#ff9ae0']) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); return gr;
}
export function palm(g, bx, by, tx, ty, L, trunkW, trunk = '#2a1608', leaf = '#0c4a32', nut = '#4a2a12') {
  g.lineCap = 'round'; g.strokeStyle = trunk; g.lineWidth = trunkW;
  g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + (tx - bx) * 0.1, (by + ty) / 2, tx, ty); g.stroke();
  g.fillStyle = leaf;
  for (const deg of [-165, -130, -95, -60, -25, 10, 190]) {
    const a = deg * Math.PI / 180, ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L + L * 0.38;
    const cx = tx + Math.cos(a) * L * 0.55, cy = ty + Math.sin(a) * L * 0.55 - L * 0.22;
    g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(cx, cy - L * 0.13, ex, ey); g.quadraticCurveTo(cx, cy + L * 0.13, tx, ty); g.fill();
  }
  if (nut) { g.fillStyle = nut; for (const dx of [-0.06, 0.07]) { g.beginPath(); g.arc(tx + dx * L, ty + L * 0.08, L * 0.06, 0, TAU); g.fill(); } }
}
export function hibiscus(g, cx, cy, R, petal = '#ff4f8b') {
  for (let i = 0; i < 5; i++) {
    g.save(); g.translate(cx, cy); g.rotate(i * TAU / 5);
    const gr = g.createRadialGradient(0, -R * 0.2, R * 0.05, 0, -R * 0.55, R * 0.7); gr.addColorStop(0, '#b0123f'); gr.addColorStop(0.4, petal); gr.addColorStop(1, '#ffb3cc');
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, -R * 0.55, R * 0.42, R * 0.62, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = R * 0.03; g.stroke(); g.restore();
  }
  g.strokeStyle = '#ffd24a'; g.lineWidth = R * 0.07; g.lineCap = 'round';
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + R * 0.45, cy - R * 0.55); g.stroke();
  g.fillStyle = '#ffe97a'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(cx + R * (0.28 + k * 0.045), cy - R * (0.35 + k * 0.05), R * 0.06, 0, TAU); g.fill(); }
  g.fillStyle = '#ffd24a'; g.beginPath(); g.arc(cx, cy, R * 0.13, 0, TAU); g.fill();
}
export function wavyLine(g, x0, x1, y, amp, freq, phase, step = 10) {
  g.beginPath();
  for (let x = x0; x <= x1; x += step) { const yy = y + Math.sin(x * freq + phase) * amp; g[x === x0 ? 'moveTo' : 'lineTo'](x, yy); }
  g.stroke();
}
export function starfield(g, w, h, n, yMax = h, colors = ['#ffffff']) {
  for (let i = 0; i < n; i++) {
    g.globalAlpha = rnd(0.2, 0.9); g.fillStyle = colors[i % colors.length];
    const s = Math.random() < 0.08 ? 3 : Math.random() < 0.3 ? 2 : 1.2;
    g.fillRect(Math.random() * w, Math.random() * yMax, s, s);
  }
  g.globalAlpha = 1;
}
export function sparkle(g, x, y, r, color = '#fff') {
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = color; g.lineWidth = 2; g.shadowColor = color; g.shadowBlur = 10;
  g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke();
  g.fillStyle = color; g.beginPath(); g.arc(x, y, r * 0.18, 0, TAU); g.fill(); g.restore();
}
export function blob(g, x, y, r, color, alpha) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, color.replace('A', alpha)); gr.addColorStop(1, color.replace('A', 0));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
}
// Cut-out striped retro sun (synthwave style)
export function stripedSun(g, cx, cy, R, top = '#ffe35a', bottom = '#ff2d95', halfOnly = false) {
  const c = document.createElement('canvas'); c.width = c.height = Math.ceil(R * 2 + 4); const s = c.getContext('2d');
  const gr = s.createLinearGradient(0, 0, 0, R * 2); gr.addColorStop(0, top); gr.addColorStop(1, bottom);
  s.fillStyle = gr; s.beginPath(); s.arc(R + 2, R + 2, R, halfOnly ? Math.PI : 0, halfOnly ? TAU : TAU); s.fill();
  s.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 7; i++) { const y = R + 2 + R * (0.1 + i * 0.14), hgt = 2 + i * R * 0.018; s.fillRect(0, y, c.width, hgt); }
  g.save(); g.shadowColor = bottom; g.shadowBlur = R * 0.35; g.drawImage(c, cx - R - 2, cy - R - 2); g.restore();
}
export function perspectiveGrid(g, x0, x1, yH, yB, color, cols = 14, rows = 18, lw = 3) {
  const cx = (x0 + x1) / 2, w = x1 - x0;
  g.save(); g.strokeStyle = color; g.lineWidth = lw; g.shadowColor = color; g.shadowBlur = 12;
  g.beginPath(); g.rect(x0, yH, w, yB - yH); g.clip();
  for (let k = -cols; k <= cols; k++) { g.beginPath(); g.moveTo(cx + k * w * 0.012, yH); g.lineTo(cx + k * w * 0.16, yB); g.stroke(); }
  for (let i = 1; i <= rows; i++) { const y = yH + (yB - yH) * Math.pow(i / rows, 2.1); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
  g.restore();
}

// common playfield pieces
export function guideZones(t, bg, stripe, lw = 14) {
  const { g, X, Z, w, h } = t;
  for (const pts of GUIDE_ZONES) {
    g.save(); g.beginPath(); pts.forEach(([x, z], i) => g[i ? 'lineTo' : 'moveTo'](X(x), Z(z))); g.closePath(); g.clip();
    g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = stripe; g.lineWidth = lw;
    for (let k = -30; k < 60; k++) { g.beginPath(); g.moveTo(X(-12 + k * 0.9), Z(8)); g.lineTo(X(-12 + k * 0.9 + 12), Z(22)); g.stroke(); }
    g.restore();
  }
}
export function laneMarks(t, shade, chevron, arrow) {
  const { g, X, Z, h } = t;
  g.fillStyle = shade; g.fillRect(X(DIVIDER_X), Z(-9), 2 * PX, h);
  g.strokeStyle = chevron; g.lineWidth = 5; g.lineCap = 'round';
  for (let z = 15; z > -8; z -= 3) { g.beginPath(); g.moveTo(X(8.5), Z(z)); g.lineTo(X(9), Z(z - 0.8)); g.lineTo(X(9.5), Z(z)); g.stroke(); }
  g.fillStyle = arrow; g.font = '56px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('▼', X(-8.5), Z(8.5)); g.fillText('▼', X(-8.5), Z(10.3));
}
export function drainFade(t, color = '#000') {
  const { g, Z, w, h } = t;
  const dg = g.createLinearGradient(0, Z(17), 0, h); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, color);
  g.fillStyle = dg; g.fillRect(0, Z(17), w, h);
}
export function signPanel(t, fill, border, inner) {
  const { g, X, Z } = t; const b = { x0: X(-9.6), x1: X(7.6), y0: Z(3.0), y1: Z(6.0) };
  g.fillStyle = fill; g.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  if (border) { g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(b.x0 + 6, b.y0 + 6, b.x1 - b.x0 - 12, b.y1 - b.y0 - 12); }
  if (inner) { g.strokeStyle = inner; g.lineWidth = 3; g.strokeRect(b.x0 + 16, b.y0 + 16, b.x1 - b.x0 - 32, b.y1 - b.y0 - 32); }
  b.cx = (b.x0 + b.x1) / 2; return b;
}
export function fitText(g, text, maxW, size, family = '"Arial Black", Impact, sans-serif', weight = '900') {
  g.font = `${weight} ${size}px ${family}`;
  const tw = g.measureText(text).width; if (tw > maxW) { size *= maxW / tw; g.font = `${weight} ${size}px ${family}`; }
  return size;
}
export function displayWindow(g, frame, inner = '#050100') {
  g.fillStyle = frame; g.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
  g.fillStyle = inner; g.fillRect(WIN.x + 16, WIN.y + 16, WIN.w - 32, WIN.h - 32);
}
export function woodWall(base, grain, knots = 0) {
  const { c, g } = wallCanvas(base);
  for (let i = 0; i < 80; i++) {
    g.strokeStyle = grain.replace('A', rnd(0.06, 0.22)); g.lineWidth = rnd(0.6, 2.4);
    g.beginPath(); const y = Math.random() * 256; g.moveTo(0, y);
    for (let x = 0; x <= 512; x += 64) g.lineTo(x, y + rnd(-5, 5)); g.stroke();
  }
  for (let k = 0; k < knots; k++) { g.strokeStyle = grain.replace('A', 0.3); g.lineWidth = 2; g.beginPath(); g.ellipse(rnd(40, 470), rnd(30, 220), rnd(8, 16), rnd(4, 7), 0, 0, TAU); g.stroke(); }
  return c;
}
