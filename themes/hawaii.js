// Theme: HAWAII SURFER – sunset beach
import { Z_TOP, Z_BOT, DIVIDER_X, BUMPERS, TAU } from '../layout.js';
import { palm, hibiscus, wavyLine } from '../art.js';

function makeTableTextureHawaii() {
  const PX = 50, w = 20 * PX, h = (Z_BOT - Z_TOP) * PX;
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const X = x => (x + 10) * PX, Z = z => (z - Z_TOP) * PX;
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#34206a'); gr.addColorStop(0.12, '#c8466e'); gr.addColorStop(0.225, '#ff9a4a');
  gr.addColorStop(0.237, '#17c1d0'); gr.addColorStop(0.45, '#0d8db4'); gr.addColorStop(0.6, '#13a9c4');
  gr.addColorStop(0.625, '#f3e2b4'); gr.addColorStop(0.85, '#e6c98f'); gr.addColorStop(1, '#6b5030');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  // sun at the horizon + rays
  const hz = Z(-9);
  g.save(); g.beginPath(); g.rect(0, 0, w, hz); g.clip();
  for (let i = 0; i < 24; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,230,150,0.16)' : 'rgba(255,255,255,0.03)';
    g.beginPath(); g.moveTo(X(0), hz); g.arc(X(0), hz, 14 * PX, Math.PI + i * Math.PI / 24, Math.PI + (i + 1) * Math.PI / 24); g.fill();
  }
  const sg = g.createRadialGradient(X(0), hz, 10, X(0), hz, 4.4 * PX); sg.addColorStop(0, '#fffbd0'); sg.addColorStop(0.6, '#ffd24a'); sg.addColorStop(1, '#ff8a2a');
  g.fillStyle = sg; g.shadowColor = '#ffb040'; g.shadowBlur = 50; g.beginPath(); g.arc(X(0), hz, 4.4 * PX, Math.PI, TAU); g.fill();
  g.restore(); g.shadowBlur = 0;
  // ocean: swells + sun glitter
  g.lineWidth = 3;
  for (let k = 0; k < 11; k++) {
    g.strokeStyle = `rgba(255,255,255,${0.10 + k * 0.02})`;
    wavyLine(g, 0, w, Z(-8.2 + k * 1.25), 4 + k * 0.6, 0.016 + k * 0.001, k * 1.7);
  }
  for (let k = 0; k < 16; k++) {
    g.fillStyle = `rgba(255,225,130,${0.5 - k * 0.025})`;
    const z = -8.7 + k * 0.55, half = (2.6 - k * 0.1) * PX;
    g.fillRect(X(0) - half * (0.4 + Math.random() * 0.6), Z(z), half * 2 * (0.4 + Math.random() * 0.5), 4);
  }
  // shoreline foam + wet sand
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  for (const [lw, dz, ph] of [[10, 0, 0], [6, 0.5, 2], [3, 1.0, 4]]) { g.lineWidth = lw; wavyLine(g, 0, w, Z(5.6 + dz), 7, 0.03, ph, 6); }
  g.fillStyle = 'rgba(120,90,50,0.22)'; for (let i = 0; i < 700; i++) g.fillRect(Math.random() * w, Z(6.2) + Math.random() * (h - Z(6.2)), 2, 2);
  g.fillStyle = 'rgba(255,255,255,0.45)'; for (let i = 0; i < 90; i++) { g.beginPath(); g.arc(Math.random() * w, Z(5.0 + Math.random() * 1.2), 2 + Math.random() * 3, 0, TAU); g.fill(); }
  // palms in the upper corners + arch
  palm(g, X(-8.7), Z(-9.3), X(-7.4), Z(-15.2), 3.6 * PX, 16);
  palm(g, X(7.0), Z(-9.3), X(7.8), Z(-14.4), 3.2 * PX, 14);
  g.shadowColor = '#fff'; g.shadowBlur = 14; g.strokeStyle = '#ffffff'; g.lineWidth = 6;
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = '#ff7a45'; g.lineWidth = 4; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * PX, Math.PI, TAU); g.stroke(); g.shadowBlur = 0;
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = '#c2185b'; g.shadowBlur = 12;
  g.font = '900 64px "Arial Black", Impact, sans-serif'; g.fillText('ALOHA', X(0), Z(-15.6)); g.shadowBlur = 0;
  // bumper rings (buoys)
  BUMPERS.forEach(b => {
    g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke();
    g.setLineDash([14, 14]); g.strokeStyle = '#ff7a45'; g.lineWidth = 5; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke();
    g.setLineDash([]); g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 3; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.5) * PX, 0, TAU); g.stroke();
  });
  // wooden surf-shop sign
  const bx0 = X(-9.6), bx1 = X(7.6), by0 = Z(3.0), by1 = Z(6.0);
  const wg = g.createLinearGradient(0, by0, 0, by1); wg.addColorStop(0, '#d49a55'); wg.addColorStop(1, '#a8702e');
  g.fillStyle = wg; g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
  g.strokeStyle = 'rgba(80,40,10,0.35)'; g.lineWidth = 2;
  for (let y = by0 + 14; y < by1; y += 14) { g.beginPath(); g.moveTo(bx0, y); g.lineTo(bx1, y + (Math.random() - 0.5) * 4); g.stroke(); }
  g.strokeStyle = '#5a3210'; g.lineWidth = 8; g.strokeRect(bx0 + 4, by0 + 4, bx1 - bx0 - 8, by1 - by0 - 8);
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = '900 88px "Arial Black", Impact, sans-serif'; g.lineWidth = 10; g.strokeStyle = '#5a1a2a'; g.lineJoin = 'round';
  g.strokeText('ALOHA BEACH', (bx0 + bx1) / 2, by0 + 92); g.fillStyle = '#fff4d6'; g.fillText('ALOHA BEACH', (bx0 + bx1) / 2, by0 + 92);
  g.font = '700 28px "Trebuchet MS", sans-serif'; g.fillStyle = '#3a1a08'; g.fillText('SURF SHOP  ·  HANG LOOSE  ·  WAIKIKI', (bx0 + bx1) / 2, by0 + 132);
  // hibiscus roundel
  g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 14; hibiscus(g, X(0), Z(9.3), 1.95 * PX); g.shadowBlur = 0;
  // towel-striped zones under guides
  const poly = pts => { g.beginPath(); pts.forEach(([x, z], i) => g[i ? 'lineTo' : 'moveTo'](X(x), Z(z))); g.closePath(); };
  for (const pts of [[[-10, 10.5], [-4.5, 14.3], [-4.6, 20], [-10, 20]], [[8, 10.5], [4.5, 14.3], [4.6, 20], [8, 20]]]) {
    g.save(); poly(pts); g.clip(); g.fillStyle = '#0b7f9a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#ffffff'; g.lineWidth = 14;
    for (let k = -30; k < 60; k++) { g.beginPath(); g.moveTo(X(-12 + k * 0.9), Z(8)); g.lineTo(X(-12 + k * 0.9 + 12), Z(22)); g.stroke(); }
    g.restore();
  }
  // plunger lane
  g.fillStyle = 'rgba(40,20,0,0.45)'; g.fillRect(X(DIVIDER_X), Z(-9), 2 * PX, h);
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.lineCap = 'round';
  for (let z = 15; z > -8; z -= 3) { g.beginPath(); g.moveTo(X(8.5), Z(z)); g.lineTo(X(9), Z(z - 0.8)); g.lineTo(X(9.5), Z(z)); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '56px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('▼', X(-8.5), Z(8.5)); g.fillText('▼', X(-8.5), Z(10.3));
  const dg = g.createLinearGradient(0, Z(17), 0, h); dg.addColorStop(0, 'rgba(0,20,40,0)'); dg.addColorStop(1, '#001018');
  g.fillStyle = dg; g.fillRect(0, Z(17), w, h);
  return c;
}

function makeGlassTextureHawaii() {
  const w = 2140, h = 1000, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, 760);
  sky.addColorStop(0, '#2d1b69'); sky.addColorStop(0.4, '#d4457a'); sky.addColorStop(0.7, '#ff9a3c'); sky.addColorStop(1, '#ffd36b');
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  // sun + rays
  g.save(); g.translate(w / 2, 560);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,240,170,0.16)' : 'rgba(255,255,255,0.03)';
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1500, Math.PI + i * Math.PI / 40, Math.PI + (i + 1) * Math.PI / 40); g.fill();
  }
  const sg = g.createRadialGradient(0, 0, 10, 0, 0, 300); sg.addColorStop(0, '#fffbd0'); sg.addColorStop(0.6, '#ffd24a'); sg.addColorStop(1, 'rgba(255,138,42,0.0)');
  g.fillStyle = sg; g.beginPath(); g.arc(0, 0, 300, 0, TAU); g.fill(); g.restore();
  // ocean band
  const oc = g.createLinearGradient(0, 700, 0, 1000); oc.addColorStop(0, '#17c1d0'); oc.addColorStop(1, '#043f5c');
  g.fillStyle = oc; g.fillRect(0, 700, w, 300);
  g.lineWidth = 4; for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(255,255,255,${0.15 + k * 0.05})`; wavyLine(g, 0, w, 730 + k * 40, 8 + k * 2, 0.012 + k * 0.001, k * 2); }
  // palm (left) and big wave + surfer (right)
  palm(g, 150, 880, 235, 520, 220, 34);
  g.fillStyle = '#1aa7c2';
  g.beginPath(); g.moveTo(1740, 880); g.bezierCurveTo(1740, 640, 1880, 470, 2090, 520);
  g.bezierCurveTo(2000, 540, 1965, 620, 1995, 690); g.bezierCurveTo(2030, 770, 2070, 820, 2140, 880); g.closePath();
  const wg = g.createLinearGradient(1740, 520, 2100, 880); wg.addColorStop(0, '#5ee6e0'); wg.addColorStop(1, '#0a5f86'); g.fillStyle = wg; g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(1790, 620); g.bezierCurveTo(1830, 520, 1950, 480, 2090, 520); g.stroke();
  g.save(); g.translate(1905, 640); g.rotate(-0.5);
  g.fillStyle = '#ff7a45'; g.beginPath(); g.ellipse(0, 0, 95, 11, 0, 0, TAU); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, 0); g.lineTo(60, 0); g.stroke();
  g.strokeStyle = '#10223a'; g.lineWidth = 15; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-14, -6); g.lineTo(-24, -42); g.lineTo(-6, -78); g.moveTo(12, -6); g.lineTo(6, -42); g.lineTo(-6, -78); g.stroke();
  g.beginPath(); g.moveTo(-6, -78); g.lineTo(-48, -96); g.moveTo(-6, -78); g.lineTo(38, -92); g.stroke();
  g.fillStyle = '#10223a'; g.beginPath(); g.arc(-4, -108, 14, 0, TAU); g.fill(); g.restore();
  // title
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.font = '900 200px "Arial Black", Impact, sans-serif';
  g.lineWidth = 22; g.strokeStyle = '#7a1a4a'; g.strokeText('HAWAII SURF', w / 2, 150);
  g.fillStyle = '#fff4d6'; g.fillText('HAWAII SURF', w / 2, 150);
  g.fillStyle = '#17c1d0'; g.fillRect(560, 262, 1020, 80);
  g.fillStyle = '#fff'; g.font = '900 44px "Arial Black", Impact, sans-serif'; g.fillText('ALOHA  ·  HANG LOOSE  ·  PINBALL', w / 2, 304);
  // display window
  const fr = g.createLinearGradient(0, 410, 0, 800); fr.addColorStop(0, '#ffb070'); fr.addColorStop(1, '#c4521c');
  g.fillStyle = fr; g.fillRect(396, 428, 1348, 372); g.fillStyle = '#010a0c'; g.fillRect(412, 444, 1316, 340);
  hibiscus(g, 330, 880, 70); hibiscus(g, 1810, 880, 70, '#ffa24a');
  // bottom strip
  g.fillStyle = '#05283a'; g.fillRect(0, 850, w, 150);
  g.fillStyle = '#ff7a45'; g.fillRect(0, 846, w, 10);
  g.fillStyle = '#ffe9b0'; g.font = '700 44px "Trebuchet MS", sans-serif'; g.textAlign = 'center';
  g.fillText('WAIKIKI  ·  NORTH SHORE  ·  PIPELINE  ·  MAUI  ·  KAUAI', w / 2, 925);
  return c;
}

function makeBambooWood() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#f2e3bf'; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(${150 + Math.random() * 40},${105 + Math.random() * 30},${50 + Math.random() * 30},${0.08 + Math.random() * 0.16})`;
    g.lineWidth = 0.6 + Math.random() * 1.8; g.beginPath(); const y = Math.random() * 256; g.moveTo(0, y);
    for (let x = 0; x <= 512; x += 64) g.lineTo(x, y + (Math.random() - 0.5) * 8); g.stroke();
  }
  return c;
}

export default {
  id: 'hawaii', name: 'HAWAII SURFER', t1: 'HAWAII SURF', t2: 'ALOHA!', bonus: 'BIG WAVE BONUS 1000',
  table: makeTableTextureHawaii, glass: makeGlassTextureHawaii, wall: makeBambooWood,
  dm: { bg: '#010a0c', off: '#06262b', glow: 'rgba(30,220,200,0.28)', mid: '#18c9b8', hi: '#c0fff2' },
  song: { style: 'uke', bpm: 104, roots: [60, 57, 53, 55], arp: [0, 7, 12, 16, 12, 7, 12, 7, 0, 7, 12, 16, 19, 16, 12, 7] },
  apron: { bg: '#0b5f73', fg: '#fff4d6', line: '#ff7a45', title: 'ALOHA BEACH · WAIKIKI' },
  colors: {
    bg: 0x061a24, hemi: [0xbfe8ff, 0xe0b878, 0.6], sun: [0xffe2b0, 1.8], warm: [0xff9a40, 90],
    trim: { color: 0xff7a45, metalness: 0.15, roughness: 0.35, emissive: 0x000000, ei: 0 },
    accent: { color: 0x12b8c8, emissive: 0x04323a }, cabinet: 0x0f5566,
    dome: 0xff6a3d, domeEmissive: 0xff4a1a, bulb: 0xfff0a0, bumperLight: 0xff8a3a,
    lamp: 0x30f0e0, particles: [0xffffff, 0x40e0ff], trail: 0x40e0ff,
    bloom: [0.45, 0.4, 1.2], exposure: 1.05,
  },
};
