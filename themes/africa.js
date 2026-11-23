// Theme: SAFARI – African savanna at sunset (Serengeti)
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, guideZones, laneMarks, drainFade, signPanel, fitText, displayWindow,
  woodWall, goldGrad, blob, rnd } from '../art.js';

const SIL = '#1a0a04', OCHRE = '#ffc23a', RED = '#c8281c';

function acacia(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SIL; g.strokeStyle = SIL; g.lineCap = 'round';
  g.lineWidth = 9; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-4, -50, 6, -95); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.moveTo(3, -70); g.quadraticCurveTo(-30, -90, -55, -100); g.moveTo(5, -80); g.quadraticCurveTo(35, -95, 60, -102); g.stroke();
  g.beginPath(); g.ellipse(0, -108, 95, 16, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(-40, -104, 45, 12, 0, 0, TAU); g.ellipse(45, -106, 45, 11, 0, 0, TAU); g.fill();
  g.restore();
}
function giraffe(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SIL; g.strokeStyle = SIL; g.lineCap = 'round';
  g.beginPath(); g.ellipse(0, -60, 34, 18, -0.15, 0, TAU); g.fill();
  g.lineWidth = 6; for (const lx of [-24, -14, 16, 26]) { g.beginPath(); g.moveTo(lx, -52); g.lineTo(lx + (lx < 0 ? -2 : 2), 0); g.stroke(); }
  g.lineWidth = 11; g.beginPath(); g.moveTo(24, -66); g.lineTo(46, -140); g.stroke();
  g.beginPath(); g.ellipse(54, -146, 14, 7, 0.4, 0, TAU); g.fill();
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(44, -150); g.lineTo(42, -160); g.moveTo(49, -152); g.lineTo(48, -162); g.stroke();
  g.lineWidth = 2; g.beginPath(); g.moveTo(-32, -62); g.lineTo(-42, -40); g.stroke();
  g.restore();
}
function elephant(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SIL;
  g.beginPath(); g.ellipse(0, -55, 60, 38, 0, 0, TAU); g.fill();
  for (const lx of [-40, -18, 18, 38]) g.fillRect(lx - 9, -40, 18, 40);
  g.beginPath(); g.ellipse(58, -66, 26, 24, 0, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(46, -62, 20, 28, -0.3, 0, TAU); g.fill();
  g.lineWidth = 12; g.strokeStyle = SIL; g.lineCap = 'round'; g.beginPath(); g.moveTo(78, -60); g.quadraticCurveTo(92, -30, 84, -6); g.stroke();
  g.strokeStyle = '#f4e6c8'; g.lineWidth = 4; g.beginPath(); g.moveTo(74, -52); g.quadraticCurveTo(88, -44, 94, -50); g.stroke();
  g.restore();
}
function zebraStripes(g, x0, y0, w, h) {
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
  g.fillStyle = '#f4ead6'; g.fillRect(x0, y0, w, h); g.fillStyle = '#111';
  for (let i = -20; i < 40; i++) { g.beginPath(); const x = x0 + i * 34; g.moveTo(x, y0); g.bezierCurveTo(x + 30, y0 + h * 0.3, x - 20, y0 + h * 0.6, x + 25, y0 + h); g.lineTo(x + 40, y0 + h); g.bezierCurveTo(x - 5, y0 + h * 0.6, x + 45, y0 + h * 0.3, x + 16, y0); g.fill(); }
  g.restore();
}
function paw(g, x, y, r) {
  g.save(); g.fillStyle = SIL;
  g.beginPath(); g.ellipse(x, y + r * 0.25, r * 0.55, r * 0.45, 0, 0, TAU); g.fill();
  for (const [dx, dy] of [[-0.55, -0.35], [-0.2, -0.65], [0.2, -0.65], [0.55, -0.35]]) { g.beginPath(); g.ellipse(x + dx * r, y + dy * r, r * 0.18, r * 0.23, dx * 0.4, 0, TAU); g.fill(); }
  g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t, hz = Z(-9);
  const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#5a1030'); sky.addColorStop(0.45, '#d4401c'); sky.addColorStop(1, '#ffb43a');
  g.fillStyle = sky; g.fillRect(0, 0, w, hz);
  const sav = g.createLinearGradient(0, hz, 0, h); sav.addColorStop(0, '#c88a2a'); sav.addColorStop(0.4, '#a86a1c'); sav.addColorStop(1, '#4a2a0c');
  g.fillStyle = sav; g.fillRect(0, hz, w, h - hz);
  // sun at the horizon
  g.save(); g.beginPath(); g.rect(0, 0, w, hz); g.clip();
  const sg = g.createRadialGradient(X(0), hz, 10, X(0), hz, 5 * PX); sg.addColorStop(0, '#fff6c0'); sg.addColorStop(0.5, '#ffd040'); sg.addColorStop(1, '#ff7a1a');
  g.shadowColor = '#ffb040'; g.shadowBlur = 60; g.fillStyle = sg; g.beginPath(); g.arc(X(0), hz, 4.8 * PX, Math.PI, TAU); g.fill(); g.restore();
  // horizon silhouettes
  acacia(g, X(-6.8), hz + 4, 1.3); acacia(g, X(6.4), hz + 4, 1.0);
  giraffe(g, X(-3.6), hz + 2, 0.8); giraffe(g, X(-2.6), hz + 2, 0.6); elephant(g, X(3.1), hz + 2, 0.75);
  g.fillStyle = SIL; g.fillRect(0, hz, w, 6);
  // savanna grass
  for (let i = 0; i < 900; i++) {
    const x = rnd(0, w), y = rnd(hz + 10, h), l = rnd(8, 22);
    g.strokeStyle = `rgba(${rnd(80, 140) | 0},${rnd(50, 80) | 0},10,${rnd(0.2, 0.5)})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + rnd(-6, 6), y - l); g.stroke();
  }
  // birds
  g.strokeStyle = SIL; g.lineWidth = 3;
  for (const [x, z] of [[-4, -15.5], [-3.3, -16.1], [3.5, -14.8], [4.2, -15.4], [2.8, -16.2]]) { g.beginPath(); g.moveTo(X(x) - 12, Z(z)); g.quadraticCurveTo(X(x) - 5, Z(z) - 8, X(x), Z(z)); g.quadraticCurveTo(X(x) + 5, Z(z) - 8, X(x) + 12, Z(z)); g.stroke(); }
  // beaded arch rings (Maasai colours)
  const beads = (cx, cy, R, n, start = 0, end = TAU) => {
    const cols = [RED, '#ffffff', '#1a3ad0', OCHRE, '#2a8a2a', RED];
    for (let i = 0; i <= n; i++) { const a = start + (end - start) * i / n; g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 7, 0, TAU); g.fill(); }
  };
  beads(X(0), Z(-12), 9.2 * PX, 140, Math.PI, TAU);
  g.strokeStyle = OCHRE; g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.5 * PX, Math.PI, TAU); g.stroke();
  BUMPERS.forEach(b => beads(X(b.x), Z(b.z), (b.r + 0.85) * PX, 48));
  // zebra-striped sign
  const s = signPanel(t, '#f4ead6', SIL, null);
  zebraStripes(g, s.x0 + 6, s.y0 + 6, s.x1 - s.x0 - 12, s.y1 - s.y0 - 12);
  g.fillStyle = 'rgba(26,10,4,0.82)'; g.fillRect(s.x0 + 40, s.y0 + 22, s.x1 - s.x0 - 80, s.y1 - s.y0 - 44);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'SERENGETI', s.x1 - s.x0 - 160, 92);
  g.fillStyle = goldGrad(g, s.y0 + 25, s.y0 + 100); g.shadowColor = '#000'; g.shadowBlur = 10; g.fillText('SERENGETI', s.cx, s.y0 + 92);
  g.shadowBlur = 0; g.font = '700 26px "Trebuchet MS", sans-serif'; g.fillStyle = '#f4ead6';
  g.fillText('THE GREAT MIGRATION  ·  KENYA  ·  TANZANIA', s.cx, s.y0 + 126); g.restore();
  // paw roundel
  g.save(); g.fillStyle = 'rgba(255,210,120,0.35)'; g.beginPath(); g.arc(X(0), Z(9.4), 1.9 * PX, 0, TAU); g.fill();
  g.strokeStyle = SIL; g.lineWidth = 6; g.stroke(); g.restore();
  paw(g, X(0), Z(9.4), 1.35 * PX);
  // kente-style guide zones
  guideZones(t, RED, 'rgba(255,194,58,0.9)', 12);
  laneMarks(t, 'rgba(40,20,0,0.5)', OCHRE, RED);
  drainFade(t, '#100602');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, 780); sky.addColorStop(0, '#3a0a28'); sky.addColorStop(0.45, '#c8301c'); sky.addColorStop(0.8, '#ff9a2a'); sky.addColorStop(1, '#ffd060');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  blob(g, w / 2, 700, 700, 'rgba(255,200,80,A)', 0.5);
  const sg = g.createRadialGradient(w / 2, 700, 20, w / 2, 700, 330); sg.addColorStop(0, '#fff6c0'); sg.addColorStop(0.6, '#ffc030'); sg.addColorStop(1, '#ff6a10');
  g.fillStyle = sg; g.beginPath(); g.arc(w / 2, 700, 330, 0, TAU); g.fill();
  g.fillStyle = SIL; g.beginPath(); g.moveTo(0, 780); g.quadraticCurveTo(w * 0.25, 760, w * 0.5, 790); g.quadraticCurveTo(w * 0.75, 770, w, 785); g.lineTo(w, 850); g.lineTo(0, 850); g.closePath(); g.fill();
  acacia(g, 210, 790, 2.2); acacia(g, 1960, 790, 1.7);
  giraffe(g, 1640, 790, 1.5); giraffe(g, 1760, 790, 1.15); elephant(g, 470, 795, 1.3);
  g.strokeStyle = SIL; g.lineWidth = 4; for (let i = 0; i < 9; i++) { const x = rnd(700, 1500), y = rnd(380, 430); g.beginPath(); g.moveTo(x - 16, y); g.quadraticCurveTo(x - 6, y - 10, x, y); g.quadraticCurveTo(x + 6, y - 10, x + 16, y); g.stroke(); }
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 210px "Arial Black", Impact, sans-serif';
  g.lineWidth = 18; g.strokeStyle = SIL; g.lineJoin = 'round'; g.strokeText('SAFARI', w / 2, 150);
  g.fillStyle = goldGrad(g, 60, 240); g.shadowColor = '#000'; g.shadowBlur = 20; g.fillText('SAFARI', w / 2, 150); g.shadowBlur = 0;
  zebraStripes(g, 560, 262, 1020, 80);
  g.fillStyle = 'rgba(26,10,4,0.85)'; g.fillRect(600, 270, 940, 64);
  g.fillStyle = OCHRE; g.font = '900 42px "Arial Black", Impact, sans-serif'; g.fillText('SERENGETI  ·  THE GREAT MIGRATION', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#d08a3a'); fr.addColorStop(1, '#5a2a0a');
  displayWindow(g, fr, '#0a0600');
  g.fillStyle = '#1a0a04'; g.fillRect(0, 850, w, 150);
  const cols = [RED, '#ffffff', '#1a3ad0', OCHRE, '#2a8a2a']; for (let x = 0; x < w; x += 24) { g.fillStyle = cols[(x / 24) % cols.length]; g.fillRect(x, 846, 24, 10); }
  g.save(); g.fillStyle = OCHRE; g.font = '700 44px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('KENYA  ·  TANZANIA  ·  BOTSWANA  ·  NAMIBIA  ·  ZAMBIA', w / 2, 925); g.restore();
  return c;
}

export default {
  id: 'africa', name: 'SAFARI', t1: 'SAFARI', t2: 'SERENGETI', bonus: 'STAMPEDE BONUS 1000',
  table, glass, wall: () => woodWall('#7a4a22', 'rgba(40,18,4,A)', 4),
  dm: { bg: '#0a0600', off: '#2a1c04', glow: 'rgba(255,200,60,0.28)', mid: '#ffc23a', hi: '#fff2b0' },
  song: { style: 'afro', bpm: 112, roots: [57, 62, 60, 55], arp: [0, 4, 7, 9, 12, 9, 7, 4, 0, 2, 4, 7, 9, 7, 4, 2] },
  apron: { bg: '#3a1a0a', fg: '#ffc23a', line: '#c8281c', title: 'SAFARI · SERENGETI' },
  colors: {
    bg: 0x120604, hemi: [0xffd8a0, 0x402010, 0.6], sun: [0xffd0a0, 1.8], warm: [0xff8a30, 100],
    trim: { color: 0xb87333, metalness: 0.8, roughness: 0.4, emissive: 0x000000, ei: 0 },
    accent: { color: 0xc8281c, emissive: 0x400800 }, cabinet: 0x3a1a0a,
    dome: 0xffa020, domeEmissive: 0xff7a00, bulb: 0xfff0c0, bumperLight: 0xff9a30,
    lamp: 0xffc040, particles: [0xffd070, 0xff5a20], trail: 0xffb040,
    bloom: [0.5, 0.4, 1.15], exposure: 1.05,
  },
};
