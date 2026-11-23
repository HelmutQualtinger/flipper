/* =====================================================================
   ROOMS – every machine stands in its own bar, with a bartender at the counter.
   Scale: 1 unit ≈ 3.5 cm. Playfield at y = 0, floor at y = FLOOR.
   ===================================================================== */
import * as THREE from 'three';

export const FLOOR = -28;
const CEIL = 46, BACK = -25, SIDE = 95, FRONT = 120, TAU = Math.PI * 2;
const BAR_X = 52;   // centre of the bar counter

// ---------------------------------------------------------------- per-theme room design
const ROOMS = {
  red: {
    wall: ['stars', { bg: '#5e0a0e', fg: '#d8a830', fg2: '#7a1016' }], lower: ['wood', { hue: 12, l: 0.36 }], floor: ['planks', { hue: 22, l: 0.32 }],
    ceil: '#240808', neon: [['Бар', '#ff3a20'], ['ЗАКУСКИ', '#ffc030'], ['ОТКРЫТО', '#ff3a20']],
    top: 0x9a1016, vinyl: 0xa01018, globe: 0xffb040, light: 0xffa060, decor: ['mirror', 'armchair:0x6a0c10', 'lamp:0xffb040', 'plant'],
    lady: { skin: '#f2cfb4', hair: '#6a3a1a', skirt: '#1a1a1a', shoes: '#8a0c10', style: 'bun', blouse: '#f4f0ea', vest: '#7a0a10', lips: '#c01a2a', acc: 'star' },
  },
  hawaii: {
    wall: ['bamboo', { a: '#c8a060', b: '#8a6a30' }], lower: ['woven', { a: '#b8904a', b: '#7a5a28' }], floor: ['planks', { hue: 32, l: 0.55 }],
    ceil: '#4a3418', neon: [['Tiki Bar', '#ff6a3a'], ['MAI TAI', '#2ae8d0'], ['ALOHA', '#ff3aa0']],
    top: 0x2aa8a0, vinyl: 0xff6a3a, globe: 0xffc060, light: 0xffb060, decor: ['mirror', 'armchair:0x2a8a80', 'torch', 'plant', 'plant2'],
    lady: { skin: '#c8915e', hair: '#1a0c06', skirt: '#f2e6cc', shoes: '#ff6a3a', style: 'long', blouse: '#1aa89a', vest: null, lips: '#d0304a', acc: 'flower' },
  },
  synthwave: {
    wall: ['neongrid', { bg: '#14062a', a: '#ff2aa0', b: '#2ad8ff' }], lower: ['panels', { bg: '#1a0e2a', line: '#ff2aa0' }], floor: ['checker', { a: '#14081e', b: '#3a1050' }],
    ceil: '#0a0414', neon: [['Neon Nights', '#ff2aa0'], ['ARCADE', '#2ad8ff'], ['PLAY', '#ffe02a']],
    top: 0x1a1a2a, vinyl: 0xff2aa0, globe: 0xff4ac0, light: 0xc040ff, decor: ['window', 'armchair:0x3a1060', 'lava:0x2ad8ff', 'plant', 'disco'],
    lady: { skin: '#f0c8a8', hair: '#e8509a', skirt: '#101018', shoes: '#ff2aa0', legs: '#2a1a2a', style: 'ponytail', blouse: '#18182a', vest: '#2ad8ff', lips: '#ff2a8a', acc: 'headband' },
  },
  space: {
    wall: ['circles', {}], lower: ['wood', { hue: 24, l: 0.4 }], floor: ['carpet', { bg: '#5a2a10', a: 'rgba(216,102,30,0.55)', b: 'rgba(220,164,36,0.4)' }],
    ceil: '#3a2618', neon: [['Orbit Lounge', '#ff3aa0'], ['COCKTAILS', '#3ae8ff'], ['OPEN', '#ff5a1a']],
    top: 0xd8661e, vinyl: 0xc84a14, globe: 0xff9a3a, light: 0xff9a40, decor: ['mirror', 'armchair:0x8a6a1a', 'lava:0xff3a6a', 'disco'],
    lady: { skin: '#f4d2b8', hair: '#c8641e', skirt: '#6a3010', shoes: '#d8661e', style: 'bob', blouse: '#f2e2b8', vest: '#d8661e', lips: '#d02a3a', acc: null },
  },
  pirate: {
    wall: ['bricks', { bg: '#3a2c20', a: '#7a6248', b: '#5a4632' }], lower: ['wood', { hue: 26, l: 0.3 }], floor: ['planks', { hue: 28, l: 0.26 }],
    ceil: '#1a120a', neon: [['Grog & Rum', '#ffa02a'], ['TAVERN', '#ffc04a'], ['OPEN', '#ff7a1a']],
    top: 0x4a2a12, vinyl: 0x6a3a1a, globe: 0xffa040, light: 0xff9a40, decor: ['wheel', 'barrels', 'lantern', 'barrels2'],
    lady: { skin: '#e8b890', hair: '#8a1a10', skirt: '#3a2010', shoes: '#1a1a1a', style: 'long', blouse: '#f0e6d0', vest: '#2a1a10', lips: '#b0202a', acc: 'bandana' },
  },
  tesla: {
    wall: ['damask', { bg: '#163024', fg: '#b87a3a' }], lower: ['wood', { hue: 18, l: 0.3 }], floor: ['checker', { a: '#1a1410', b: '#cbb894' }],
    ceil: '#14100c', neon: [['Electric Saloon', '#7ac8ff'], ['VOLTS', '#ffb84a'], ['AC', '#7ac8ff']],
    top: 0x3a2a1a, vinyl: 0x5a2a10, globe: 0xffc070, light: 0xffb070, decor: ['mirror', 'armchair:0x4a2210', 'lamp:0xffc070', 'coil'],
    lady: { skin: '#f0d0b8', hair: '#2a1a12', skirt: '#2a1a10', shoes: '#3a1a0a', style: 'bun', blouse: '#f2eee4', vest: '#4a2a16', lips: '#a8202a', acc: 'goggles' },
  },
  halloween: {
    wall: ['damask', { bg: '#1a0c24', fg: '#5a2a7a' }], lower: ['wood', { hue: 280, l: 0.16 }], floor: ['planks', { hue: 270, l: 0.16 }],
    ceil: '#0a0410', neon: [['Boo Bar', '#6aff2a'], ['POTIONS', '#ff8a2a'], ['OPEN', '#b040ff']],
    top: 0x2a0a3a, vinyl: 0x4a1a6a, globe: 0x6aff2a, light: 0x8a4aff, decor: ['window', 'armchair:0x3a0a4a', 'lantern', 'pumpkins'],
    lady: { skin: '#f0dcd0', hair: '#141018', skirt: '#1a0a24', shoes: '#0a0a0a', legs: '#1e1420', eyes: '#4a7a2a', style: 'long', blouse: '#2a0a3a', vest: '#121212', lips: '#7a0a3a', acc: 'witch' },
  },
  africa: {
    wall: ['kente', {}], lower: ['woven', { a: '#a87a3a', b: '#6a4a1a' }], floor: ['woven', { a: '#9a7038', b: '#6a4a20' }],
    ceil: '#2a1a0a', neon: [['Sundowner', '#ffb02a'], ['SAFARI LODGE', '#ff6a2a'], ['OPEN', '#ffd02a']],
    top: 0x6a3a14, vinyl: 0xa8501a, globe: 0xffb050, light: 0xffa050, decor: ['mirror', 'armchair:0x6a3a1a', 'lantern', 'plant', 'plant2'],
    lady: { skin: '#7a4a2c', hair: '#120a06', skirt: '#1a7a3a', shoes: '#c8281c', style: 'afro', blouse: '#f0b02a', vest: '#c8281c', lips: '#6a1a20', acc: 'headwrap' },
  },
  newyork: {
    wall: ['deco', { bg: '#0c0c10', fg: '#c8a040' }], lower: ['wood', { hue: 14, l: 0.2 }], floor: ['checker', { a: '#0e0e10', b: '#e8e4da' }],
    ceil: '#0a0a0c', neon: [['Speakeasy', '#ff3a50'], ['JAZZ CLUB', '#ffc61a'], ['OPEN', '#ff3a50']],
    top: 0x101014, vinyl: 0x8a0a1a, globe: 0xffd080, light: 0xffc070, decor: ['mirror', 'armchair:0x7a0a14', 'lamp:0xffd080', 'plant'],
    lady: { skin: '#f2d0b8', hair: '#0e0a08', skirt: '#0e0e12', shoes: '#c0102a', legs: '#3a2a28', style: 'bob', blouse: '#f4f0e8', vest: '#0e0e12', lips: '#c0102a', acc: 'pearls' },
  },
  pinup: {
    wall: ['diner', { a: '#8fe0c8', b: '#f6ead2', c: '#d0102a' }], lower: ['tiles', { a: '#f4f0e8', b: '#d0102a' }], floor: ['checker', { a: '#141414', b: '#f2eee4' }],
    ceil: '#f0e8d8', neon: [['Diner', '#ff3a6a'], ['MILKSHAKES', '#3ae8d0'], ['OPEN', '#ff3a6a']],
    top: 0xd0102a, vinyl: 0xd0102a, globe: 0xfff0d0, light: 0xfff0e0, decor: ['clock', 'armchair:0xd0102a', 'plant', 'lava:0xff4a9a'],
    lady: { skin: '#f6d6c0', hair: '#f0c050', skirt: '#d0102a', shoes: '#d0102a', eyes: '#2a5a8a', style: 'victory', blouse: '#d0102a', vest: null, lips: '#d0102a', acc: 'bandana' },
  },
  starpatrol: {
    wall: ['panels', { bg: '#2a3442', line: '#5ab8ff' }], lower: ['panels', { bg: '#1a222c', line: '#ffb02a' }], floor: ['grating', {}],
    ceil: '#141a22', neon: [['Observation Deck', '#5ab8ff'], ['SHIP LOUNGE', '#ffb02a'], ['DECK 10', '#5ab8ff']],
    top: 0x2a3a4a, vinyl: 0x8a1a1a, globe: 0xbfe0ff, light: 0x9ac8ff, decor: ['window', 'armchair:0x3a4a5a', 'plant', 'lamp:0xbfe0ff'],
    lady: { skin: '#e8c0a0', hair: '#2a1a10', skirt: '#1a1a22', shoes: '#111111', style: 'ponytail', blouse: '#1a1a22', vest: '#c8a02a', lips: '#b0303a', acc: 'badge' },
  },
};

// ---------------------------------------------------------------- canvas helpers
function cv(w, h = w) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function tex(c, rx = 1, ry = 1) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t;
}
// lit material that also glows faintly, so the room reads well under every theme's lights
function mat(map, o = {}) {
  return new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: 0xffffff, emissiveIntensity: o.glow ?? 0.2,
    roughness: o.rough ?? 0.8, metalness: o.metal ?? 0 });
}
const R = (a, b) => a + Math.random() * (b - a);
function noise(g, S, amt) {
  const img = g.getImageData(0, 0, S, S), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
}
function star(g, x, y, r, pts = 5) {
  g.beginPath();
  for (let i = 0; i < pts * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / pts, rr = i % 2 ? r * 0.42 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}

// ---------------------------------------------------------------- surface patterns (512² tiles)
const PAT = {
  circles(g, S) {
    const P = ['#4a2812', '#d8661e', '#dca424', '#f2e2b8', '#a8401a', '#7d8428'];
    g.fillStyle = P[0]; g.fillRect(0, 0, S, S);
    const sets = [[P[1], P[2], P[3], P[4]], [P[2], P[4], P[1], P[3]]];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const cx = x * 128 + 64, cy = y * 128 + 64, set = sets[(x + y) % 2];
      for (let i = 0; i < 4; i++) { g.fillStyle = set[i]; g.beginPath(); g.arc(cx, cy, 56 - i * 13, 0, TAU); g.fill(); }
      g.fillStyle = P[0]; g.beginPath(); g.arc(cx, cy, 6, 0, TAU); g.fill();
    }
    g.fillStyle = P[5];
    for (let y = 0; y <= 4; y++) for (let x = 0; x <= 4; x++) { g.beginPath(); g.arc(x * 128, y * 128, 14, 0, TAU); g.fill(); }
  },
  stars(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    g.fillStyle = P.fg2; for (let x = 0; x < S; x += 64) g.fillRect(x, 0, 18, S);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      g.fillStyle = P.fg; star(g, x * 128 + 64 + (y % 2) * 0, y * 128 + 64, (x + y) % 2 ? 26 : 16);
    }
    g.strokeStyle = P.fg; g.globalAlpha = 0.35; g.lineWidth = 2;
    for (let y = 0; y <= S; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(S, y); g.stroke(); }
    g.globalAlpha = 1; noise(g, S, 14);
  },
  bamboo(g, S, P) {
    g.fillStyle = P.b; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 8; i++) {
      const x = i * 64, gr = g.createLinearGradient(x, 0, x + 64, 0);
      gr.addColorStop(0, P.b); gr.addColorStop(0.35, P.a); gr.addColorStop(0.6, P.a); gr.addColorStop(1, '#4a3416');
      g.fillStyle = gr; g.fillRect(x + 2, 0, 60, S);
      for (let k = 0; k < 3; k++) {
        const y = ((i * 97 + k * 181) % S);
        g.fillStyle = 'rgba(60,40,10,0.7)'; g.fillRect(x + 2, y, 60, 6);
        g.fillStyle = 'rgba(255,230,160,0.35)'; g.fillRect(x + 2, y + 6, 60, 3);
      }
    }
    noise(g, S, 18);
  },
  neongrid(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    g.shadowBlur = 10;
    for (let i = 0; i <= 8; i++) {
      g.strokeStyle = g.shadowColor = i % 4 ? P.a : P.b; g.lineWidth = i % 4 ? 2 : 4;
      g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, S); g.stroke();
      g.beginPath(); g.moveTo(0, i * 64); g.lineTo(S, i * 64); g.stroke();
    }
    g.shadowBlur = 0; g.fillStyle = P.b;
    for (let i = 0; i < 6; i++) { g.globalAlpha = 0.5; g.beginPath(); g.arc(R(0, S), R(0, S), 3, 0, TAU); g.fill(); }
    g.globalAlpha = 1;
  },
  panels(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 2; x++) {
      const px = x * 256 + 6, py = y * 128 + 6;
      const gr = g.createLinearGradient(0, py, 0, py + 116); gr.addColorStop(0, 'rgba(255,255,255,0.12)'); gr.addColorStop(1, 'rgba(0,0,0,0.25)');
      g.fillStyle = gr; g.fillRect(px, py, 244, 116);
      g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 3; g.strokeRect(px, py, 244, 116);
      g.fillStyle = 'rgba(255,255,255,0.4)'; for (const [rx, ry] of [[10, 10], [234, 10], [10, 106], [234, 106]]) { g.beginPath(); g.arc(px + rx, py + ry, 3, 0, TAU); g.fill(); }
    }
    g.fillStyle = P.line; g.globalAlpha = 0.85; g.fillRect(0, 250, S, 8); g.globalAlpha = 1;
    noise(g, S, 10);
  },
  bricks(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 8; y++) for (let x = -1; x < 5; x++) {
      const bx = x * 128 + (y % 2) * 64 + 4, by = y * 64 + 4;
      g.fillStyle = Math.random() < 0.5 ? P.a : P.b; g.globalAlpha = R(0.75, 1); g.fillRect(bx, by, 120, 56);
    }
    g.globalAlpha = 1; noise(g, S, 40);
  },
  damask(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    g.fillStyle = P.fg; g.strokeStyle = P.fg; g.lineWidth = 4;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const cx = x * 128 + ((y % 2) ? 64 : 0) + 32, cy = y * 128 + 64;
      g.save(); g.translate(cx, cy);
      g.beginPath(); g.ellipse(0, 0, 12, 30, 0, 0, TAU); g.fill();
      for (const s of [-1, 1]) {
        g.beginPath(); g.ellipse(s * 20, -8, 8, 18, s * 0.6, 0, TAU); g.fill();
        g.beginPath(); g.arc(s * 26, 22, 12, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2.4 : -Math.PI * 1.4, s < 0); g.stroke();
      }
      g.beginPath(); g.moveTo(0, -48); g.lineTo(8, -34); g.lineTo(-8, -34); g.closePath(); g.fill();
      g.restore();
    }
    g.globalAlpha = 0.18; g.fillStyle = '#000'; for (let x = 0; x < S; x += 32) g.fillRect(x, 0, 2, S); g.globalAlpha = 1;
  },
  kente(g, S) {
    const C = ['#e8a81a', '#1a7a3a', '#c8281c', '#121212', '#f0c83a'];
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      g.fillStyle = C[(x * 3 + y * 2 + (x * y) % 3) % C.length]; g.fillRect(x * 64, y * 64, 64, 64);
      g.fillStyle = C[(x + y + 1) % C.length];
      if ((x + y) % 2) for (let i = 0; i < 4; i++) g.fillRect(x * 64, y * 64 + 6 + i * 16, 64, 6);
      else for (let i = 0; i < 4; i++) g.fillRect(x * 64 + 6 + i * 16, y * 64, 6, 64);
    }
    g.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i <= 8; i++) { g.fillRect(0, i * 64 - 1, S, 3); }
    noise(g, S, 24);
  },
  deco(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S);
    g.strokeStyle = P.fg; g.lineWidth = 3;
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
      const cx = x * 128 + (y % 2) * 64, cy = y * 128;
      for (let r = 60; r > 10; r -= 14) { g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.stroke(); }
      for (let a = 0; a <= 6; a++) { const t = Math.PI + a * Math.PI / 6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(t) * 60, cy + Math.sin(t) * 60); g.stroke(); }
    }
  },
  diner(g, S, P) {
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? P.a : P.b; g.fillRect(i * 64, 0, 64, S); }
    g.fillStyle = P.c; for (let i = 0; i < 8; i++) g.fillRect(i * 64 - 2, 0, 4, S);
    g.fillStyle = P.c; g.globalAlpha = 0.9;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const cx = x * 128 + 64, cy = y * 128 + 64 + (x % 2) * 32;
      g.beginPath(); g.moveTo(cx, cy + 12); g.bezierCurveTo(cx - 22, cy - 4, cx - 10, cy - 20, cx, cy - 8); g.bezierCurveTo(cx + 10, cy - 20, cx + 22, cy - 4, cx, cy + 12); g.fill();
    }
    g.globalAlpha = 1;
  },
  wood(g, S, P) {
    const boards = 6, bw = S / boards;
    for (let b = 0; b < boards; b++) {
      g.fillStyle = `hsl(${P.hue},50%,${(P.l + R(-0.04, 0.04)) * 100 * 0.55}%)`; g.fillRect(b * bw, 0, bw, S);
      for (let i = 0; i < 70; i++) {
        const x = b * bw + Math.random() * bw;
        g.strokeStyle = `rgba(${Math.random() < 0.5 ? '20,8,2' : '140,80,40'},${R(0.12, 0.35)})`; g.lineWidth = R(0.6, 2.2);
        g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= S; y += 32) g.lineTo(x + Math.sin(y * 0.02 + i) * 3, y); g.stroke();
      }
      g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(b * bw, 0, 3, S);
      g.fillStyle = 'rgba(255,200,140,0.1)'; g.fillRect(b * bw + 3, 0, 2, S);
    }
  },
  planks(g, S, P) {
    PAT.wood(g, S, P);
    g.fillStyle = 'rgba(0,0,0,0.55)';
    for (let b = 0; b < 6; b++) g.fillRect(b * S / 6, ((b * 211) % S), S / 6, 3);
  },
  woven(g, S, P) {
    g.fillStyle = P.b; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const h = (x + y) % 2, gr = h ? g.createLinearGradient(x * 32, 0, x * 32 + 32, 0) : g.createLinearGradient(0, y * 32, 0, y * 32 + 32);
      gr.addColorStop(0, P.b); gr.addColorStop(0.5, P.a); gr.addColorStop(1, P.b);
      g.fillStyle = gr; g.fillRect(x * 32 + 1, y * 32 + 1, 30, 30);
    }
    noise(g, S, 20);
  },
  checker(g, S, P) {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? P.a : P.b; g.fillRect(x * 64, y * 64, 64, 64); }
    noise(g, S, 12);
  },
  tiles(g, S, P) {
    g.fillStyle = '#b8b0a8'; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = y === 2 ? P.b : P.a; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); }
    noise(g, S, 8);
  },
  carpet(g, S, P) {
    g.fillStyle = P.bg; g.fillRect(0, 0, S, S); g.lineWidth = 10;
    for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) {
      const cx = x * 128 + (y % 2) * 64, cy = y * 111;
      g.strokeStyle = P.a; g.beginPath();
      for (let i = 0; i <= 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; g.lineTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50); }
      g.stroke(); g.fillStyle = P.b; g.beginPath(); g.arc(cx, cy, 14, 0, TAU); g.fill();
    }
    noise(g, S, 50);
  },
  grating(g, S) {
    g.fillStyle = '#2a3038'; g.fillRect(0, 0, S, S);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      g.fillStyle = (x + y) % 2 ? '#4a525c' : '#3e464e'; g.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
      g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(x * 32 + 6, y * 32 + 14, 20, 4);
    }
    g.fillStyle = '#ffb02a'; g.globalAlpha = 0.5; g.fillRect(0, 0, S, 6); g.globalAlpha = 1;
    noise(g, S, 12);
  },
};
function pattern([kind, P]) { const [c, g] = cv(512); PAT[kind](g, 512, P); return c; }

function neonTex(text, font, color) {
  const [c, g] = cv(1024, 256);
  g.font = font; let w = g.measureText(text).width;
  if (w > 960) { g.font = font.replace(/\d+px/, m => Math.floor(parseInt(m) * 960 / w) + 'px'); }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  for (const [blur, lw, col] of [[40, 14, color], [18, 8, color], [0, 3.5, '#fff']]) {
    g.shadowColor = color; g.shadowBlur = blur; g.strokeStyle = col; g.lineWidth = lw; g.strokeText(text, 512, 128);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function radial(stops) {
  const [c, g] = cv(256); const gr = g.createRadialGradient(128, 128, 4, 128, 128, 128);
  stops.forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function starWindow() {
  const [c, g] = cv(512); g.fillStyle = '#02030a'; g.fillRect(0, 0, 512, 512);
  const gr = g.createRadialGradient(360, 330, 10, 360, 330, 240); gr.addColorStop(0, 'rgba(120,60,200,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${R(0.3, 1)})`; g.fillRect(R(0, 512), R(0, 512), R(1, 2.6), R(1, 2.6)); }
  const pg = g.createRadialGradient(130, 150, 10, 150, 170, 90); pg.addColorStop(0, '#f0c090'); pg.addColorStop(0.7, '#a04a20'); pg.addColorStop(1, '#2a0a04');
  g.fillStyle = pg; g.beginPath(); g.arc(150, 170, 90, 0, TAU); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------- the room
export function buildRoom(id) {
  const C = ROOMS[id] || ROOMS.space;
  const room = new THREE.Group(), anim = [];
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1, roughness: 0.18 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc8962e, metalness: 1, roughness: 0.3 });
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, ...o });
  const add = (geo, m, x, y, z, o = {}) => {
    const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z);
    if (o.rx) mesh.rotation.x = o.rx; if (o.ry) mesh.rotation.y = o.ry; if (o.rz) mesh.rotation.z = o.rz;
    (o.parent || room).add(mesh); return mesh;
  };

  // floor, ceiling, contact shadow
  const floorC = pattern(C.floor);
  add(new THREE.PlaneGeometry(SIDE * 2, FRONT - BACK), mat(tex(floorC, 12, 9), { rough: 0.7, glow: 0.16 }), 0, FLOOR, (FRONT + BACK) / 2, { rx: -Math.PI / 2 });
  add(new THREE.PlaneGeometry(SIDE * 2, FRONT - BACK), std(C.ceil, { emissive: C.ceil, emissiveIntensity: 0.3 }), 0, CEIL, (FRONT + BACK) / 2, { rx: Math.PI / 2 });
  add(new THREE.PlaneGeometry(26, 34), new THREE.MeshBasicMaterial({ map: radial([[0, 'rgba(0,0,0,0.85)'], [0.55, 'rgba(0,0,0,0.5)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }),
    0, FLOOR + 0.05, 1.5, { rx: -Math.PI / 2 });

  // walls: lower panelling up to the chair rail, pattern above
  const RAIL = FLOOR + 30, wpH = CEIL - RAIL, lowH = RAIL - FLOOR;
  const upC = pattern(C.wall), lowC = pattern(C.lower);
  for (const [x, z, w, ry] of [[0, BACK, SIDE * 2, 0], [-SIDE, (FRONT + BACK) / 2, FRONT - BACK, Math.PI / 2],
    [SIDE, (FRONT + BACK) / 2, FRONT - BACK, -Math.PI / 2], [0, FRONT, SIDE * 2, Math.PI]]) {
    add(new THREE.PlaneGeometry(w, wpH), mat(tex(upC, w / 15, wpH / 15), { glow: 0.13, rough: 0.9 }), x, RAIL + wpH / 2, z, { ry });
    add(new THREE.PlaneGeometry(w, lowH), mat(tex(lowC, w / 26, 1), { rough: 0.55, glow: 0.18 }), x, FLOOR + lowH / 2, z, { ry });
    add(new THREE.BoxGeometry(w, 1.2, 0.8), std(0x2a160a, { roughness: 0.5 }), x, RAIL, z, { ry }).translateZ(0.4);
    add(new THREE.BoxGeometry(w, 2, 0.6), std(0x1a0e08), x, FLOOR + 1, z, { ry }).translateZ(0.3);
  }

  // neon signs
  const fonts = ['italic 700 150px "Brush Script MT", "Snell Roundhand", cursive', '700 140px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif', '900 160px "Arial Black", sans-serif'];
  const spots = [[0, 30, 32, 8], [BAR_X, 31, 26, 6.5], [-26, 10, 11, 3.6]];
  C.neon.forEach(([text, color], i) => {
    const m = new THREE.MeshBasicMaterial({ map: neonTex(text, fonts[i], color), transparent: true, depthWrite: false, toneMapped: false });
    m.color.setScalar(1.5);
    const [x, y, w, h] = spots[i]; add(new THREE.PlaneGeometry(w, h), m, x, y, BACK + 0.3);
    anim.push(t => { m.color.setScalar(1.35 + 0.15 * Math.sin(t * (2 + i)) + (Math.random() < 0.004 ? -0.8 : 0)); });
  });

  // ---- bar: counter, stools, back shelf with bottles, pendant lamps
  const counterWood = mat(tex(pattern(C.lower), 4, 1), { rough: 0.5, glow: 0.18 });
  const top = new THREE.MeshPhysicalMaterial({ color: C.top, roughness: 0.25, clearcoat: 1 });
  add(new THREE.BoxGeometry(40, 30, 5), counterWood, BAR_X, FLOOR + 15, -4);
  add(new THREE.BoxGeometry(41.5, 1, 7), top, BAR_X, FLOOR + 30.5, -4.5);
  add(new THREE.CylinderGeometry(0.35, 0.35, 40, 12), chrome, BAR_X, FLOOR + 3, -1.2, { rz: Math.PI / 2 });
  const vinyl = new THREE.MeshPhysicalMaterial({ color: C.vinyl, roughness: 0.35, clearcoat: 0.6 });
  for (const x of [BAR_X - 12, BAR_X - 3, BAR_X + 6, BAR_X + 15]) {
    add(new THREE.CylinderGeometry(0.5, 0.5, 20, 12), chrome, x, FLOOR + 10, 7);
    add(new THREE.CylinderGeometry(3.6, 3.6, 0.4, 24), chrome, x, FLOOR + 0.2, 7);
    add(new THREE.TorusGeometry(2.4, 0.22, 8, 24), chrome, x, FLOOR + 7, 7, { rx: Math.PI / 2 });
    add(new THREE.CylinderGeometry(3.2, 3, 1.8, 28), vinyl, x, FLOOR + 21, 7);
  }
  // glasses + a shaker on the counter
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, thickness: 0.3, transparent: true, opacity: 0.55 });
  for (const [x, z] of [[BAR_X - 6, -3.5], [BAR_X + 4, -4.2], [BAR_X + 10, -3.2]]) add(new THREE.CylinderGeometry(0.8, 0.6, 2.2, 16), glassMat, x, FLOOR + 32.1, z);
  add(new THREE.CylinderGeometry(0.7, 0.85, 3.2, 16), chrome, BAR_X + 14, FLOOR + 32.6, -5);

  add(new THREE.PlaneGeometry(38, 20), new THREE.MeshStandardMaterial({ color: 0x8a7a6a, metalness: 1, roughness: 0.15 }), BAR_X, 14, BACK + 0.2);
  const shelfMat = std(0x2a1608, { roughness: 0.5 });
  const bottleGeo = new THREE.CylinderGeometry(0.9, 0.9, 1, 12); bottleGeo.translate(0, 0.5, 0);
  const neckGeo = new THREE.CylinderGeometry(0.28, 0.5, 1, 8); neckGeo.translate(0, 0.5, 0);
  const bottleMat = new THREE.MeshPhysicalMaterial({ roughness: 0.08, clearcoat: 1, emissive: 0x111111 });
  const cols = [0x2a7a2a, 0xb8601a, 0x6a1a10, 0xd8c070, 0x1a3a7a, 0xe0e0e0, 0x8a3a8a, 0xc89a2a];
  const bottles = new THREE.InstancedMesh(bottleGeo, bottleMat, 32), necks = new THREE.InstancedMesh(neckGeo, bottleMat, 32);
  const m4 = new THREE.Matrix4(), col = new THREE.Color(); let n = 0;
  for (const [sy, i0] of [[6, 0], [15, 1]]) {
    add(new THREE.BoxGeometry(38, 0.6, 3.5), shelfMat, BAR_X, sy, BACK + 1.75);
    for (let i = 0; i < 16; i++) {
      const h = 3.2 + ((i * 7 + i0 * 3) % 5) * 0.5, x = BAR_X - 17 + i * 2.25;
      col.set(cols[(i * 3 + i0) % cols.length]);
      m4.makeScale(1, h, 1).setPosition(x, sy + 0.3, BACK + 1.8); bottles.setMatrixAt(n, m4); bottles.setColorAt(n, col);
      m4.makeScale(1, 1.8, 1).setPosition(x, sy + 0.3 + h, BACK + 1.8); necks.setMatrixAt(n, m4); necks.setColorAt(n++, col);
    }
  }
  room.add(bottles, necks);
  const globe = std(C.globe, { emissive: C.globe, emissiveIntensity: 1.0, roughness: 0.4 });
  for (const x of [BAR_X - 4, BAR_X + 10, BAR_X + 24]) {
    add(new THREE.CylinderGeometry(0.08, 0.08, CEIL - 26, 6), chrome, x, (CEIL + 26) / 2, -4);
    add(new THREE.SphereGeometry(2.2, 24, 16), globe, x, 24, -4);
  }
  const barLight = new THREE.PointLight(C.light, 130, 60, 2); barLight.position.set(BAR_X + 6, 20, -2); room.add(barLight);

  // ---- the bartender
  // she stands at the near end of the counter, one hand resting on it
  const lady = buildBartender(C.lady);
  lady.position.set(BAR_X - 27.5, FLOOR, -6.5); lady.rotation.y = -0.42; room.add(lady);
  const restAt = new THREE.Vector3(BAR_X - 18.4, FLOOR + 31.7, -4.6);
  anim.push(t => { lady.userData.counter = room.localToWorld(restAt.clone()); lady.userData.update(t); });

  // ---- decor on the left side
  for (const d of C.decor) {
    const [kind, arg] = d.split(':'), color = arg ? +arg : 0;
    if (kind === 'mirror') {
      const g = new THREE.Group(); g.position.set(-44, 24, BACK + 0.6); room.add(g);
      add(new THREE.CircleGeometry(4.2, 40), new THREE.MeshStandardMaterial({ color: 0x9ab4bc, metalness: 0.5, roughness: 0.08, emissive: 0x1a2a30 }), 0, 0, 0.35, { parent: g });
      add(new THREE.TorusGeometry(4.4, 0.4, 10, 40), brass, 0, 0, 0.3, { parent: g });
      for (let i = 0; i < 24; i++) {
        const a = i / 24 * TAU, len = i % 2 ? 4 : 6.5;
        add(new THREE.BoxGeometry(len, 0.35, 0.25), brass, Math.cos(a) * (4.8 + len / 2), Math.sin(a) * (4.8 + len / 2), 0.15, { parent: g, rz: a });
      }
    } else if (kind === 'window') {
      const g = new THREE.Group(); g.position.set(-44, 24, BACK + 0.4); room.add(g);
      add(new THREE.CircleGeometry(8, 48), new THREE.MeshBasicMaterial({ map: starWindow() }), 0, 0, 0.1, { parent: g });
      add(new THREE.TorusGeometry(8.3, 0.8, 12, 48), std(0x6a7480, { metalness: 0.9, roughness: 0.3 }), 0, 0, 0.3, { parent: g });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; add(new THREE.SphereGeometry(0.35, 8, 6), chrome, Math.cos(a) * 8.3, Math.sin(a) * 8.3, 1, { parent: g }); }
    } else if (kind === 'wheel') {
      const g = new THREE.Group(); g.position.set(-44, 24, BACK + 0.8); room.add(g);
      const wood = std(0x5a3216, { roughness: 0.5 });
      add(new THREE.TorusGeometry(6, 0.6, 10, 40), wood, 0, 0, 0, { parent: g });
      add(new THREE.CylinderGeometry(1.4, 1.4, 1, 20), wood, 0, 0, 0, { parent: g, rx: Math.PI / 2 });
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU;
        add(new THREE.CylinderGeometry(0.3, 0.3, 10, 8), wood, Math.cos(a) * 5, Math.sin(a) * 5, 0, { parent: g, rz: a - Math.PI / 2 });
        add(new THREE.CylinderGeometry(0.45, 0.3, 2.4, 8), wood, Math.cos(a) * 8.2, Math.sin(a) * 8.2, 0, { parent: g, rz: a - Math.PI / 2 });
      }
    } else if (kind === 'clock') {
      const g = new THREE.Group(); g.position.set(-44, 24, BACK + 0.6); room.add(g);
      add(new THREE.CylinderGeometry(5.5, 5.5, 0.8, 40), std(0xf6ead2, { emissive: 0x302a20 }), 0, 0, 0, { parent: g, rx: Math.PI / 2 });
      add(new THREE.TorusGeometry(5.6, 0.5, 10, 40), chrome, 0, 0, 0.3, { parent: g });
      const h1 = add(new THREE.BoxGeometry(0.4, 3.2, 0.2), std(0x111111), 0, 1.4, 0.6, { parent: g });
      const hand = new THREE.Group(); hand.position.z = 0.7; g.add(hand);
      add(new THREE.BoxGeometry(0.25, 4.6, 0.2), std(0xd0102a), 0, 2, 0, { parent: hand });
      h1.rotation.z = -1; h1.position.set(Math.sin(1) * 1.4, Math.cos(1) * 1.4, 0.6);
      anim.push(t => { hand.rotation.z = -t * 0.5; });
    } else if (kind === 'armchair') {
      const g = new THREE.Group(); g.position.set(-62, FLOOR, -10); g.rotation.y = 0.45; room.add(g);
      const seat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.6, sheen: 1, sheenColor: 0xffffff });
      add(new RoundedBox(16, 7, 14), seat, 0, 5.5, 0, { parent: g });
      add(new RoundedBox(16, 15, 4), seat, 0, 12, -5, { parent: g });
      for (const s of [-1, 1]) add(new RoundedBox(3, 10, 14), seat, s * 7.5, 7, 0, { parent: g });
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(new THREE.CylinderGeometry(0.4, 0.3, 2, 8), chrome, sx * 7, 1, sz * 6, { parent: g });
    } else if (['lava', 'lamp', 'lantern', 'torch', 'coil'].includes(kind)) {
      const g = new THREE.Group(); g.position.set(-40, FLOOR, -17); room.add(g);
      const tulip = new THREE.MeshPhysicalMaterial({ color: 0xa89878, roughness: 0.3, clearcoat: 1 });
      if (kind !== 'torch') {
        add(new THREE.CylinderGeometry(4.5, 4.5, 0.8, 32), tulip, 0, 20, 0, { parent: g });
        add(new THREE.CylinderGeometry(0.8, 1.6, 19.6, 16), tulip, 0, 10, 0, { parent: g });
        add(new THREE.CylinderGeometry(3.5, 3.5, 0.6, 28), tulip, 0, 0.3, 0, { parent: g });
      }
      const lightCol = kind === 'lava' ? color : kind === 'lamp' ? color : kind === 'coil' ? 0x7ac8ff : 0xffa040;
      if (kind === 'lava') {
        add(new THREE.CylinderGeometry(0.6, 1.4, 2.4, 16), chrome, 0, 21.6, 0, { parent: g });
        add(new THREE.CylinderGeometry(1.2, 0.6, 6, 16), std(color, { emissive: color, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 }), 0, 25.8, 0, { parent: g });
        add(new THREE.CylinderGeometry(0.4, 1.2, 1.6, 16), chrome, 0, 29.6, 0, { parent: g });
        const blobMat = std(0xffd040, { emissive: 0xffa020, emissiveIntensity: 1.4 });
        const blobs = [0, 1, 2, 3].map(() => add(new THREE.SphereGeometry(R(0.35, 0.6), 12, 8), blobMat, 0, 24, 0, { parent: g }));
        anim.push(t => blobs.forEach((b, i) => b.position.set(Math.sin(t * 0.3 + i * 2) * 0.35, 24 + 3.4 * (0.5 + 0.5 * Math.sin(t * 0.22 + i * 1.7)), Math.cos(t * 0.27 + i) * 0.3)));
      } else if (kind === 'lamp') {
        add(new THREE.CylinderGeometry(0.4, 1.2, 5, 12), brass, 0, 23, 0, { parent: g });
        add(new THREE.CylinderGeometry(2, 3.6, 4, 24, 1, true), std(color, { emissive: color, emissiveIntensity: 0.8, side: THREE.DoubleSide }), 0, 27, 0, { parent: g });
      } else if (kind === 'coil') {
        add(new THREE.CylinderGeometry(1, 1, 7, 16), std(0xb87333, { metalness: 1, roughness: 0.35 }), 0, 24, 0, { parent: g });
        add(new THREE.SphereGeometry(1.8, 20, 12), chrome, 0, 28.6, 0, { parent: g });
        const arc = add(new THREE.SphereGeometry(2.6, 12, 8), new THREE.MeshBasicMaterial({ color: 0x9ad8ff, transparent: true, opacity: 0.3, wireframe: true }), 0, 28.6, 0, { parent: g });
        anim.push(t => { arc.rotation.set(t * 3, t * 5, 0); arc.material.opacity = Math.random() < 0.15 ? 0.7 : 0.15; });
      } else {   // lantern or tiki torch
        if (kind === 'torch') add(new THREE.CylinderGeometry(0.5, 0.7, 30, 10), std(0x6a4a20), 0, 15, 0, { parent: g });
        const by = kind === 'torch' ? 30 : 20.4;
        if (kind === 'lantern') {
          add(new THREE.BoxGeometry(3, 4.4, 3), std(0xffc060, { emissive: 0xff9a2a, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 }), 0, by + 2.4, 0, { parent: g });
          add(new THREE.ConeGeometry(2.4, 1.6, 4), std(0x1a1a1a, { metalness: 0.6 }), 0, by + 5.4, 0, { parent: g, ry: Math.PI / 4 });
        }
        const flame = add(new THREE.ConeGeometry(kind === 'torch' ? 1.1 : 0.5, kind === 'torch' ? 3.2 : 1.4, 10), std(0xffa020, { emissive: 0xff7a10, emissiveIntensity: 2.5 }), 0, by + (kind === 'torch' ? 2 : 2.4), 0, { parent: g });
        anim.push(t => { flame.scale.set(1, 0.85 + 0.25 * Math.abs(Math.sin(t * 9) * Math.sin(t * 13.7)), 1); });
      }
      const pl = new THREE.PointLight(lightCol, 50, 28, 2); pl.position.set(0, 27, 2); g.add(pl);
      anim.push(t => { pl.intensity = kind === 'lava' || kind === 'lamp' ? 45 : 35 + 18 * Math.sin(t * 11) * Math.sin(t * 7.3); });
    } else if (kind === 'plant' || kind === 'plant2') {
      const g = new THREE.Group(); g.position.set(kind === 'plant' ? -24 : -78, FLOOR, kind === 'plant' ? -19 : -14); room.add(g);
      add(new THREE.CylinderGeometry(3, 2.2, 6, 20), std(0x8a4a2a, { roughness: 0.5 }), 0, 3, 0, { parent: g });
      add(new THREE.CylinderGeometry(0.5, 0.7, 18, 8), std(0x6a4a2a), 0, 15, 0, { parent: g });
      const leafMat = std(0x2a7a2a, { side: THREE.DoubleSide, emissive: 0x0a2a0a });
      const leaves = [];
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU, leaf = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 11, 1, 4), leafMat);
        const pos = leaf.geometry.attributes.position;
        for (let k = 0; k < pos.count; k++) { const y = pos.getY(k); pos.setX(k, pos.getX(k) * (1 - Math.abs(y) / 6)); pos.setZ(k, -((y + 5.5) ** 2) * 0.06); }
        leaf.geometry.computeVertexNormals();
        const piv = new THREE.Group(); piv.position.set(0, 23, 0); piv.rotation.y = a; g.add(piv);
        leaf.position.set(0, 0, 5); leaf.rotation.x = -1.2; piv.add(leaf); leaves.push(piv);
      }
      anim.push(t => leaves.forEach((l, i) => { l.rotation.z = Math.sin(t * 0.7 + i) * 0.03; }));
    } else if (kind === 'barrels' || kind === 'barrels2') {
      const wood = std(0x6a4020, { roughness: 0.6 }), hoop = std(0x2a2a2a, { metalness: 0.7, roughness: 0.4 });
      const list = kind === 'barrels' ? [[-62, -14, 0], [-52, -18, 0], [-57, -16, 1]] : [[-30, -19, 0], [-78, -6, 0]];
      for (const [x, z, stacked] of list) {
        const y = stacked ? FLOOR + 21 : FLOOR + 6.5;
        if (stacked) { add(new THREE.CylinderGeometry(5, 5, 13, 20), wood, x, FLOOR + 17, z - 2, { rx: Math.PI / 2 }); continue; }
        add(new THREE.CylinderGeometry(5, 5, 13, 20), wood, x, y, z);
        add(new THREE.SphereGeometry(5.6, 20, 10), wood, x, y, z).scale.set(1, 1.05, 1);
        for (const dy of [-5, -1.5, 1.5, 5]) add(new THREE.TorusGeometry(Math.abs(dy) > 3 ? 5.15 : 5.75, 0.25, 6, 28), hoop, x, y + dy, z, { rx: Math.PI / 2 });
      }
    } else if (kind === 'pumpkins') {
      const pm = std(0xff7a1a, { emissive: 0xff5a00, emissiveIntensity: 0.35, roughness: 0.5 });
      for (const [x, z, s] of [[-28, -18, 1.3], [-33, -12, 0.9], [-72, -18, 1.1]]) {
        const p = add(new THREE.SphereGeometry(3 * s, 20, 12), pm, x, FLOOR + 2.6 * s, z); p.scale.y = 0.78;
        add(new THREE.CylinderGeometry(0.3 * s, 0.4 * s, 1.4 * s, 6), std(0x3a5a1a), x, FLOOR + 5.2 * s, z);
        for (const ex of [-1, 1]) add(new THREE.ConeGeometry(0.6 * s, 0.9 * s, 3), new THREE.MeshBasicMaterial({ color: 0xffe060 }), x + ex * 1 * s, FLOOR + 3 * s, z + 2.85 * s, { rx: Math.PI / 2 });
      }
    } else if (kind === 'disco') {
      const ball = add(new THREE.IcosahedronGeometry(3.4, 2), new THREE.MeshStandardMaterial({ color: 0x9a9a9a, metalness: 1, roughness: 0.12, flatShading: true }), -26, 36, 16);
      add(new THREE.CylinderGeometry(0.06, 0.06, CEIL - 39.4, 4), chrome, -26, (CEIL + 39.4) / 2, 16);
      anim.push(t => { ball.rotation.y = t * 0.25; });
    }
  }

  room.userData.update = t => anim.forEach(f => f(t));
  return room;
}

// soft-edged box (no addon needed)
function RoundedBox(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d, 6, 6, 6), p = g.attributes.position, v = new THREE.Vector3(), r = Math.min(w, h, d) * 0.25;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const ix = Math.max(Math.abs(v.x) - (w / 2 - r), 0) * Math.sign(v.x), iy = Math.max(Math.abs(v.y) - (h / 2 - r), 0) * Math.sign(v.y), iz = Math.max(Math.abs(v.z) - (d / 2 - r), 0) * Math.sign(v.z);
    const inner = new THREE.Vector3(v.x - ix, v.y - iy, v.z - iz), off = new THREE.Vector3(ix, iy, iz);
    if (off.lengthSq() > 0) { off.setLength(r); p.setXYZ(i, inner.x + off.x, inner.y + off.y, inner.z + off.z); }
  }
  g.computeVertexNormals(); return g;
}

// ---------------------------------------------------------------- bartender: full figure, IK-driven arms and legs, high heels
const DOWN = new THREE.Vector3(0, -1, 0);
// tapered limb along -y (length L), radii sampled along the bone (top → bottom)
function limbGeo(L, radii, seg = 20) {
  const pts = radii.map((r, i) => new THREE.Vector2(Math.max(r, 0.01), -L + L * (radii.length - 1 - i) / (radii.length - 1))).sort((a, b) => a.y - b.y);
  pts.unshift(new THREE.Vector2(0.01, pts[0].y - Math.min(radii.at(-1), 0.4) * 0.6)); pts.push(new THREE.Vector2(0.01, Math.min(radii[0] * 0.5, 0.8)));
  return new THREE.LatheGeometry(pts, seg);
}
// two-bone IK: shoulder S → target T with bone lengths a, b; elbow bends towards `pole`
const _d = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Vector3(), _t = new THREE.Vector3();
function solveIK(S, T, a, b, pole, bone1, bone2, end) {
  _d.subVectors(T, S); const len = THREE.MathUtils.clamp(_d.length(), Math.abs(a - b) + 0.01, a + b - 0.01); _d.normalize();
  const cosA = THREE.MathUtils.clamp((a * a + len * len - b * b) / (2 * a * len), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
  _p.copy(pole).addScaledVector(_d, -pole.dot(_d)).normalize();
  _e.copy(S).addScaledVector(_d, a * cosA).addScaledVector(_p, a * sinA);
  _t.copy(S).addScaledVector(_d, len);
  bone1.position.copy(S); bone1.quaternion.setFromUnitVectors(DOWN, _p.subVectors(_e, S).normalize());
  bone2.position.copy(_e); bone2.quaternion.setFromUnitVectors(DOWN, _p.subVectors(_t, _e).normalize());
  if (end) { end.position.copy(_t); end.quaternion.copy(bone2.quaternion); }
}

function buildBartender(L) {
  const root = new THREE.Group();
  const phys = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, ...o });
  const skinC = new THREE.Color(L.skin).multiplyScalar(0.86);
  const skin = phys(skinC, { roughness: 0.48, sheen: 0.25, sheenColor: 0xffb8a0, sheenRoughness: 0.7 });
  const nylon = phys(L.legs ? new THREE.Color(L.legs) : skinC.clone().multiplyScalar(0.88), { roughness: 0.32, sheen: 0.8, sheenColor: 0xffe0d0, clearcoat: 0.15 });
  const hair = phys(L.hair, { roughness: 0.38, sheen: 1, sheenColor: new THREE.Color(L.hair).lerp(new THREE.Color(0xffffff), 0.35), side: THREE.DoubleSide });
  const blouse = phys(new THREE.Color(L.blouse).multiplyScalar(0.62), { roughness: 0.75 });
  const vest = L.vest && phys(L.vest, { roughness: 0.45, side: THREE.DoubleSide, clearcoat: 0.2 });
  const skirt = phys(L.skirt || '#141414', { roughness: 0.5, clearcoat: 0.25, side: THREE.DoubleSide });
  const shoe = phys(L.shoes || '#111111', { roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe0b040, metalness: 1, roughness: 0.25 });
  const mk = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
  const lathe = (pts, m, parent, y = 0, sz = 1, phi0 = 0, phiL = TAU) => { const o = mk(new THREE.LatheGeometry(pts.map(([r, yy]) => new THREE.Vector2(r, yy)), 40, phi0, phiL), m, 0, y, 0, parent); o.scale.z = sz; return o; };

  // heights (units from the floor): heel 2.2, ankle 4.6, knee 15.6, hip joint 26.4, waist 32, shoulders 41.6
  const HEEL = 2.2, ANKLE = 4.6, HIPY = 26.4, THIGH = 10.75, CALF = 10.7;
  const pelvis = new THREE.Group(); pelvis.position.set(0, HIPY, 0); root.add(pelvis);
  // pencil skirt from waist to just above the knee
  lathe([[0.01, -9.6], [4.1, -9.5], [4.45, -7], [4.95, -3.5], [5.1, -1.2], [4.8, 2], [3.75, 4.6], [3.6, 5.7], [0.01, 5.8]], skirt, pelvis, 0, 0.74);
  const chest = new THREE.Group(); chest.position.set(0, 5.6, 0); pelvis.add(chest);
  // torso: waist → shoulders, elliptical cross-section
  const torso = lathe([[3.55, 0], [3.5, 1.2], [3.75, 2.6], [4.15, 4.2], [4.35, 5.6], [4.45, 7.2], [4.4, 8.4], [3.9, 9.3], [2.4, 9.9], [1.2, 10.15], [0.01, 10.2]], blouse, chest, 0, 0.6);
  for (const s of [-1, 1]) { const b = mk(new THREE.SphereGeometry(1.6, 24, 18), blouse, s * 1.55, 5.6, 0.95, chest); b.scale.set(1, 0.92, 0.72); }
  if (vest) {
    lathe([[3.68, 0], [3.66, 1.2], [3.9, 2.6], [4.3, 4.2], [4.52, 5.6], [4.62, 7.2], [4.55, 8.4], [4.0, 9.3]], vest, chest, 0, 0.63, 0.62, TAU - 1.24);
    for (const y of [1.2, 2.6, 4]) mk(new THREE.SphereGeometry(0.17, 8, 6), gold, 0.0, y, 2.35, chest).position.x = 1.2 - y * 0.12;
  }
  const belt = lathe([[3.62, -0.35], [3.62, 0.35]], new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.35 }), chest, 0, 0.62);
  for (const s of [-1, 1]) mk(new THREE.SphereGeometry(1.32, 20, 14), blouse, s * 4.55, 9.05, -0.1, chest).scale.set(1, 0.85, 0.9);   // shoulders
  // collar / neck / accessory
  const neck = lathe([[1.25, 0], [1.12, 1.0], [1.05, 2.4]], skin, chest, 9.6); neck.position.z = 0.1;
  if (!vest || L.acc === 'pearls') lathe([[1.5, 0], [1.3, 0.6], [1.12, 0.9]], blouse, chest, 9.7, 0.9, 0.9, TAU - 1.8);
  if (L.acc === 'pearls') for (let i = 0; i < 18; i++) { const a = i / 17 * Math.PI * 1.1 - Math.PI * 0.05; mk(new THREE.SphereGeometry(0.2, 10, 8), phys(0xfff8f0, { roughness: 0.15, sheen: 1 }), Math.cos(a) * 1.55, 9.6 - Math.sin(a) * 0.9, Math.sin(a) * 1.15 + 0.15, chest); }
  else if (L.acc === 'star' || L.acc === 'badge') { const b = mk(new THREE.CircleGeometry(0.55, L.acc === 'star' ? 5 : 3), new THREE.MeshStandardMaterial({ color: 0xffd040, metalness: 1, roughness: 0.25, side: THREE.DoubleSide }), -2.2, 7.6, 2.3, chest); b.rotation.set(-0.2, -0.35, 0); }
  else { const bt = new THREE.Group(); bt.position.set(0, 9.85, 1.05); chest.add(bt); const bm = new THREE.MeshStandardMaterial({ color: vest ? 0x111111 : L.lips, roughness: 0.4 });
    for (const s of [-1, 1]) { const w = mk(new THREE.ConeGeometry(0.38, 0.9, 4), bm, s * 0.45, 0, 0, bt); w.rotation.z = s * Math.PI / 2; } mk(new THREE.SphereGeometry(0.2, 8, 6), bm, 0, 0, 0.08, bt); }

  // ---- head
  const head = new THREE.Group(); head.position.set(0, 13.95, 0.25); chest.add(head);
  const skull = lathe([[0.01, -3.25], [0.9, -3.15], [1.55, -2.75], [2.05, -2.0], [2.35, -1.1], [2.55, -0.1], [2.68, 0.9], [2.62, 1.8], [2.25, 2.65], [1.45, 3.2], [0.01, 3.4]], skin, head);
  skull.scale.set(0.8, 0.96, 1);
  const eyeW = phys(0xf2ece6, { roughness: 0.15, clearcoat: 1 }), iris = new THREE.MeshStandardMaterial({ color: L.eyes || '#4a2c16', roughness: 0.2 });
  const lids = [];
  for (const s of [-1, 1]) {
    const eg = new THREE.Group(); eg.position.set(s * 0.8, 0.55, 2.27); head.add(eg);
    mk(new THREE.SphereGeometry(0.42, 18, 12), eyeW, 0, 0, 0, eg).scale.set(1, 0.64, 0.5);
    mk(new THREE.SphereGeometry(0.23, 14, 10), iris, 0.02 * -s, -0.01, 0.16, eg).scale.set(1, 1, 0.45);
    mk(new THREE.SphereGeometry(0.06, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.06, 0.07, 0.27, eg);
    const lid = new THREE.Group(); eg.add(lid);
    mk(new THREE.SphereGeometry(0.43, 18, 8, 0, TAU, 0, Math.PI * 0.5), skin, 0, 0, 0, lid).scale.set(1.02, 0.7, 0.62);
    mk(new THREE.TorusGeometry(0.4, 0.045, 4, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x140a08 }), 0, 0.02, 0.12, lid).scale.set(1.05, 0.62, 1);
    lid.rotation.x = -0.35; lids.push(lid);
    const brow = mk(new THREE.TorusGeometry(0.55, 0.055, 4, 14, Math.PI * 0.75), hair, s * 0.82, 1.1, 2.38, head);
    brow.rotation.z = Math.PI * 0.12; brow.scale.set(1, 0.42, 1);
    mk(new THREE.SphereGeometry(0.42, 10, 8), skin, s * 2.08, 0.25, -0.2, head).scale.set(0.35, 1, 0.65);   // ears
    mk(new THREE.SphereGeometry(0.13, 8, 6), gold, s * 2.14, -0.4, -0.15, head);                          // earrings
  }
  mk(new THREE.SphereGeometry(0.3, 12, 10), skin, 0, 0.05, 2.47, head).scale.set(0.72, 1.55, 0.72);     // nose bridge
  mk(new THREE.SphereGeometry(0.28, 12, 10), skin, 0, -0.45, 2.62, head).scale.set(1.1, 0.8, 0.8);    // nose tip
  const lipM = phys(L.lips, { roughness: 0.3, clearcoat: 0.6 });
  mk(new THREE.SphereGeometry(0.5, 16, 10), lipM, 0, -1.22, 2.36, head).scale.set(1.05, 0.26, 0.45);
  const lowLip = mk(new THREE.SphereGeometry(0.5, 16, 10), lipM, 0, -1.45, 2.3, head); lowLip.scale.set(0.95, 0.3, 0.48);

  // hair: crown + sides/back, then style
  const hp = (y0, y1, rr) => rr.map(([r, y]) => [r, y]).filter(([, y]) => y >= y0 && y <= y1);
  const crown = lathe([[2.85, 1.6], [2.78, 2.2], [2.4, 2.95], [1.6, 3.5], [0.01, 3.72]], hair, head, 0, 1.02); crown.scale.x = 0.86; crown.position.z = -0.1;
  const lenBack = { long: -10, bob: -2.4, ponytail: -0.4, bun: -0.4, victory: -1.4, afro: 0 }[L.style] ?? -0.4;
  const backPts = [[2.85, 1.65], [2.95, 0.6], [2.85, -0.6], [2.55, -1.6]];
  if (lenBack < -2) backPts.push([2.7, -2.4]);
  if (lenBack < -3) backPts.push([3.1, -4], [3.35, -6.5], [3.0, -9], [2.2, -10]);
  const back = lathe(backPts.map(([r, y]) => [r, y]), hair, head, 0, 1.0, 0.95, TAU - 1.9); back.scale.x = 0.88; back.position.z = -0.12;
  // side-swept fringe
  const fr = mk(new THREE.SphereGeometry(2.8, 28, 10, -0.9, 1.9, Math.PI * 0.16, Math.PI * 0.2), hair, 0, 0.75, -0.05, head); fr.scale.set(0.86, 1.05, 1.02); fr.rotation.z = -0.12;
  let tail = null;
  if (L.style === 'ponytail') {
    tail = new THREE.Group(); tail.position.set(0, 2.2, -2.3); head.add(tail);
    mk(new THREE.TorusGeometry(0.45, 0.16, 6, 14), skirt, 0, 0, 0, tail).rotation.x = 1.2;
    mk(limbGeo(7, [0.75, 0.95, 0.85, 0.55, 0.15]), hair, 0, 0, -0.3, tail).rotation.x = 0.35;
  } else if (L.style === 'bun') mk(new THREE.SphereGeometry(1.15, 18, 14), hair, 0, 2.6, -2.0, head).scale.set(1, 0.9, 0.85);
  else if (L.style === 'afro') { const a = mk(new THREE.SphereGeometry(3.6, 28, 20), hair, 0, 1.5, -0.7, head); a.scale.set(1.08, 0.95, 0.95); }
  else if (L.style === 'victory') for (const s of [-1, 1]) { const r = mk(new THREE.TorusGeometry(0.85, 0.6, 12, 20), hair, s * 1.15, 2.95, 0.6, head); r.rotation.y = Math.PI / 2; }
  else if (L.style === 'long') {   // locks falling over the shoulders at the front
    for (const s of [-1, 1]) { const lk = mk(limbGeo(7.5, [0.9, 1.0, 0.95, 0.8, 0.4]), hair, s * 2.1, 0.6, 0.2, head); lk.rotation.set(-0.12, 0, s * 0.12); lk.scale.z = 0.6; }
  }
  if (L.acc === 'flower') { const fm = phys(0xff4a8a, { sheen: 1 }); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; mk(new THREE.SphereGeometry(0.45, 10, 6), fm, 2.2 + Math.cos(a) * 0.5, 1.6 + Math.sin(a) * 0.5, 0.4, head).scale.z = 0.4; } mk(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffe040 }), 2.25, 1.6, 0.6, head); }
  if (L.acc === 'bandana' || L.acc === 'headwrap' || L.acc === 'headband') {
    const col = L.acc === 'bandana' ? (L.style === 'victory' ? 0xd0102a : 0xa01818) : L.acc === 'headwrap' ? 0x1a7a3a : 0x2ad8ff;
    const b = mk(new THREE.TorusGeometry(2.5, L.acc === 'headband' ? 0.16 : 0.34, 8, 36), phys(col), 0, 2.2, -0.2, head); b.rotation.x = Math.PI / 2 - 0.4; b.scale.set(0.88, 1.05, 1);
    if (L.acc === 'headwrap') mk(new THREE.SphereGeometry(1.8, 18, 12), phys(col), 0, 3.6, -1.5, head).scale.set(1.1, 0.8, 1);
    if (L.acc === 'bandana' && L.style === 'victory') mk(new THREE.ConeGeometry(0.55, 1.1, 4), phys(col), 0, 3.85, 0.4, head);
  }
  if (L.acc === 'witch') {
    const hm = phys(0x1a0a24, { roughness: 0.7 });
    mk(new THREE.CylinderGeometry(4.6, 4.6, 0.18, 36), hm, 0, 2.8, -0.1, head);
    mk(new THREE.ConeGeometry(2.3, 6.5, 28), hm, 0.4, 6.0, -0.4, head).rotation.z = -0.15;
    mk(new THREE.TorusGeometry(2.35, 0.22, 6, 28), new THREE.MeshStandardMaterial({ color: 0x6aff2a, emissive: 0x2a6a0a }), 0, 3.1, -0.1, head).rotation.x = Math.PI / 2;
  }
  if (L.acc === 'goggles') for (const s of [-1, 1]) mk(new THREE.TorusGeometry(0.6, 0.2, 8, 16), new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1, roughness: 0.3 }), s * 0.85, 2.9, 1.5, head).rotation.x = -1.0;

  // ---- arms (children of the chest, posed by IK)
  const UA = 9.3, FA = 8.2;
  const arm = s => {
    const up = new THREE.Group(), fo = new THREE.Group(), hand = new THREE.Group(); chest.add(up, fo, hand);
    mk(limbGeo(UA, [1.3, 1.22, 1.08, 0.98, 0.92]), blouse, 0, 0, 0, up);
    mk(limbGeo(FA, [0.88, 0.92, 0.82, 0.66, 0.52]), skin, 0, 0, 0, fo);
    mk(limbGeo(FA * 0.18, [1.02, 1.0]), blouse, 0, 0, 0, fo);   // rolled-up cuff
    const palm = mk(new THREE.SphereGeometry(0.75, 14, 10), skin, 0, -0.9, 0, hand); palm.scale.set(0.95, 1.25, 0.45);
    const fingers = [];
    for (let i = 0; i < 4; i++) { const f = mk(limbGeo(1.7 - Math.abs(i - 1.5) * 0.25, [0.2, 0.17, 0.13]), skin, (i - 1.5) * 0.36, -1.85, 0.05, hand); f.rotation.x = 0.5; fingers.push(f); }
    const th = mk(limbGeo(1.3, [0.22, 0.16]), skin, -s * 0.65, -0.6, 0.25, hand); th.rotation.set(0.6, 0, -s * 0.7); fingers.push(th);
    return { up, fo, hand, fingers, S: new THREE.Vector3(s * 4.6, 8.8, -0.1), s };
  };
  const armR = arm(-1), armL = arm(1);
  // cocktail shaker in her right hand
  const shaker = new THREE.Group(); root.add(shaker);
  armR.fingers.forEach(f => { f.visible = false; });   // replaced by fingers wrapped around the shaker
  // fingers curled around the shaker (rings in shaker space; palm side = +x)
  for (const [y, arc, r] of [[-0.75, 1.25, 0.2], [-0.3, 1.3, 0.21], [0.15, 1.3, 0.21], [0.58, 1.2, 0.19]]) {
    const ring = mk(new THREE.TorusGeometry(0.78 + (0.0 - y) * 0.03 + 0.13, r, 8, 24, Math.PI * arc), skin, 0, y, 0, shaker); ring.rotation.x = -Math.PI / 2;
  }
  const thumb = mk(new THREE.TorusGeometry(0.98, 0.22, 8, 16, Math.PI * 0.55), skin, 0, 1.0, 0, shaker); thumb.rotation.set(Math.PI / 2, 0, 0);
  const steel = new THREE.MeshStandardMaterial({ color: 0xe8e8ec, metalness: 1, roughness: 0.15 });
  mk(new THREE.CylinderGeometry(0.85, 0.65, 3.4, 20), steel, 0, 0, 0, shaker);
  mk(new THREE.CylinderGeometry(0.7, 0.86, 1.2, 20), steel, 0, 2.2, 0, shaker);
  mk(new THREE.CylinderGeometry(0.3, 0.55, 0.8, 16), steel, 0, 3.2, 0, shaker);

  // ---- legs (children of root, posed by IK from the hip joints to fixed ankles) + high heels
  const leg = (s, ankle, yaw) => {
    const th = new THREE.Group(), ca = new THREE.Group(); root.add(th, ca);
    mk(limbGeo(THIGH, [2.05, 2.0, 1.85, 1.62, 1.38, 1.2]), nylon, 0, 0, 0, th);
    mk(limbGeo(CALF, [1.2, 1.3, 1.36, 1.18, 0.92, 0.72, 0.62]), nylon, 0, 0, 0, ca);
    const foot = new THREE.Group(); foot.position.set(ankle.x, 0, ankle.z); foot.rotation.y = yaw; root.add(foot);
    // foot: instep sloping down to the toes
    const instep = mk(new THREE.CapsuleGeometry(0.6, 3.4, 6, 14), nylon, 0, 2.4, 1.3, foot); instep.rotation.x = 2.25; instep.scale.x = 0.9;
    // pump: shell, pointed toe, sole and stiletto heel
    const shell = mk(new THREE.CapsuleGeometry(0.72, 3.8, 8, 16), shoe, 0, 1.45, 1.1, foot); shell.rotation.x = 1.98; shell.scale.set(0.95, 1, 0.7);
    const toe = mk(new THREE.SphereGeometry(0.75, 16, 12), shoe, 0, 0.45, 3.4, foot); toe.scale.set(0.9, 0.55, 1.45);
    const heelCup = mk(new THREE.SphereGeometry(0.8, 16, 12), shoe, 0, HEEL + 0.5, -1.25, foot); heelCup.scale.set(0.85, 0.95, 0.85);
    mk(new THREE.CylinderGeometry(0.28, 0.09, HEEL + 0.3, 12), shoe, 0, (HEEL + 0.3) / 2, -1.5, foot);
    mk(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 10), new THREE.MeshStandardMaterial({ color: 0x111111 }), 0, 0.04, -1.5, foot);
    return { th, ca, H: new THREE.Vector3(s * 2.0, -0.4, 0), A: ankle.clone().setY(ANKLE) };
  };
  const legs = [leg(1, new THREE.Vector3(1.6, 0, -0.3), -0.15), leg(-1, new THREE.Vector3(-2.4, 0, 1.7), 0.35)];

  // ---- animation
  const kneePole = new THREE.Vector3(0, 0, 1), hipW = new THREE.Vector3();
  const poleR = new THREE.Vector3(-0.5, -0.3, -1), poleL = new THREE.Vector3(0.6, 0, -1);
  const fDir = new THREE.Vector3(), nDir = new THREE.Vector3(), wrist = new THREE.Vector3(), cW = new THREE.Vector3(), palmC = new THREE.Vector3(), UPV = new THREE.Vector3(0, 1, 0);
  const ax = new THREE.Vector3(), az = new THREE.Vector3(), axx = new THREE.Vector3(), sx = new THREE.Vector3(), sz = new THREE.Vector3(), m4 = new THREE.Matrix4(), qHand = new THREE.Quaternion(), qShk = new THREE.Quaternion();
  const tR = new THREE.Vector3(), tL = new THREE.Vector3(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0);
  let blinkT = 2;
  root.userData.counter = null;   // world-space point where her left hand rests (set by the room)
  root.userData.update = t => {
    // weight shift between the legs, counter-rotating chest
    const w = Math.sin(t * 0.45);
    pelvis.position.set(0.45 + w * 0.35, HIPY - 0.15 - Math.abs(w) * 0.12, 0);
    pelvis.rotation.set(0, Math.sin(t * 0.3) * 0.05, -0.05 - w * 0.03);
    chest.rotation.set(0.02, -Math.sin(t * 0.3) * 0.04, 0.07 + w * 0.045);
    const br = Math.sin(t * 1.5); torso.scale.set(1 + br * 0.008, 1 + br * 0.006, 0.6 + br * 0.012);
    // head: looks around the bar, now and then at the player
    head.rotation.set(0.06 + Math.sin(t * 0.5) * 0.05, 0.3 + Math.sin(t * 0.37) * 0.38 + Math.sin(t * 0.11) * 0.18, Math.sin(t * 0.29) * 0.07 - 0.04);
    if (tail) tail.rotation.set(Math.sin(t * 1.3) * 0.06, 0, -head.rotation.y * 0.25);
    // right arm: every ~9 s she shakes a cocktail, otherwise holds the shaker at the waist
    const ph = t % 9, k = THREE.MathUtils.smoothstep(ph, 0, 0.6) * (1 - THREE.MathUtils.smoothstep(ph, 3.2, 3.9));
    const sh = Math.sin(t * 17) * k;
    tR.set(-3.4 + k * 1.2, 1.2 + k * (6.6 + sh * 1.1), 3.4 + k * (0.4 + sh * 0.6));
    solveIK(armR.S, tR, UA, FA, poleR, armR.up, armR.fo, armR.hand);
    root.updateMatrixWorld(true);
    // grip: palm turned inwards against the upright shaker, fingers wrapped around it
    armR.fo.getWorldQuaternion(qa); fDir.copy(DOWN).applyQuaternion(qa); fDir.y = 0;
    if (fDir.lengthSq() < 1e-4) fDir.set(0, 0, 1); fDir.normalize();
    nDir.crossVectors(UPV, fDir).normalize();
    armR.hand.getWorldPosition(wrist); chest.getWorldPosition(cW);
    if (nDir.dot(cW.sub(wrist)) < 0) nDir.negate();
    ax.copy(fDir).negate(); az.copy(nDir).negate(); axx.crossVectors(ax, az);
    m4.makeBasis(axx, ax, az); qHand.setFromRotationMatrix(m4);
    chest.getWorldQuaternion(qa); armR.hand.quaternion.copy(qa.invert().multiply(qHand));
    palmC.copy(wrist).addScaledVector(fDir, 0.85).addScaledVector(nDir, 1.12);
    sx.copy(nDir).negate(); sz.crossVectors(sx, UPV); m4.makeBasis(sx, UPV, sz); qShk.setFromRotationMatrix(m4);
    root.getWorldQuaternion(qa); shaker.quaternion.copy(qa.invert().multiply(qShk));
    shaker.position.copy(root.worldToLocal(palmC));
    // left hand rests on the counter
    if (root.userData.counter) { tL.copy(root.userData.counter); chest.worldToLocal(tL); solveIK(armL.S, tL, UA, FA, poleL, armL.up, armL.fo, armL.hand); armL.hand.rotateX(0.9); }
    // legs: feet stay planted
    for (const l of legs) { hipW.copy(l.H).applyMatrix4(pelvis.matrix); solveIK(hipW, l.A, THIGH, CALF, kneePole, l.th, l.ca); }
    // blink
    blinkT -= 1 / 60; const closed = blinkT < 0.13;
    lids.forEach(l => { l.rotation.x = closed ? 0.55 : -0.35; });
    if (blinkT < 0) blinkT = R(2, 5.5);
    lowLip.position.y = -1.45 - Math.max(0, Math.sin(t * 0.37)) * 0.04;
  };
  return root;
}

// ---------------------------------------------------------------- machine stand: lower cabinet, coin door, legs (moves with the machine)
export function buildStand(matCabinet, matTrim, zTop, zBot) {
  const g = new THREE.Group();
  const len = zBot - zTop + 1.4, zc = (zTop + zBot) / 2, BOT = -11;
  const body = new THREE.Mesh(new THREE.BoxGeometry(21.4, 7, len), matCabinet); body.position.set(0, -4 - 3.5, zc); g.add(body);
  const steel = new THREE.MeshStandardMaterial({ color: 0xc8c8cc, metalness: 1, roughness: 0.22 });
  const zf = zc + len / 2;
  const door = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.3), steel); door.position.set(0, -7.4, zf + 0.15); g.add(door);
  const slotMat = new THREE.MeshStandardMaterial({ color: 0xff2a1a, emissive: 0xff2a1a, emissiveIntensity: 2.2 });
  for (const x of [-1.8, 1.8]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.2), slotMat); s.position.set(x, -6.6, zf + 0.35); g.add(s);
    const ret = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0x202020, metalness: 0.8, roughness: 0.4 }));
    ret.position.set(x, -8.9, zf + 0.35); g.add(ret);
  }
  const legGeo = new THREE.BoxGeometry(1.4, BOT - (FLOOR + 0.6), 1.4);
  for (const sx of [-1, 1]) for (const z of [zTop + 0.6, zBot - 0.6]) {
    const x = sx * 9.9;
    const leg = new THREE.Mesh(legGeo, steel); leg.position.set(x, (BOT + FLOOR + 0.6) / 2, z); leg.castShadow = true; g.add(leg);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 3), steel); plate.position.set(x + sx * 0.8, BOT + 1.5, z); g.add(plate);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }));
    foot.position.set(x, FLOOR + 0.3, z); g.add(foot);
  }
  const t = new THREE.Mesh(new THREE.BoxGeometry(21.6, 0.25, len + 0.2), matTrim); t.position.set(0, BOT, zc); g.add(t);
  return g;
}
