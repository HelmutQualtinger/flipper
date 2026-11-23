// Theme: PIRATE COVE – treasure map
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, starfield, guideZones, laneMarks, drainFade, signPanel, fitText,
  displayWindow, palm, wavyLine, goldGrad, woodWall, rnd, star } from '../art.js';

const INK = '#4a2a10', RED = '#a01818';

function compass(g, x, y, R) {
  g.save(); g.translate(x, y);
  g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, R * 1.05, 0, TAU); g.stroke();
  g.beginPath(); g.arc(0, 0, R * 0.92, 0, TAU); g.stroke();
  for (let i = 0; i < 8; i++) {
    const long = i % 2 === 0, a = i * Math.PI / 4, r = long ? R : R * 0.6;
    for (const side of [-1, 1]) {
      g.fillStyle = side < 0 ? (long ? RED : '#c8a060') : (long ? '#e9d3a1' : INK);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      g.lineTo(Math.cos(a + side * 0.28) * r * 0.25, Math.sin(a + side * 0.28) * r * 0.25); g.closePath(); g.fill();
      g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke();
    }
  }
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `900 ${R * 0.32}px Georgia, serif`;
  [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([l, dx, dy]) => g.fillText(l, dx * R * 1.25, dy * R * 1.25));
  g.restore();
}
function skull(g, x, y, s, col = '#f4ead0') {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
  g.lineWidth = 9; g.beginPath(); g.moveTo(-34, -6); g.lineTo(34, 46); g.moveTo(34, -6); g.lineTo(-34, 46); g.stroke();
  g.beginPath(); g.arc(0, -8, 26, 0, TAU); g.fill(); g.fillRect(-14, 10, 28, 14);
  g.fillStyle = '#111'; g.beginPath(); g.arc(-9, -8, 7, 0, TAU); g.arc(9, -8, 7, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-4, 8); g.lineTo(4, 8); g.fill(); g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h } = t;
  const pg = g.createLinearGradient(0, 0, 0, h); pg.addColorStop(0, '#ead5a3'); pg.addColorStop(0.5, '#dfc085'); pg.addColorStop(1, '#c9a462');
  g.fillStyle = pg; g.fillRect(0, 0, w, h);
  // sea tint + coffee stains
  g.fillStyle = 'rgba(40,110,130,0.22)'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 14; i++) { g.strokeStyle = `rgba(110,70,20,${rnd(0.05, 0.14)})`; g.lineWidth = rnd(4, 12); g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(30, 120), 0, TAU); g.stroke(); }
  for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(120,80,30,${rnd(0.03, 0.08)})`; g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(20, 90), 0, TAU); g.fill(); }
  // map grid
  g.strokeStyle = 'rgba(74,42,16,0.12)'; g.lineWidth = 2;
  for (let x = 0; x <= w; x += 100) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y <= h; y += 100) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  // island under the bumpers
  const pts = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, r = 6.2 + Math.sin(a * 3) * 0.7 + Math.sin(a * 7 + 1) * 0.35; pts.push([X(-0.3 + Math.cos(a) * r * 1.05), Z(-5.2 + Math.sin(a) * r * 0.8)]); }
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.closePath();
  g.fillStyle = 'rgba(240,215,150,0.95)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  g.save(); g.clip(); g.strokeStyle = 'rgba(74,42,16,0.18)'; g.lineWidth = 2;
  for (let k = -60; k < 60; k++) { g.beginPath(); g.moveTo(k * 20, 0); g.lineTo(k * 20 + 400, 800); g.stroke(); } g.restore();
  g.strokeStyle = 'rgba(74,42,16,0.35)'; g.lineWidth = 2; g.setLineDash([6, 8]);
  g.beginPath(); pts.forEach(([x, y], i) => { const dx = x - X(-0.3), dy = y - Z(-5.2); g[i ? 'lineTo' : 'moveTo'](X(-0.3) + dx * 1.12, Z(-5.2) + dy * 1.12); }); g.closePath(); g.stroke(); g.setLineDash([]);
  palm(g, X(-6.8), Z(-6.5), X(-6.2), Z(-9.2), 1.4 * 50, 8, INK, '#2f5a2a', INK);
  palm(g, X(6.4), Z(-1.6), X(6.9), Z(-4.4), 1.3 * 50, 8, INK, '#2f5a2a', INK);
  // sea waves
  g.strokeStyle = 'rgba(30,80,100,0.45)'; g.lineWidth = 3;
  for (let i = 0; i < 45; i++) { const x = rnd(40, w - 120), y = rnd(Z(2), Z(16)); wavyLine(g, x, x + 60, y, 5, 0.2, 0, 6); }
  for (let i = 0; i < 12; i++) { const x = rnd(40, w - 120), y = rnd(0, Z(-12)); wavyLine(g, x, x + 60, y, 5, 0.2, 0, 6); }
  // compass in the arch + rope rings
  g.strokeStyle = INK; g.lineWidth = 5; g.setLineDash([22, 8]); g.beginPath(); g.arc(X(0), Z(-12), 9.2 * 50, Math.PI, TAU); g.stroke();
  g.setLineDash([]); g.lineWidth = 2; g.beginPath(); g.arc(X(0), Z(-12), 8.5 * 50, Math.PI, TAU); g.stroke();
  compass(g, X(0), Z(-15.2), 1.9 * 50);
  BUMPERS.forEach(b => { g.strokeStyle = INK; g.lineWidth = 4; g.setLineDash([16, 8]); g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * 50, 0, TAU); g.stroke(); g.setLineDash([]); });
  // treasure path to the X
  g.strokeStyle = RED; g.lineWidth = 7; g.setLineDash([4, 16]); g.lineCap = 'round';
  g.beginPath(); g.moveTo(X(-2.5), Z(0.8)); g.bezierCurveTo(X(-7), Z(3), X(4), Z(5.5), X(-0.8), Z(7.6)); g.stroke(); g.setLineDash([]);
  // wooden sign
  const s = signPanel(t, '#6a4220', '#2a170a', 'rgba(255,220,150,0.25)');
  g.strokeStyle = 'rgba(30,15,5,0.35)'; g.lineWidth = 2; for (let y = s.y0 + 14; y < s.y1; y += 16) { g.beginPath(); g.moveTo(s.x0, y); g.lineTo(s.x1, y + rnd(-3, 3)); g.stroke(); }
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'TREASURE ISLAND', s.x1 - s.x0 - 90, 84, 'Georgia, "Times New Roman", serif', '900');
  g.lineWidth = 8; g.strokeStyle = '#1a0c04'; g.lineJoin = 'round'; g.strokeText('TREASURE ISLAND', s.cx, s.y0 + 90);
  g.fillStyle = goldGrad(g, s.y0 + 25, s.y0 + 95); g.fillText('TREASURE ISLAND', s.cx, s.y0 + 90);
  g.font = 'italic 700 28px Georgia, serif'; g.fillStyle = '#f4e2b8'; g.fillText('Here be dragons  ·  Anno 1721  ·  X marks the spot', s.cx, s.y0 + 132); g.restore();
  // big red X
  g.save(); g.strokeStyle = RED; g.lineWidth = 26; g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 8;
  const r = 1.5 * 50; g.beginPath(); g.moveTo(X(0) - r, Z(9.4) - r); g.lineTo(X(0) + r, Z(9.4) + r); g.moveTo(X(0) + r, Z(9.4) - r); g.lineTo(X(0) - r, Z(9.4) + r); g.stroke(); g.restore();
  guideZones(t, '#3a2412', '#5a3a1c', 18);
  laneMarks(t, 'rgba(40,20,5,0.55)', INK, RED);
  // burnt edges
  const v = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, h * 0.62); v.addColorStop(0, 'rgba(60,30,5,0)'); v.addColorStop(1, 'rgba(60,30,5,0.55)');
  g.fillStyle = v; g.fillRect(0, 0, w, h);
  drainFade(t, '#120802');
  return t.c;
}

function ship(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#1a0e06';
  g.beginPath(); g.moveTo(-150, 0); g.lineTo(150, 0); g.lineTo(115, 55); g.lineTo(-120, 55); g.closePath(); g.fill();
  g.fillRect(-150, -30, 60, 32);
  g.fillStyle = '#2a1608'; g.fillRect(-4, -260, 8, 262); g.fillRect(-84, -210, 7, 212); g.fillRect(70, -190, 7, 192);
  g.fillStyle = '#f0e2c0';
  for (const [mx, top, wdt, hh] of [[0, -245, 110, 90], [0, -145, 130, 100], [-80, -195, 80, 70], [-80, -115, 95, 85], [73, -175, 80, 70], [73, -95, 90, 75]]) {
    g.beginPath(); g.moveTo(mx - wdt / 2, top); g.quadraticCurveTo(mx, top + 15, mx + wdt / 2, top); g.lineTo(mx + wdt / 2 + 6, top + hh); g.quadraticCurveTo(mx, top + hh + 22, mx - wdt / 2 - 6, top + hh); g.closePath(); g.fill();
  }
  g.fillStyle = '#111'; g.fillRect(4, -262, 52, 34); skull(g, 30, -248, 0.3);
  g.restore();
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, '#05081a'); sky.addColorStop(0.6, '#1d2b4f'); sky.addColorStop(1, '#3a4f78');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 300, 600);
  g.save(); g.shadowColor = '#fff6d0'; g.shadowBlur = 80; g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(1880, 520, 95, 0, TAU); g.fill(); g.restore();
  const sea = g.createLinearGradient(0, 700, 0, 850); sea.addColorStop(0, '#16324a'); sea.addColorStop(1, '#061420');
  g.fillStyle = sea; g.fillRect(0, 700, w, 150);
  g.strokeStyle = 'rgba(255,246,216,0.35)'; g.lineWidth = 3; for (let k = 0; k < 6; k++) wavyLine(g, 0, w, 715 + k * 22, 5, 0.02, k);
  g.fillStyle = 'rgba(255,246,216,0.4)'; for (let k = 0; k < 8; k++) g.fillRect(1880 - 60 + rnd(-20, 20), 712 + k * 16, 120 - k * 10, 4);
  ship(g, 200, 760, 1.05);
  palm(g, 1990, 850, 2050, 580, 150, 20, '#0a0604', '#0a0604', null);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.font = '900 200px Georgia, "Times New Roman", serif';
  g.lineWidth = 22; g.strokeStyle = '#1a0c04'; g.strokeText('PIRATE COVE', w / 2, 150);
  g.fillStyle = goldGrad(g, 70, 230); g.shadowColor = '#000'; g.shadowBlur = 20; g.fillText('PIRATE COVE', w / 2, 150); g.shadowBlur = 0;
  g.fillStyle = '#e9d3a1'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = '#4a2a10'; g.lineWidth = 5; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = '#4a1a08'; g.font = 'italic 900 44px Georgia, serif'; g.fillText('Yo Ho Ho  ·  Treasure Pinball', w / 2, 304);
  skull(g, 470, 300, 0.9); skull(g, 1670, 300, 0.9); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#8a5a2a'); fr.addColorStop(1, '#3a2010');
  displayWindow(g, fr, '#0a0500');
  g.fillStyle = '#1a0e06'; g.fillRect(0, 850, w, 150); g.fillStyle = goldGrad(g, 846, 856); g.fillRect(0, 846, w, 10);
  g.save(); g.fillStyle = '#f4c542'; g.font = 'italic 700 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('Tortuga  ·  Port Royal  ·  Nassau  ·  Skull Island', w / 2, 925);
  g.fillStyle = '#f4c542'; star(g, 300, 925, 22, 9); g.fill(); star(g, 1840, 925, 22, 9); g.fill(); g.restore();
  return c;
}

export default {
  id: 'pirate', name: 'PIRATE COVE', t1: 'PIRATE COVE', t2: 'YO HO HO!', bonus: 'TREASURE BONUS 1000',
  table, glass, wall: () => woodWall('#5a3a1e', 'rgba(25,12,4,A)', 6),
  dm: { bg: '#0a0500', off: '#2a1a04', glow: 'rgba(255,190,40,0.28)', mid: '#ffb21a', hi: '#fff0a0' },
  song: { style: 'shanty', bpm: 132, steps: 12, roots: [50, 55, 57, 50], minor: [1, 1, 0, 1], arp: [0, 7, 3, 7, 12, 7, 0, 7, 3, 7, 12, 15] },
  apron: { bg: '#2a170a', fg: '#f4c542', line: '#a01818', title: 'PIRATE COVE · ANNO 1721' },
  colors: {
    bg: 0x07080f, hemi: [0xffe0b0, 0x2a1a0a, 0.55], sun: [0xffe6c0, 1.6], warm: [0xffaa55, 80],
    trim: { color: 0xc9952e, metalness: 1, roughness: 0.35, emissive: 0x000000, ei: 0 },
    accent: { color: 0x8b1a1a, emissive: 0x2a0505 }, cabinet: 0x2a170a,
    dome: 0xffc533, domeEmissive: 0xffa000, bulb: 0xfff3c0, bumperLight: 0xffb040,
    lamp: 0xffcc55, particles: [0xffd700, 0xfff3c0], trail: 0xffc040,
    bloom: [0.45, 0.4, 1.2], exposure: 1.05,
  },
};
