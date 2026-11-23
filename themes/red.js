// Theme: RED OCTOBER – Moscow-metro / art-deco
import { Z_TOP, Z_BOT, DIVIDER_X, BUMPERS, TAU } from '../layout.js';
import { star, metroM, goldGrad } from '../art.js';

function makeTableTexture() {
  const PX = 50, w = 20 * PX, h = (Z_BOT - Z_TOP) * PX;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  const X = x => (x + 10) * PX, Z = z => (z - Z_TOP) * PX;
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#6a0c16'); bg.addColorStop(0.5, '#450811'); bg.addColorStop(1, '#190307');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);

  // art-deco diamond tiling
  g.strokeStyle = 'rgba(240,190,90,0.10)'; g.lineWidth = 2;
  for (let k = -40; k < 40; k++) {
    g.beginPath(); g.moveTo(X(k * 2), 0); g.lineTo(X(k * 2 + 38), h); g.stroke();
    g.beginPath(); g.moveTo(X(k * 2), 0); g.lineTo(X(k * 2 - 38), h); g.stroke();
  }
  // sunburst from the arch
  g.save(); g.translate(X(0), Z(-12));
  for (let i = 0; i < 28; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,210,120,0.10)' : 'rgba(255,255,255,0.03)';
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 16 * PX, Math.PI + i * Math.PI / 28, Math.PI + (i + 1) * Math.PI / 28); g.fill();
  }
  g.restore();

  // subway tracks in perspective
  for (let k = 0; k <= 26; k++) {
    const t = k / 26, z = 19 - Math.pow(t, 0.8) * 26, hw = 3.7 - t * 2.9;
    g.strokeStyle = `rgba(210,170,100,${0.28 - t * 0.14})`; g.lineWidth = 9 - t * 6;
    g.beginPath(); g.moveTo(X(-hw - 0.5), Z(z)); g.lineTo(X(hw + 0.5), Z(z)); g.stroke();
  }
  for (const s of [-1, 1]) {
    g.strokeStyle = 'rgba(235,235,245,0.42)'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath(); g.moveTo(X(s * 3.7), Z(19)); g.lineTo(X(s * 0.8), Z(-7)); g.stroke();
  }
  // arch: gold double ring + red star
  g.shadowColor = '#fc6'; g.shadowBlur = 16;
  g.strokeStyle = goldGrad(g, Z(-22), Z(-12)); g.lineWidth = 7;
  g.beginPath(); g.arc(X(0), Z(-12), 9.2 * PX, Math.PI, TAU); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.arc(X(0), Z(-12), 8.4 * PX, Math.PI, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3;
  g.beginPath(); g.arc(X(0), Z(-12), 6.0 * PX, Math.PI, TAU); g.stroke();
  g.shadowBlur = 0;
  star(g, X(0), Z(-15.6), 2.1 * PX, 0.85 * PX); g.fillStyle = '#e0121c'; g.fill();
  g.strokeStyle = '#f4c542'; g.lineWidth = 5; g.stroke();
  g.fillStyle = '#f4c542'; g.font = `900 44px "Arial Black", Impact, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('RED OCTOBER', X(0), Z(-11.1));

  // bumper rings
  BUMPERS.forEach(b => {
    g.shadowColor = '#f44'; g.shadowBlur = 20;
    g.strokeStyle = '#f4c542'; g.lineWidth = 5; g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 0.8) * PX, 0, TAU); g.stroke();
    g.shadowBlur = 0; g.setLineDash([10, 14]); g.strokeStyle = 'rgba(255,240,200,0.6)'; g.lineWidth = 3;
    g.beginPath(); g.arc(X(b.x), Z(b.z), (b.r + 1.4) * PX, 0, TAU); g.stroke(); g.setLineDash([]);
  });

  // station sign (cream band)
  const bx0 = X(-9.6), bx1 = X(7.6), by0 = Z(3.0), by1 = Z(6.0);
  g.fillStyle = '#efe2c0'; g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
  g.strokeStyle = '#c8101c'; g.lineWidth = 8; g.strokeRect(bx0 + 6, by0 + 6, bx1 - bx0 - 12, by1 - by0 - 12);
  g.strokeStyle = '#d9a82a'; g.lineWidth = 3; g.strokeRect(bx0 + 16, by0 + 16, bx1 - bx0 - 32, by1 - by0 - 32);
  g.fillStyle = '#a3081a'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  let fs = 84; g.font = `900 ${fs}px "Arial Black", Impact, sans-serif`;
  const tw = g.measureText('КРАСНЫЙ ОКТЯБРЬ').width, maxw = (bx1 - bx0) - 80;
  if (tw > maxw) { fs *= maxw / tw; g.font = `900 ${fs}px "Arial Black", Impact, sans-serif`; }
  g.fillText('КРАСНЫЙ ОКТЯБРЬ', (bx0 + bx1) / 2, by0 + 88);
  g.font = '700 28px "Trebuchet MS", sans-serif'; g.fillStyle = '#5a1018';
  g.fillText('RED OCTOBER STATION  ·  LINE 1  ·  ' + '★ ★ ★', (bx0 + bx1) / 2, by0 + 128);

  // metro roundel
  metroM(g, X(0), Z(9.3), 1.9 * PX);

  // striped zones under the guides
  const poly = pts => { g.beginPath(); pts.forEach(([x, z], i) => g[i ? 'lineTo' : 'moveTo'](X(x), Z(z))); g.closePath(); };
  for (const pts of [[[-10, 10.5], [-4.5, 14.3], [-4.6, 20], [-10, 20]], [[8, 10.5], [4.5, 14.3], [4.6, 20], [8, 20]]]) {
    g.save(); poly(pts); g.clip(); g.fillStyle = '#1a0306'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d4101c'; g.lineWidth = 14;
    for (let k = -30; k < 60; k++) { g.beginPath(); g.moveTo(X(-12 + k * 0.9), Z(8)); g.lineTo(X(-12 + k * 0.9 + 12), Z(22)); g.stroke(); }
    g.restore();
  }
  // plunger lane
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(X(DIVIDER_X), Z(-9), 2 * PX, h);
  g.strokeStyle = 'rgba(244,197,66,0.65)'; g.lineWidth = 5;
  for (let z = 15; z > -8; z -= 3) { g.beginPath(); g.moveTo(X(8.5), Z(z)); g.lineTo(X(9), Z(z - 0.8)); g.lineTo(X(9.5), Z(z)); g.stroke(); }
  // arrows near slings
  g.fillStyle = 'rgba(255,220,120,0.85)'; g.font = '56px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('▼', X(-8.5), Z(8.5)); g.fillText('▼', X(-8.5), Z(10.3));
  // drain
  const dg = g.createLinearGradient(0, Z(17), 0, h); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, '#000');
  g.fillStyle = dg; g.fillRect(0, Z(17), w, h);
  return c;
}

function makeGlassTexture() {
  const w = 2140, h = 1000, c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#7a0c18'); bg.addColorStop(1, '#2a0409');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // sunburst
  g.save(); g.translate(w / 2, h * 0.62);
  for (let i = 0; i < 44; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,200,110,0.13)' : 'rgba(255,255,255,0.03)';
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1400, Math.PI + i * Math.PI / 44, Math.PI + (i + 1) * Math.PI / 44); g.fill();
  }
  g.restore();
  // art-deco tunnel arches
  g.strokeStyle = goldGrad(g, 0, h); 
  for (let i = 0; i < 4; i++) { g.lineWidth = 10 - i * 2; g.beginPath(); g.arc(w / 2, 440, 380 + i * 62, Math.PI, TAU); g.stroke(); }
  // title
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#000'; g.shadowBlur = 20;
  g.fillStyle = goldGrad(g, 70, 220); g.font = '900 190px "Arial Black", Impact, sans-serif'; g.fillText('RED OCTOBER', w / 2, 150);
  g.shadowBlur = 0;
  // subtitle band
  g.fillStyle = '#efe2c0'; g.fillRect(560, 250, 1020, 90);
  g.fillStyle = '#a3081a'; g.font = '900 44px "Arial Black", Impact, sans-serif'; g.fillText('МОСКОВСКИЙ МЕТРО · SUBWAY', w / 2, 297);
  g.fillStyle = '#f4c542'; star(g, 500, 295, 46, 19); g.fill(); star(g, 1640, 295, 46, 19); g.fill();
  // display window frame
  g.fillStyle = goldGrad(g, 410, 800); g.fillRect(396, 428, 1348, 372);
  g.fillStyle = '#080100'; g.fillRect(412, 444, 1316, 340);
  // side ornaments
  metroM(g, 190, 440, 120); metroM(g, 1950, 440, 120);
  for (const x of [190, 1950]) { star(g, x, 700, 70, 28); g.fillStyle = '#f4c542'; g.fill(); }
  // bottom strip
  g.fillStyle = '#12020a'; g.fillRect(0, 850, w, 150);
  g.fillStyle = goldGrad(g, 850, 870); g.fillRect(0, 846, w, 10);
  g.fillStyle = '#f4c542'; g.font = '700 44px "Trebuchet MS", sans-serif';
  g.fillText('★  ЛИНИЯ 1  ·  КРАСНЫЙ ОКТЯБРЬ  ·  ПЛОЩАДЬ РЕВОЛЮЦИИ  ·  КОМСОМОЛЬСКАЯ  ★', w / 2, 925);
  return c;
}

function makeMarble() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#eadfc2'; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(${120 + Math.random() * 60},${90 + Math.random() * 40},${70 + Math.random() * 30},${0.08 + Math.random() * 0.18})`;
    g.lineWidth = 0.6 + Math.random() * 2; g.beginPath();
    let x = Math.random() * 512, y = Math.random() * 256; g.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (Math.random() - 0.3) * 80; y += (Math.random() - 0.5) * 50; g.lineTo(x, y); }
    g.stroke();
  }
  return c;
}

export default {
  id: 'red', name: 'RED OCTOBER', t1: 'RED OCTOBER', t2: 'SUBWAY', bonus: 'STATION BONUS 1000',
  table: makeTableTexture, glass: makeGlassTexture, wall: makeMarble,
  dm: { bg: '#0a0200', off: '#2b0d03', glow: 'rgba(255,120,20,0.28)', mid: '#ff8a18', hi: '#ffd27a' },
  song: { style: 'chip', bpm: 120, roots: [57, 53, 60, 55], arp: [0, 12, 7, 12, 0, 12, 7, 15, 0, 12, 7, 12, 3, 12, 7, 10] },
  apron: { bg: '#2a0409', fg: '#f4c542', line: '#c8101c', title: 'RED OCTOBER · LINE 1' },
  colors: {
    bg: 0x0b0305, hemi: [0xffd9b0, 0x401018, 0.55], sun: [0xfff0dd, 1.7], warm: [0xff5533, 90],
    trim: { color: 0xe0aa2c, metalness: 1, roughness: 0.28, emissive: 0x000000, ei: 0 },
    accent: { color: 0xc8101c, emissive: 0x500008 }, cabinet: 0x4a0a10,
    dome: 0xd8101c, domeEmissive: 0xff1020, bulb: 0xffe9a0, bumperLight: 0xff3040,
    lamp: 0xffb020, particles: [0xffd27a, 0xff3030], trail: 0xff6020,
    bloom: [0.55, 0.4, 1.15], exposure: 1.05,
  },
};
