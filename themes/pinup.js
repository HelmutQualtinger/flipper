// Theme: PIN-UP – 1950s diner, cherry red & mint, original retro pin-up girl on the backglass
import { TAU, BUMPERS } from '../layout.js';
import { tableCanvas, glassCanvas, guideZones, laneMarks, drainFade, signPanel, fitText, displayWindow,
  chromeGrad, star, blob, rnd } from '../art.js';

const CHERRY = '#d0102a', MINT = '#6ee0c8', CREAM = '#fff3e0', INK = '#2a0a10', SKIN = '#f8cdb0', SKIN_D = '#e6a888';
const SCRIPT = '"Brush Script MT", "Snell Roundhand", "Segoe Script", cursive';

// limb as tapered capsule chain (outline + fill)
function limb(g, pts, w0, w1, fill = SKIN) {
  for (const [col, extra] of [[INK, 5], [fill, 0]]) {
    g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 0; i < pts.length - 1; i++) {
      const t = i / (pts.length - 1); g.lineWidth = w0 + (w1 - w0) * t + extra;
      g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
    }
  }
}
function shoe(g, x, y, dir = 1) {
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.fillStyle = CHERRY; g.strokeStyle = INK; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-14, -14); g.quadraticCurveTo(10, -20, 34, -6); g.quadraticCurveTo(38, 2, 30, 4); g.lineTo(-6, 2); g.lineTo(-12, 22); g.lineTo(-18, 22); g.lineTo(-18, 0); g.closePath(); g.fill(); g.stroke();
  g.restore();
}

// Original retro pin-up girl, feet at (0,0), ~900 px tall at scale 1
export function pinupGirl(g, x, y, s = 1, flip = false) {
  g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); g.lineJoin = 'round';
  // legs (one straight, one bent in front) + shoes
  limb(g, [[-28, -360], [-30, -200], [-22, -34]], 50, 24);
  limb(g, [[28, -360], [46, -205], [6, -40]], 50, 24);
  shoe(g, -22, -24, -1); shoe(g, 8, -30, 1);
  // back arm: hand on hip
  limb(g, [[-58, -668], [-106, -588], [-66, -522]], 30, 22);
  // dress (halter bodice + flared skirt)
  const dress = new Path2D();
  dress.moveTo(-18, -700); dress.lineTo(18, -700);
  dress.bezierCurveTo(58, -690, 70, -640, 56, -606);           // right bust
  dress.bezierCurveTo(44, -585, 38, -572, 38, -556);            // waist
  dress.bezierCurveTo(62, -530, 86, -490, 96, -450);            // hip
  dress.bezierCurveTo(130, -400, 150, -350, 160, -330);         // skirt flare
  dress.quadraticCurveTo(120, -340, 100, -318); dress.quadraticCurveTo(70, -346, 40, -322);
  dress.quadraticCurveTo(10, -348, -20, -324); dress.quadraticCurveTo(-50, -348, -80, -326);
  dress.quadraticCurveTo(-110, -346, -138, -332);
  dress.bezierCurveTo(-122, -380, -96, -430, -86, -456);
  dress.bezierCurveTo(-76, -500, -50, -536, -38, -556);
  dress.bezierCurveTo(-38, -574, -46, -590, -56, -606);
  dress.bezierCurveTo(-70, -640, -58, -690, -18, -700); dress.closePath();
  g.fillStyle = CHERRY; g.fill(dress);
  g.save(); g.clip(dress); g.fillStyle = CREAM;
  for (let yy = -720, r = 0; yy < -300; yy += 34, r++) for (let xx = -180 + (r % 2) * 17; xx < 180; xx += 34) { g.beginPath(); g.arc(xx, yy, 7, 0, TAU); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.ellipse(-10, -330, 140, 40, 0, 0, TAU); g.fill();
  g.restore();
  g.strokeStyle = INK; g.lineWidth = 4; g.stroke(dress);
  // bust shading + white belt
  g.strokeStyle = 'rgba(80,0,10,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -618); g.quadraticCurveTo(0, -596, 40, -618); g.stroke();
  g.fillStyle = CREAM; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -566); g.quadraticCurveTo(0, -556, 40, -566); g.lineTo(40, -548); g.quadraticCurveTo(0, -538, -40, -548); g.closePath(); g.fill(); g.stroke();
  // neck, shoulders (halter shows shoulders)
  g.fillStyle = SKIN; g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.moveTo(-15, -730); g.lineTo(-15, -700); g.quadraticCurveTo(-50, -700, -62, -676); g.quadraticCurveTo(-40, -690, -18, -688);
  g.lineTo(18, -688); g.quadraticCurveTo(40, -690, 62, -676); g.quadraticCurveTo(50, -700, 15, -700); g.lineTo(15, -730); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = CHERRY; g.lineWidth = 9; g.beginPath(); g.moveTo(-22, -690); g.lineTo(-6, -722); g.moveTo(22, -690); g.lineTo(6, -722); g.stroke();
  // raised front arm (hand behind head)
  limb(g, [[56, -672], [118, -748], [52, -826]], 30, 22);
  // hair back mass
  g.fillStyle = '#5a1a10'; g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.ellipse(0, -790, 70, 74, 0, 0, TAU); g.fill(); g.stroke();
  for (const [cx, cy, r] of [[-56, -736, 26], [56, -736, 26]]) { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); g.stroke(); }
  // face
  g.fillStyle = SKIN; g.beginPath(); g.ellipse(0, -770, 46, 58, 0, 0, TAU); g.fill(); g.stroke();
  // victory rolls + bandana
  g.fillStyle = '#6a2214';
  for (const cx of [-34, 34]) { g.beginPath(); g.arc(cx, -838, 30, 0, TAU); g.fill(); g.stroke(); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.arc(cx, -838, 16, 0.4, 5.2); g.stroke(); g.strokeStyle = INK; }
  g.fillStyle = CHERRY; g.beginPath(); g.moveTo(-58, -812); g.quadraticCurveTo(0, -846, 58, -812); g.lineTo(52, -800); g.quadraticCurveTo(0, -830, -52, -800); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(58, -836, 22, 12, -0.6, 0, TAU); g.ellipse(76, -820, 20, 11, 0.5, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = CREAM; for (const [dx, dy] of [[-30, -818], [0, -826], [30, -818], [60, -836], [76, -820]]) { g.beginPath(); g.arc(dx, dy, 3.5, 0, TAU); g.fill(); }
  // bangs curl
  g.fillStyle = '#6a2214'; g.beginPath(); g.moveTo(-40, -800); g.quadraticCurveTo(-10, -812, 10, -796); g.quadraticCurveTo(-14, -786, -40, -800); g.fill();
  // eyes: wink (left) + open eye with lashes (right)
  g.strokeStyle = INK; g.lineWidth = 3.5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-30, -776); g.quadraticCurveTo(-18, -768, -6, -776); g.stroke();
  for (const k of [0, 1, 2]) { g.beginPath(); g.moveTo(-28 + k * 9, -774); g.lineTo(-31 + k * 9, -766); g.stroke(); }
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(19, -778, 11, 8, 0, 0, TAU); g.fill(); g.stroke();
  g.fillStyle = '#2a5a8a'; g.beginPath(); g.arc(20, -778, 5.5, 0, TAU); g.fill(); g.fillStyle = INK; g.beginPath(); g.arc(20, -778, 2.6, 0, TAU); g.fill();
  for (const k of [0, 1, 2]) { g.beginPath(); g.moveTo(14 + k * 7, -785); g.lineTo(12 + k * 9, -793); g.stroke(); }
  g.lineWidth = 3; g.beginPath(); g.moveTo(-32, -790); g.quadraticCurveTo(-18, -797, -6, -792); g.moveTo(8, -792); g.quadraticCurveTo(20, -798, 32, -790); g.stroke();
  // nose, blush, lips, beauty mark
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(2, -770); g.quadraticCurveTo(-3, -752, 4, -750); g.stroke();
  g.fillStyle = 'rgba(255,110,120,0.35)'; g.beginPath(); g.ellipse(-26, -752, 11, 6, 0, 0, TAU); g.ellipse(28, -752, 11, 6, 0, 0, TAU); g.fill();
  g.fillStyle = CHERRY; g.beginPath(); g.moveTo(-14, -734); g.quadraticCurveTo(-7, -743, 0, -738); g.quadraticCurveTo(7, -743, 14, -734); g.quadraticCurveTo(0, -722, -14, -734); g.fill();
  g.fillStyle = INK; g.beginPath(); g.arc(22, -740, 2.2, 0, TAU); g.fill();
  g.restore();
}

function lips(g, x, y, r) {
  g.save(); g.translate(x, y);
  const lg = g.createLinearGradient(0, -r, 0, r); lg.addColorStop(0, '#ff3a5a'); lg.addColorStop(1, '#a00818');
  g.fillStyle = lg; g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 10;
  g.beginPath(); g.moveTo(-r, 0); g.bezierCurveTo(-r * 0.7, -r * 0.55, -r * 0.25, -r * 0.6, 0, -r * 0.3); g.bezierCurveTo(r * 0.25, -r * 0.6, r * 0.7, -r * 0.55, r, 0);
  g.bezierCurveTo(r * 0.6, r * 0.1, r * 0.3, r * 0.06, 0, r * 0.08); g.bezierCurveTo(-r * 0.3, r * 0.06, -r * 0.6, r * 0.1, -r, 0); g.fill();
  g.beginPath(); g.moveTo(-r, 0); g.bezierCurveTo(-r * 0.6, r * 0.18, -r * 0.3, r * 0.14, 0, r * 0.14); g.bezierCurveTo(r * 0.3, r * 0.14, r * 0.6, r * 0.18, r, 0);
  g.bezierCurveTo(r * 0.6, r * 0.65, -r * 0.6, r * 0.65, -r, 0); g.fill();
  g.shadowBlur = 0; g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.ellipse(-r * 0.3, r * 0.32, r * 0.18, r * 0.06, 0, 0, TAU); g.fill();
  g.restore();
}
function atom(g, x, y, R, col) { star(g, x, y, R, R * 0.18, 4, 0); g.fillStyle = col; g.fill(); star(g, x, y, R * 0.6, R * 0.12, 4, Math.PI / 4); g.fill(); }

function table() {
  const t = tableCanvas(), { g, X, Z, w, h, PX } = t;
  // mint top, cream middle, checkerboard diner floor bottom
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#2a8a7a'); bg.addColorStop(0.3, MINT); bg.addColorStop(0.31, '#f0dcc4'); bg.addColorStop(1, '#e2c8a8');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(208,16,42,0.12)';
  for (let y = Z(-6.4), r = 0; y < Z(6.5); y += 46, r++) for (let x = (r % 2) * 23; x < w; x += 46) { g.beginPath(); g.arc(x, y, 9, 0, TAU); g.fill(); }
  g.save(); g.beginPath(); g.rect(0, Z(6.5), w, h); g.clip();
  const cs = 50; for (let r = 0, yy = Z(6.5); yy < h; yy += cs, r++) for (let k = 0, xx = 0; xx < w; xx += cs, k++) { g.fillStyle = (r + k) % 2 ? '#1a1a1a' : '#e8e4dc'; g.fillRect(xx, yy, cs, cs); }
  g.restore();
  for (let i = 0; i < 14; i++) atom(g, rnd(30, w - 30), rnd(Z(-17), Z(-7)), rnd(14, 30), i % 2 ? '#fff' : CHERRY);
  // arch: chrome + cherry rings, neon script
  g.save(); g.strokeStyle = CHERRY; g.lineWidth = 8; g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([18, 12]); g.beginPath(); g.arc(X(0), Z(-12), 8.5 * PX, Math.PI, TAU); g.stroke(); g.setLineDash([]);
  g.font = `italic 700 120px ${SCRIPT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#ff4a9a'; g.shadowBlur = 24; g.fillStyle = '#fff'; g.fillText('Sweetheart', X(0), Z(-15.4)); g.restore();
  BUMPERS.forEach(b => { g.save(); g.lineWidth = 10; for (let k = 0; k < 16; k++) { g.strokeStyle = k % 2 ? '#fff' : CHERRY; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.85) * PX, k * TAU / 16, (k + 1) * TAU / 16); g.stroke(); } g.restore(); });
  // diner sign
  const s = signPanel(t, CHERRY, '#e8eef4', '#fff');
  g.save(); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  fitText(g, 'Sweetheart Diner', s.x1 - s.x0 - 100, 100, SCRIPT, 'italic 700');
  g.fillStyle = '#fff'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 8; g.fillText('Sweetheart Diner', s.cx, s.y0 + 92);
  g.shadowBlur = 0; g.font = '700 26px "Trebuchet MS", sans-serif'; g.fillStyle = CREAM;
  g.fillText('ROUTE 66  ·  OPEN 24 HOURS  ·  MILKSHAKES & JUKEBOX', s.cx, s.y0 + 130); g.restore();
  lips(g, X(0), Z(9.5), 1.7 * PX);
  guideZones(t, CHERRY, '#ffffff', 16);
  laneMarks(t, 'rgba(0,0,0,0.35)', CHERRY, CHERRY);
  drainFade(t, '#000');
  return t.c;
}

function glass() {
  const { c, g, w, h } = glassCanvas();
  const bg = g.createRadialGradient(w / 2, 420, 100, w / 2, 420, 1300); bg.addColorStop(0, '#ff8fb0'); bg.addColorStop(0.5, '#d01848'); bg.addColorStop(1, '#4a0418');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.save(); g.translate(w / 2, 420);
  for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1500, i * TAU / 40, (i + 1) * TAU / 40); g.fill(); }
  g.restore();
  g.fillStyle = 'rgba(255,255,255,0.12)'; for (let y = 20, r = 0; y < h; y += 60, r++) for (let x = (r % 2) * 30; x < w; x += 60) { g.beginPath(); g.arc(x, y, 9, 0, TAU); g.fill(); }
  for (let i = 0; i < 10; i++) atom(g, rnd(420, 1720), rnd(360, 420) * (i % 2 ? 1 : 0.2) + 20, rnd(18, 34), '#fff');
  // the pin-up girl on the left, a jukebox-style heart on the right
  blob(g, 200, 600, 300, 'rgba(255,240,200,A)', 0.5);
  pinupGirl(g, 205, 990, 1.05);
  g.save(); g.translate(1950, 640); g.rotate(0.15);
  g.fillStyle = CHERRY; g.strokeStyle = '#fff'; g.lineWidth = 10; g.shadowColor = '#000'; g.shadowBlur = 20;
  g.beginPath(); g.moveTo(0, 120); g.bezierCurveTo(-200, 0, -120, -170, 0, -70); g.bezierCurveTo(120, -170, 200, 0, 0, 120); g.fill(); g.stroke();
  g.shadowBlur = 0; g.fillStyle = '#fff'; g.font = `italic 700 72px ${SCRIPT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('xoxo', 0, -10);
  g.restore();
  // title
  g.save(); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `italic 700 240px ${SCRIPT}`;
  g.lineWidth = 14; g.strokeStyle = INK; g.lineJoin = 'round'; g.strokeText('Pin-Up', w / 2 + 60, 150);
  g.fillStyle = chromeGrad(g, 50, 250, ['#ffffff', '#ffe0ea', '#ff7aa0', '#d0102a', '#ffd6e2']); g.shadowColor = '#fff'; g.shadowBlur = 24; g.fillText('Pin-Up', w / 2 + 60, 150); g.shadowBlur = 0;
  g.fillStyle = CREAM; g.fillRect(560, 262, 1020, 80); g.strokeStyle = CHERRY; g.lineWidth = 5; g.strokeRect(560, 262, 1020, 80);
  g.fillStyle = CHERRY; g.font = '900 42px "Arial Black", Impact, sans-serif'; g.fillText('SWEETHEART  ·  ROCK \'N\' ROLL PINBALL', w / 2, 304); g.restore();
  const fr = g.createLinearGradient(0, 428, 0, 800); fr.addColorStop(0, '#ffffff'); fr.addColorStop(0.5, '#b8c0cc'); fr.addColorStop(1, '#5a6270');
  displayWindow(g, fr, '#0a0006');
  g.fillStyle = '#1a0408'; g.fillRect(420, 850, w - 420, 150);
  for (let x = 420; x < w; x += 30) { g.fillStyle = (x / 30) % 2 ? '#111' : '#f4f4f0'; g.fillRect(x, 846, 30, 12); }
  g.save(); g.fillStyle = MINT; g.font = '700 42px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('JUKEBOX  ·  MILKSHAKES  ·  CHERRY PIE  ·  ROUTE 66', (w + 420) / 2, 925); g.restore();
  // girl stands in front of the bottom strip
  pinupGirl(g, 205, 990, 1.05);
  return c;
}

function wall() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = CREAM; g.fillRect(0, 0, 512, 256);
  g.fillStyle = CHERRY; for (let y = 16, r = 0; y < 256; y += 32, r++) for (let x = 16 + (r % 2) * 16; x < 512; x += 32) { g.beginPath(); g.arc(x, y, 6, 0, TAU); g.fill(); }
  return c;
}

export default {
  id: 'pinup', name: 'PIN-UP', t1: 'PIN-UP', t2: 'SWEETHEART', bonus: 'KISS BONUS 1000',
  table, glass, wall,
  dm: { bg: '#0a0006', off: '#2a0618', glow: 'rgba(255,80,150,0.28)', mid: '#ff4a9a', hi: '#ffd6ea' },
  song: { style: 'boogie', bpm: 156, steps: 12, roots: [55, 60, 62, 55], arp: [19, 0, 0, 17, 0, 16, 14, 0, 0, 12, 0, 10] },
  apron: { bg: '#d0102a', fg: '#fff3e0', line: '#6ee0c8', title: 'PIN-UP · SWEETHEART DINER' },
  colors: {
    bg: 0x0a0204, hemi: [0xffe0e8, 0x301018, 0.5], sun: [0xfff0e8, 1.45], warm: [0xff4060, 90],
    trim: { color: 0xd0d6e0, metalness: 0.9, roughness: 0.32, emissive: 0x000000, ei: 0 },
    accent: { color: 0xd0102a, emissive: 0x400008 }, cabinet: 0x7a0a1a,
    dome: 0xff3a5a, domeEmissive: 0xff1040, bulb: 0xfff0f0, bumperLight: 0xff4060,
    lamp: 0xff7aa0, particles: [0xff4060, 0xffffff, 0xffb0c8], trail: 0xff6a8a,
    bloom: [0.45, 0.4, 1.4], exposure: 0.92,
  },
};
