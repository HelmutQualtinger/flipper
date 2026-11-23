// Theme: TESLA – Nikola Tesla, high voltage, Tesla coils and lightning
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, wallCanvas, starfield, guideZones, laneMarks, drainFade, signPanel, fitText,
  displayWindow, chromeGrad, lightning, blob, rnd } from '../art.js';

const ARC = '#9fd8ff', VIOLET = '#a878ff', COPPER = '#c87533';

function teslaCoil(g, x, baseY, h, s = 1) {
  // base + secondary winding + toroid
  g.save();
  g.fillStyle = '#1a1a22'; g.fillRect(x - 46 * s, baseY - 20 * s, 92 * s, 20 * s);
  const cg = g.createLinearGradient(x - 18 * s, 0, x + 18 * s, 0); cg.addColorStop(0, '#6a3a18'); cg.addColorStop(0.5, '#f0a060'); cg.addColorStop(1, '#5a2a10');
  g.fillStyle = cg; g.fillRect(x - 18 * s, baseY - h, 36 * s, h - 20 * s);
  g.strokeStyle = 'rgba(60,25,5,0.6)'; g.lineWidth = 1.2 * s;
  for (let y = baseY - h + 4; y < baseY - 20 * s; y += 4 * s) { g.beginPath(); g.moveTo(x - 18 * s, y); g.lineTo(x + 18 * s, y + 1); g.stroke(); }
  const tg = g.createLinearGradient(0, baseY - h - 30 * s, 0, baseY - h + 10 * s); tg.addColorStop(0, '#ffffff'); tg.addColorStop(0.5, '#9aa6b8'); tg.addColorStop(1, '#3a4252');
  g.fillStyle = tg; g.beginPath(); g.ellipse(x, baseY - h - 8 * s, 62 * s, 22 * s, 0, 0, TAU); g.fill();
  g.restore();
  return [x, baseY - h - 8 * s];
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#0a1838'); bg.addColorStop(0.5, '#061230'); bg.addColorStop(1, '#02050f');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // blueprint grid + schematic marks
  g.strokeStyle = 'rgba(120,190,255,0.10)'; g.lineWidth = 1;
  for (let x = 0; x <= w; x += 25) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y <= h; y += 25) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(120,190,255,0.22)'; for (let x = 0; x <= w; x += 100) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y <= h; y += 100) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.save(); g.strokeStyle = 'rgba(160,210,255,0.35)'; g.lineWidth = 2; g.font = '600 18px "Courier New", monospace'; g.fillStyle = 'rgba(160,210,255,0.45)';
  for (const [x, z, txt] of [[-8.6, -2, 'L1 = 46 mH'], [5.6, 1.4, 'C = 0.8 µF'], [-8.6, 2.2, 'f = 150 kHz'], [5.0, -9.6, 'U = 1 MV']]) g.fillText(txt, X(x), Z(z));
  // coil symbols
  for (const [x, z] of [[-7.5, 0.6], [6.5, 3.1]]) { g.beginPath(); for (let i = 0; i < 5; i++) g.arc(X(x) + i * 18, Z(z), 9, Math.PI, 0); g.stroke(); }
  g.restore();
  blob(g, X(0), Z(-13), 9 * PX, 'rgba(120,80,255,A)', 0.35);
  blob(g, X(0), Z(-4.5), 7 * PX, 'rgba(60,160,255,A)', 0.25);
  // copper winding ring around the arch
  g.save(); g.strokeStyle = COPPER; g.lineWidth = 7; g.shadowColor = '#ff9a50'; g.shadowBlur = 8;
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,170,100,0.6)'; g.lineWidth = 2;
  for (let a = Math.PI; a <= TAU; a += 0.035) { const r1 = 8.95 * PX, r2 = 9.45 * PX; g.beginPath(); g.moveTo(X(0) + Math.cos(a) * r1, Z(-12) + Math.sin(a) * r1); g.lineTo(X(0) + Math.cos(a + 0.02) * r2, Z(-12) + Math.sin(a + 0.02) * r2); g.stroke(); }
  g.restore();
  // Tesla coil in the arch, arcs to the ring
  const [tx, ty] = teslaCoil(g, X(0), Z(-11.4), 2.6 * PX, 0.9);
  for (let i = 0; i < 7; i++) { const a = Math.PI + 0.25 + i * (Math.PI - 0.5) / 6; lightning(g, tx, ty, X(0) + Math.cos(a) * 8.6 * PX, Z(-12) + Math.sin(a) * 8.6 * PX, { disp: 70, depth: 6, color: i % 2 ? VIOLET : ARC, width: 2.4 }); }
  // arcs between bumpers
  const B = BUMPERS;
  for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) lightning(g, X(B[a].x), Z(B[a].z), X(B[b].x), Z(B[b].z), { disp: 50, depth: 5, color: ARC, width: 2 });
  B.forEach(b => { g.save(); g.strokeStyle = ARC; g.shadowColor = ARC; g.shadowBlur = 16; g.lineWidth = 4; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke();
    g.strokeStyle = COPPER; g.shadowBlur = 0; g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.3) * PX, 0, TAU); g.stroke(); g.restore(); });
  // sign
  const s = signPanel(t, 'rgba(4,8,20,0.92)', COPPER, 'rgba(159,216,255,0.5)');
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'HIGH VOLTAGE', s.x1 - s.x0 - 90, 90);
  g.shadowColor = ARC; g.shadowBlur = 22; g.fillStyle = '#e8f6ff'; g.fillText('HIGH VOLTAGE', s.cx, s.y0 + 92);
  g.font = '700 28px "Courier New", monospace'; g.fillStyle = ARC; g.shadowBlur = 8;
  g.fillText('WARDENCLYFFE · 1901 · ALTERNATING CURRENT', s.cx, s.y0 + 130); g.restore();
  // lightning roundel
  g.save(); const cx = X(0), cy = Z(9.4), r = 1.8 * PX;
  g.fillStyle = '#05070f'; g.strokeStyle = COPPER; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = '#ffe14a'; g.shadowColor = '#ffe14a'; g.shadowBlur = 24; g.beginPath();
  g.moveTo(cx + r * 0.15, cy - r * 0.78); g.lineTo(cx - r * 0.42, cy + r * 0.1); g.lineTo(cx - r * 0.02, cy + r * 0.1);
  g.lineTo(cx - r * 0.2, cy + r * 0.8); g.lineTo(cx + r * 0.45, cy - r * 0.12); g.lineTo(cx + r * 0.05, cy - r * 0.12); g.closePath(); g.fill(); g.restore();
  guideZones(t, '#140a04', 'rgba(200,117,51,0.85)', 9);
  laneMarks(t, 'rgba(0,0,0,0.55)', ARC, '#ffe14a');
  drainFade(t, '#000');
  return t.c;
}

function tower(g, x, baseY, s) {
  g.save(); g.fillStyle = '#05070f'; g.strokeStyle = '#05070f'; g.lineWidth = 3 * s;
  g.beginPath(); g.moveTo(x - 60 * s, baseY); g.lineTo(x - 18 * s, baseY - 300 * s); g.lineTo(x + 18 * s, baseY - 300 * s); g.lineTo(x + 60 * s, baseY); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(x, baseY - 320 * s, 90 * s, 38 * s, 0, Math.PI, TAU); g.fill(); g.fillRect(x - 90 * s, baseY - 322 * s, 180 * s, 10 * s);
  g.restore();
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#05020f'); sky.addColorStop(0.6, '#1a1040'); sky.addColorStop(1, '#0a1a3a');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 350, 700, ['#fff', '#cfe0ff']);
  blob(g, w / 2, 200, 700, 'rgba(120,80,255,A)', 0.35);
  for (let i = 0; i < 4; i++) lightning(g, rnd(300, 1800), 0, rnd(200, 1900), rnd(300, 450), { disp: 160, depth: 7, color: i % 2 ? VIOLET : ARC, width: 3.5 });
  g.fillStyle = '#04060c'; g.beginPath(); g.moveTo(0, 850); g.quadraticCurveTo(w * 0.3, 760, w * 0.5, 800); g.quadraticCurveTo(w * 0.8, 840, w, 770); g.lineTo(w, 850); g.closePath(); g.fill();
  tower(g, 200, 840, 1.1);
  const [cx, cy] = teslaCoil(g, 1960, 840, 300, 1.4);
  for (let i = 0; i < 5; i++) lightning(g, cx, cy, cx + rnd(-260, 120), cy + rnd(-260, 120), { disp: 90, depth: 6, color: i % 2 ? VIOLET : ARC, width: 3 });
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 210px "Arial Black", Impact, sans-serif';
  g.shadowColor = ARC; g.shadowBlur = 44; g.fillStyle = chromeGrad(g, 60, 240, ['#ffffff', '#cfe8ff', '#5a7ab8', '#1a2a55', '#c8b8ff']);
  g.fillText('TESLA', w / 2, 150); g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = '#ffffff'; g.strokeText('TESLA', w / 2, 150);
  g.fillStyle = 'rgba(4,8,20,0.9)'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = COPPER; g.lineWidth = 4; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = ARC; g.shadowColor = ARC; g.shadowBlur = 12; g.font = '900 42px "Arial Black", Impact, sans-serif';
  g.fillText('HIGH VOLTAGE PINBALL  ·  1901', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#f0a060'); fr.addColorStop(0.5, '#c87533'); fr.addColorStop(1, '#5a2a10');
  displayWindow(g, fr, '#05010a');
  g.fillStyle = '#03050c'; g.fillRect(0, 850, w, 150); g.fillStyle = COPPER; g.fillRect(0, 846, w, 8);
  g.save(); g.fillStyle = ARC; g.font = '700 42px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('ALTERNATING CURRENT  ·  WIRELESS POWER  ·  WARDENCLYFFE', w / 2, 925); g.restore();
  return c;
}

function wall() {
  const { c, g } = wallCanvas('#24262e');
  for (let i = 0; i < 50; i++) { g.strokeStyle = `rgba(255,255,255,${rnd(0.02, 0.06)})`; g.beginPath(); const y = rnd(0, 256); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
  for (const y of [60, 196]) { const cg = g.createLinearGradient(0, y - 10, 0, y + 10); cg.addColorStop(0, '#5a2a10'); cg.addColorStop(0.5, '#f0a060'); cg.addColorStop(1, '#5a2a10'); g.fillStyle = cg; g.fillRect(0, y - 10, 512, 20); }
  for (let x = 20; x < 512; x += 64) for (const y of [60, 196]) { g.fillStyle = '#2a1408'; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill(); }
  return c;
}

export default {
  id: 'tesla', name: 'TESLA', t1: 'TESLA', t2: 'HIGH VOLTAGE', bonus: 'MEGAVOLT BONUS 1000',
  table, glass, wall,
  dm: { bg: '#05010a', off: '#1a0a2a', glow: 'rgba(170,120,255,0.30)', mid: '#a878ff', hi: '#efe4ff' },
  song: { style: 'electro', bpm: 128, roots: [52, 52, 48, 50], arp: [0, 12, 7, 12, 0, 12, 10, 12, 0, 12, 7, 12, 15, 12, 10, 7] },
  apron: { bg: '#060a1a', fg: '#9fd8ff', line: '#c87533', title: 'TESLA · HIGH VOLTAGE' },
  colors: {
    bg: 0x02050f, hemi: [0x9fc8ff, 0x0a0a1a, 0.45], sun: [0xdfe9ff, 1.4], warm: [0x8a5cff, 110],
    trim: { color: 0xc87533, metalness: 1, roughness: 0.3, emissive: 0x000000, ei: 0 },
    accent: { color: 0x2a6bff, emissive: 0x1030a0 }, cabinet: 0x0d0f16,
    dome: 0x9a6bff, domeEmissive: 0x7a4bff, bulb: 0xe0f0ff, bumperLight: 0x8a6bff,
    lamp: 0x6ad0ff, particles: [0xffffff, 0x8ad8ff, 0xa878ff], trail: 0x8ad8ff,
    bloom: [0.8, 0.5, 1.0], exposure: 1.05,
  },
};
