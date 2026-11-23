// Theme: HALLOWEEN – haunted hollow, full moon, pumpkins and bats
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, starfield, guideZones, laneMarks, drainFade, signPanel, fitText,
  displayWindow, blob, woodWall, rnd } from '../art.js';

const ORANGE = '#ff7a1a', SLIME = '#6aff2a', PURPLE = '#7a2aff';
const SPOOKY = '"Chiller", "Creepster", "Herculanum", "Papyrus", Impact, fantasy';

function moon(g, x, y, r) {
  g.save(); g.shadowColor = '#fff2b0'; g.shadowBlur = r * 0.8;
  const mg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); mg.addColorStop(0, '#fffbe0'); mg.addColorStop(1, '#e8d890');
  g.fillStyle = mg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.restore();
  g.fillStyle = 'rgba(160,140,80,0.25)';
  for (const [dx, dy, rr] of [[-0.3, -0.1, 0.18], [0.25, 0.2, 0.12], [0.1, -0.35, 0.09], [-0.1, 0.35, 0.1]]) { g.beginPath(); g.arc(x + dx * r, y + dy * r, rr * r, 0, TAU); g.fill(); }
}
function bat(g, x, y, s, col = '#05020a') {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath();
  g.moveTo(0, 0); g.quadraticCurveTo(-10, -12, -22, -10); g.quadraticCurveTo(-28, -4, -40, -8); g.quadraticCurveTo(-34, 2, -36, 10);
  g.quadraticCurveTo(-24, 4, -18, 10); g.quadraticCurveTo(-10, 4, 0, 8); g.quadraticCurveTo(10, 4, 18, 10); g.quadraticCurveTo(24, 4, 36, 10);
  g.quadraticCurveTo(34, 2, 40, -8); g.quadraticCurveTo(28, -4, 22, -10); g.quadraticCurveTo(10, -12, 0, 0); g.fill();
  g.beginPath(); g.arc(0, -2, 5, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-4, -6); g.lineTo(-3, -11); g.lineTo(-1, -6); g.moveTo(4, -6); g.lineTo(3, -11); g.lineTo(1, -6); g.fill();
  g.restore();
}
function house(g, x, baseY, s, col = '#07030c') {
  g.save(); g.translate(x, baseY); g.scale(s, s); g.fillStyle = col;
  g.fillRect(-90, -110, 180, 110); g.beginPath(); g.moveTo(-105, -110); g.lineTo(0, -190); g.lineTo(105, -110); g.fill();
  g.fillRect(40, -230, 50, 130); g.beginPath(); g.moveTo(30, -230); g.lineTo(65, -290); g.lineTo(100, -230); g.fill();
  g.fillRect(-70, -170, 14, 50);
  g.fillStyle = '#ffb030'; g.shadowColor = '#ffb030'; g.shadowBlur = 14;
  for (const [wx, wy] of [[-60, -85], [-20, -85], [30, -85], [55, -190], [-10, -140]]) g.fillRect(wx, wy, 18, 24);
  g.fillStyle = '#ff7a1a'; g.fillRect(-12, -40, 24, 40);
  g.restore();
}
function tomb(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#2a2a36'; g.strokeStyle = '#4a4a5a'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-20, 0); g.lineTo(-20, -34); g.arc(0, -34, 20, Math.PI, TAU); g.lineTo(20, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#5a5a6a'; g.font = '700 12px Georgia, serif'; g.textAlign = 'center'; g.fillText('RIP', 0, -26); g.restore();
}
function tree(g, x, y, len, ang, w, depth) {
  if (depth === 0 || len < 6) return;
  const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
  g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(ex, ey); g.stroke();
  tree(g, ex, ey, len * rnd(0.62, 0.78), ang - rnd(0.25, 0.6), w * 0.68, depth - 1);
  tree(g, ex, ey, len * rnd(0.62, 0.78), ang + rnd(0.25, 0.6), w * 0.68, depth - 1);
}
function pumpkin(g, x, y, r, lit = true) {
  g.save();
  const pg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r * 1.1); pg.addColorStop(0, '#ffb04a'); pg.addColorStop(0.7, '#ff6a00'); pg.addColorStop(1, '#a03a00');
  g.fillStyle = pg; g.beginPath(); g.ellipse(x, y, r * 1.12, r, 0, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(120,40,0,0.55)'; g.lineWidth = r * 0.06;
  for (const k of [-0.6, -0.25, 0.25, 0.6]) { g.beginPath(); g.ellipse(x + k * r * 0.5, y, r * (1 - Math.abs(k) * 0.6) * 0.5, r * 0.98, 0, 0, TAU); g.stroke(); }
  g.fillStyle = '#3a6a1a'; g.fillRect(x - r * 0.08, y - r * 1.15, r * 0.16, r * 0.3);
  if (lit) {
    g.fillStyle = '#ffe14a'; g.shadowColor = '#ffb030'; g.shadowBlur = r * 0.5;
    for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(x + sx * r * 0.45, y - r * 0.35); g.lineTo(x + sx * r * 0.2, y - r * 0.05); g.lineTo(x + sx * r * 0.65, y - r * 0.05); g.closePath(); g.fill(); }
    g.beginPath(); g.moveTo(x - r * 0.12, y + r * 0.08); g.lineTo(x, y - r * 0.12); g.lineTo(x + r * 0.12, y + r * 0.08); g.fill();
    g.beginPath(); g.moveTo(x - r * 0.65, y + r * 0.25);
    for (let i = 0; i <= 8; i++) g.lineTo(x - r * 0.65 + i * r * 0.1625, y + r * (i % 2 ? 0.35 : 0.5));
    g.quadraticCurveTo(x, y + r * 0.85, x - r * 0.65, y + r * 0.25); g.fill();
  }
  g.restore();
}
function web(g, x, y, R, start, end) {
  g.save(); g.strokeStyle = 'rgba(220,220,240,0.35)'; g.lineWidth = 1.5;
  const spokes = 7;
  for (let i = 0; i <= spokes; i++) { const a = start + (end - start) * i / spokes; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); g.stroke(); }
  for (let r = R * 0.2; r <= R; r += R * 0.18) { g.beginPath(); for (let i = 0; i <= spokes; i++) { const a = start + (end - start) * i / spokes, rr = r * (i % 2 ? 0.93 : 1); g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.stroke(); }
  g.restore();
}

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t;
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1a0830'); bg.addColorStop(0.35, '#0e0618'); bg.addColorStop(0.7, '#08100a'); bg.addColorStop(1, '#030503');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  starfield(g, w, Z(-6), 160, Z(-8));
  // fog
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) blob(g, rnd(0, w), rnd(Z(-6), Z(16)), rnd(120, 260), 'rgba(90,120,100,A)', 0.08);
  blob(g, X(0), Z(-14), 7 * PX, 'rgba(255,230,150,A)', 0.18); g.restore();
  moon(g, X(0), Z(-14.6), 2.3 * PX);
  house(g, X(0), Z(-9.8), 0.85);
  for (const [x, z, s, r] of [[-5.5, -15.5, 0.9, 0.2], [4.5, -14.8, 0.7, -0.2], [-3, -16.3, 0.5, 0.1], [6.2, -12.6, 0.6, 0.3]]) bat(g, X(x), Z(z), s * 1.2);
  // bare trees + graves
  g.strokeStyle = '#07030a'; g.lineCap = 'round';
  tree(g, X(-8.6), Z(1.2), 2.6 * PX, -Math.PI / 2 + 0.15, 18, 7);
  tree(g, X(6.9), Z(-0.2), 2.3 * PX, -Math.PI / 2 - 0.1, 16, 7);
  for (const [x, z, s] of [[-7.6, 2.4, 1.3], [-6.2, 1.9, 1.0], [5.6, 2.2, 1.2], [6.9, 2.6, 0.9], [-8.6, -4.5, 0.9]]) tomb(g, X(x), Z(z), s);
  web(g, X(-9.4), Z(-11.6), 2.2 * PX, -Math.PI / 2, 0.15);
  // arch rings
  g.save(); g.strokeStyle = ORANGE; g.shadowColor = ORANGE; g.shadowBlur = 16; g.lineWidth = 6; g.setLineDash([26, 10]);
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke(); g.setLineDash([]);
  g.strokeStyle = PURPLE; g.shadowColor = PURPLE; g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * PX, Math.PI, TAU); g.stroke(); g.restore();
  BUMPERS.forEach(b => { g.save(); g.strokeStyle = ORANGE; g.shadowColor = ORANGE; g.shadowBlur = 20; g.lineWidth = 5; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke();
    g.strokeStyle = SLIME; g.shadowColor = SLIME; g.lineWidth = 2; g.setLineDash([4, 10]); g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.4) * PX, 0, TAU); g.stroke(); g.restore(); });
  // sign with slime drips
  const s = signPanel(t, '#160822', ORANGE, 'rgba(106,255,42,0.45)');
  g.save(); g.fillStyle = SLIME; g.shadowColor = SLIME; g.shadowBlur = 10;
  for (let x = s.x0 + 30; x < s.x1 - 20; x += rnd(40, 90)) { const len = rnd(14, 46); g.beginPath(); g.moveTo(x - 7, s.y1 - 4); g.lineTo(x - 4, s.y1 + len - 6); g.arc(x, s.y1 + len - 6, 5, Math.PI, 0, true); g.lineTo(x + 7, s.y1 - 4); g.fill(); }
  g.restore();
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'HAUNTED HOLLOW', s.x1 - s.x0 - 90, 96, SPOOKY);
  g.shadowColor = ORANGE; g.shadowBlur = 24; g.fillStyle = '#ffb04a'; g.fillText('HAUNTED HOLLOW', s.cx, s.y0 + 94);
  g.font = '700 28px Georgia, serif'; g.fillStyle = SLIME; g.shadowColor = SLIME; g.shadowBlur = 8;
  g.fillText('TRICK OR TREAT  ·  OCTOBER 31  ·  ENTER IF YOU DARE', s.cx, s.y0 + 132); g.restore();
  pumpkin(g, X(0), Z(9.4), 1.6 * PX);
  guideZones(t, '#14061e', 'rgba(255,122,26,0.75)', 10);
  laneMarks(t, 'rgba(0,0,0,0.55)', ORANGE, SLIME);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#0a0418'); sky.addColorStop(0.55, '#3a1050'); sky.addColorStop(0.85, '#c04a1a'); sky.addColorStop(1, '#ff7a1a');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  starfield(g, w, h, 250, 450);
  moon(g, 1840, 400, 150);
  for (let i = 0; i < 14; i++) bat(g, rnd(1500, 2100), rnd(220, 560), rnd(0.7, 1.4));
  for (let i = 0; i < 6; i++) bat(g, rnd(40, 380), rnd(380, 560), rnd(0.6, 1.1));
  // hill with house, trees, graves, pumpkins
  g.fillStyle = '#07030c'; g.beginPath(); g.moveTo(0, 850); g.quadraticCurveTo(250, 640, 480, 760); g.quadraticCurveTo(w / 2, 840, 1700, 780); g.quadraticCurveTo(1950, 720, w, 800); g.lineTo(w, 850); g.closePath(); g.fill();
  house(g, 220, 720, 1.0);
  g.strokeStyle = '#07030c'; g.lineCap = 'round'; tree(g, 1950, 790, 140, -Math.PI / 2 - 0.15, 22, 8);
  for (const [x, y, sc] of [[1650, 800, 1.6], [1760, 805, 1.3], [520, 790, 1.4]]) tomb(g, x, y, sc);
  for (const [x, r] of [[80, 46], [380, 38], [1600, 40], [2060, 52]]) pumpkin(g, x, 820, r);
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle';
  fitText(g, 'HALLOWEEN', 1400, 220, SPOOKY);
  g.lineWidth = 14; g.strokeStyle = '#1a0420'; g.lineJoin = 'round'; g.strokeText('HALLOWEEN', w / 2, 150);
  const tg = g.createLinearGradient(0, 60, 0, 240); tg.addColorStop(0, '#ffe14a'); tg.addColorStop(0.5, '#ff7a1a'); tg.addColorStop(1, '#a02a00');
  g.shadowColor = SLIME; g.shadowBlur = 30; g.fillStyle = tg; g.fillText('HALLOWEEN', w / 2, 150); g.shadowBlur = 0;
  g.fillStyle = '#160822'; g.fillRect(560, 262, 1020, 80); g.strokeStyle = ORANGE; g.lineWidth = 4; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = SLIME; g.shadowColor = SLIME; g.shadowBlur = 12; g.font = '900 42px Georgia, serif';
  g.fillText('HAUNTED HOLLOW  ·  TRICK OR TREAT', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#ff9a3a'); fr.addColorStop(1, '#5a1a6a');
  displayWindow(g, fr, '#020a02');
  g.fillStyle = '#07030c'; g.fillRect(0, 850, w, 150); g.fillStyle = ORANGE; g.fillRect(0, 846, w, 8);
  g.save(); g.fillStyle = '#ffb04a'; g.font = '700 44px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('GHOSTS  ·  GHOULS  ·  GOBLINS  ·  JACK-O\'-LANTERNS', w / 2, 925); g.restore();
  return c;
}

export default {
  id: 'halloween', name: 'HALLOWEEN', t1: 'HALLOWEEN', t2: 'TRICK OR TREAT', bonus: 'GHOST BONUS 1000',
  table, glass, wall: () => woodWall('#2a1a2e', 'rgba(8,0,12,A)', 5),
  dm: { bg: '#020a02', off: '#0a240a', glow: 'rgba(120,255,60,0.28)', mid: '#6aff2a', hi: '#e0ffc0' },
  song: { style: 'spooky', bpm: 92, roots: [57, 58, 57, 51], arp: [0, 3, 7, 12, 7, 3, 6, 3, 0, 3, 7, 12, 15, 12, 7, 6] },
  apron: { bg: '#14061e', fg: '#ff8a2a', line: '#6aff2a', title: 'HAUNTED HOLLOW · OCT 31' },
  colors: {
    bg: 0x05020a, hemi: [0xb090ff, 0x102010, 0.45], sun: [0xc8c0ff, 1.2], warm: [0xff7a1a, 140],
    trim: { color: 0x8a6a3a, metalness: 0.9, roughness: 0.45, emissive: 0x000000, ei: 0 },
    accent: { color: 0x4ad02a, emissive: 0x0a4000 }, cabinet: 0x1a0a22,
    dome: 0xff7a1a, domeEmissive: 0xff5a00, bulb: 0xfff07a, bumperLight: 0xff7a1a,
    lamp: 0x8aff3a, particles: [0xff7a1a, 0x8aff3a, 0xa05aff], trail: 0x9a5aff,
    bloom: [0.6, 0.45, 1.05], exposure: 1.05,
  },
};
