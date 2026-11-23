import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Sound } from './sound.js?v=7';
import { THEMES } from './themes/index.js';
import {
  TABLE_X, Z_TOP, Z_BOT, BALL_R, GRAVITY, MAX_SPEED, LANE_X, LANE_FLOOR, DIVIDER_X,
  FLIPPER_LEN, FLIPPER_R, FLIPPER_SPEED, TAU, BUMPERS, POSTS,
} from './layout.js';

/* =====================================================================
   3D PINBALL – vanilla JS + three.js + WebAudio, multiple themes
   Coordinates: x = right, z = towards player (down), y = up
   ===================================================================== */
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);

// ------------------------------------------------------------ renderer / scene / post
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.5, 300);
const camBase = new THREE.Vector3(), camLookBase = new THREE.Vector3(0, 1.5, -2.5), camLook = camLookBase.clone();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.45, 0.82);
composer.addPass(bloom);
composer.addPass(new OutputPass());
let bloomOn = localStorage.getItem('flipperBloom') !== '0';
function toggleBloom() { bloomOn = !bloomOn; localStorage.setItem('flipperBloom', bloomOn ? '1' : '0'); }

function fitCamera() {
  camera.aspect = innerWidth / innerHeight;
  const s = Math.max(1, 0.72 / camera.aspect);
  camBase.set(0, 41.5 * s, 33 * s);
  camera.position.copy(camBase); camera.lookAt(camLook);
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
}
addEventListener('resize', fitCamera);

// ------------------------------------------------------------ free view: drag = rotate, wheel/pinch = zoom, R / double-click = reset
const view = { yaw: 0, pitch: 0, zoom: 1 }, viewT = { yaw: 0, pitch: 0, zoom: 1 };
const sph = new THREE.Spherical(), camOff = new THREE.Vector3();
{
  const cv = renderer.domElement, ptrs = new Map();
  let pinch0 = 0, zoom0 = 1;
  cv.style.cursor = 'grab';
  cv.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = viewT.zoom; } });
  cv.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 1) {
      viewT.yaw -= (e.clientX - p.x) * 0.006;
      viewT.pitch = Math.max(-0.75, Math.min(0.55, viewT.pitch + (e.clientY - p.y) * 0.004));
    }
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2 && pinch0) { const [a, b] = [...ptrs.values()]; viewT.zoom = Math.max(0.45, Math.min(1.8, zoom0 * pinch0 / Math.hypot(a.x - b.x, a.y - b.y))); }
  });
  const up = e => { ptrs.delete(e.pointerId); if (!ptrs.size) cv.style.cursor = 'grab'; pinch0 = 0; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); viewT.zoom = Math.max(0.45, Math.min(1.8, viewT.zoom * Math.exp(e.deltaY * 0.001))); }, { passive: false });
  cv.addEventListener('dblclick', () => resetView());
}
function resetView() { viewT.yaw = Math.round(view.yaw / TAU) * TAU; viewT.pitch = 0; viewT.zoom = 1; }
fitCamera();

const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 0.55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.7);
sun.position.set(-8, 30, 12); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 24, bottom: -24, near: 1, far: 80 });
sun.shadow.bias = -0.0004; scene.add(sun);
const warm = new THREE.PointLight(0xffffff, 90, 40, 2); warm.position.set(0, 6, -14); scene.add(warm);

// ------------------------------------------------------------ materials (recoloured per theme)
const matWall = new THREE.MeshStandardMaterial({ roughness: 0.22, metalness: 0.05 });
const matTrim = new THREE.MeshStandardMaterial({ color: 0xe0aa2c, metalness: 1, roughness: 0.28 });
const matAccent = new THREE.MeshPhysicalMaterial({ color: 0xc8101c, emissive: 0x500008, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
const matCabinet = new THREE.MeshPhysicalMaterial({ color: 0x4a0a10, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 });
const slingMats = [];

// ------------------------------------------------------------ colliders + visuals
const colliders = [];
function addSeg(x1, z1, x2, z2, o = {}) {
  const c = { a: { x: x1, z: z1 }, b: { x: x2, z: z2 }, r: o.r ?? 0.2, e: o.e ?? 0.45,
    kick: o.kick || 0, score: o.score || 0, kind: o.kind || 'wall', oneWay: !!o.oneWay, nf: o.nf, last: 0, mesh: null, flash: 0 };
  colliders.push(c);
  if (o.visual !== false) {
    const dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz), hh = o.h ?? 1.3;
    const m = new THREE.Mesh(new THREE.BoxGeometry(len + c.r * 2, hh, c.r * 2), o.mat || matWall);
    m.position.set((x1 + x2) / 2, hh / 2, (z1 + z2) / 2);
    m.rotation.y = -Math.atan2(dz, dx);
    m.castShadow = m.receiveShadow = true;
    if (o.strip !== false) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(len + c.r * 2 + 0.02, 0.1, c.r * 2 + 0.08), matTrim);
      s.position.y = hh / 2 + 0.04; m.add(s);
    }
    scene.add(m); c.mesh = m;
  }
  return c;
}
function addCircle(x, z, r, o = {}) {
  const c = { a: { x, z }, b: { x, z }, r, e: o.e ?? 0.5, kick: o.kick || 0, score: o.score || 0, kind: o.kind || 'post', last: 0, mesh: null };
  colliders.push(c); return c;
}

// table, cabinet, rails
const table = new THREE.Mesh(new THREE.PlaneGeometry(20, Z_BOT - Z_TOP),
  new THREE.MeshPhysicalMaterial({ roughness: 0.4, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.12 }));
table.rotation.x = -Math.PI / 2; table.position.set(0, 0, (Z_TOP + Z_BOT) / 2); table.receiveShadow = true; scene.add(table);
const cabinet = new THREE.Mesh(new THREE.BoxGeometry(21.4, 4, Z_BOT - Z_TOP + 1.4), matCabinet);
cabinet.position.set(0, -2.02, (Z_TOP + Z_BOT) / 2); cabinet.receiveShadow = true; scene.add(cabinet);
for (const s of [-1, 1]) {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.5, Z_BOT - Z_TOP + 1.4), matCabinet);
  rail.position.set(s * 10.45, 0.75, (Z_TOP + Z_BOT) / 2); rail.castShadow = true; scene.add(rail);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, Z_BOT - Z_TOP + 1.4), matTrim);
  trim.position.set(s * 10.45, 1.52, (Z_TOP + Z_BOT) / 2); scene.add(trim);
}
// walls
addSeg(-TABLE_X, -12, -TABLE_X, 10.5);
addSeg(TABLE_X, -12, TABLE_X, LANE_FLOOR);
const ARCH_N = 28;
for (let i = 0; i < ARCH_N; i++) {
  const p1 = Math.PI + Math.PI * i / ARCH_N, p2 = Math.PI + Math.PI * (i + 1) / ARCH_N;
  addSeg(10 * Math.cos(p1), -12 + 10 * Math.sin(p1), 10 * Math.cos(p2), -12 + 10 * Math.sin(p2), { e: 0.35 });
}
addSeg(DIVIDER_X, -9, DIVIDER_X, LANE_FLOOR);
addSeg(DIVIDER_X, LANE_FLOOR, TABLE_X, LANE_FLOOR, { visual: false });
addSeg(10, -11.2, DIVIDER_X, -9.2, { oneWay: true, nf: { x: -Math.SQRT1_2, z: -Math.SQRT1_2 }, mat: matTrim, strip: false, h: 0.5, r: 0.12, e: 0.3 });
addSeg(-TABLE_X, 10.5, -4.5, 14.3);
addSeg(DIVIDER_X, 10.5, 4.5, 14.3);
for (const [x1, z1, x2, z2] of [[-7, 6.5, -5.4, 10.5], [7, 6.5, 5.4, 10.5]]) {
  const m = matAccent.clone(); slingMats.push(m);
  addSeg(x1, z1, x2, z2, { kick: 15, score: 10, kind: 'sling', mat: m, strip: false, e: 0.4, r: 0.25 });
}

// bumpers
const bumperObjs = BUMPERS.map(b => {
  const c = addCircle(b.x, b.z, b.r, { kick: 17, score: 100, kind: 'bumper', e: 0.5 });
  const g = new THREE.Group(); g.position.set(b.x, 0, b.z);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(b.r * 1.05, b.r * 1.12, 0.5, 40), matTrim); base.position.y = 0.25;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(b.r * 0.92, 40, 20, 0, TAU, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: 0xd8101c, emissive: 0xff1020, emissiveIntensity: 0.55, roughness: 0.1, clearcoat: 1 }));
  dome.position.y = 0.5; dome.scale.y = 0.85;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(b.r * 0.97, 0.1, 12, 48), matTrim); ring.rotation.x = Math.PI / 2; ring.position.y = 0.52;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(b.r * 0.32, 20, 14), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe9a0, emissiveIntensity: 0.9 }));
  bulb.position.y = 0.95;
  [base, dome, ring].forEach(m => { m.castShadow = true; g.add(m); }); g.add(bulb);
  const light = new THREE.PointLight(0xff3040, 0, 10, 2); light.position.y = 2.2; g.add(light);
  scene.add(g); c.mesh = g;
  return { c, g, body: dome, cap: bulb, light, flash: 0 };
});
POSTS.forEach(p => {
  addCircle(p.x, p.z, 0.45, { e: 0.75, score: 25, kind: 'post' });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 1.1, 24), matTrim); m.position.set(p.x, 0.55, p.z); m.castShadow = true; scene.add(m);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), matAccent); cap.position.set(p.x, 1.15, p.z); scene.add(cap);
});

// plunger
const plunger = new THREE.Group();
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 3, 16), matTrim); rod.rotation.x = Math.PI / 2; rod.position.set(0, 0.35, 1.5);
const knob = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 14), matAccent); knob.position.set(0, 0.35, 3.1);
plunger.add(rod, knob); plunger.position.set(LANE_X, 0, LANE_FLOOR + 0.3); scene.add(plunger);

// flippers
function makeFlipper(px, pz, rest, active) {
  const mesh = new THREE.Group(); mesh.position.set(px, 0.5, pz);
  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(FLIPPER_R, FLIPPER_LEN, 8, 16), matAccent);
  cap.rotation.z = Math.PI / 2; cap.position.x = FLIPPER_LEN / 2; cap.castShadow = true;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.0, 20), matTrim); hub.position.y = 0.05;
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(FLIPPER_LEN * 0.7, 0.04, 0.12), matTrim); stripe.position.set(FLIPPER_LEN / 2, FLIPPER_R, 0);
  mesh.add(cap, hub, stripe); scene.add(mesh);
  return { px, pz, rest, active, th: rest, om: 0, pressed: false, mesh };
}
const flippers = {
  left: makeFlipper(-4.6, 14.5, 0.5, -0.45),
  right: makeFlipper(4.6, 14.5, Math.PI - 0.5, Math.PI + 0.45),
};

// ball
const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0xf2f2f2, metalness: 1, roughness: 0.08, envMapIntensity: 1.6 }));
ballMesh.castShadow = true; scene.add(ballMesh);

// apron (instruction plate over the drain, ball rolls underneath)
const apronMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 });
const apron = new THREE.Mesh(new THREE.BoxGeometry(18, 0.12, 2.5), [matTrim, matTrim, apronMat, matTrim, matTrim, matTrim]);
apron.position.set(-1, 1.12, 19.45); apron.castShadow = true; scene.add(apron);
const skirt = new THREE.Mesh(new THREE.BoxGeometry(18, 1.18, 0.15), matCabinet); skirt.position.set(-1, 0.59, 20.65); scene.add(skirt);
function apronCanvas(T) {
  const c = document.createElement('canvas'); c.width = 1800; c.height = 250; const g = c.getContext('2d');
  g.fillStyle = T.apron.bg; g.fillRect(0, 0, 1800, 250);
  g.strokeStyle = T.apron.line; g.lineWidth = 10; g.strokeRect(12, 12, 1776, 226);
  g.fillStyle = T.apron.fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '900 64px "Arial Black", Impact, sans-serif'; g.fillText(T.apron.title, 900, 105);
  g.font = '700 30px "Trebuchet MS", sans-serif';
  g.fillText('3 BALLS PER GAME  ·  BUMPER 100  ·  POST 25  ·  SLING 10  ·  EVERY 10TH BUMPER = 1000 BONUS', 900, 185);
  return c;
}

// insert lamps: 10 in the arch (bonus progress) + 5 above the flippers
const lampGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.05, 24), lampRingGeo = new THREE.TorusGeometry(0.38, 0.05, 8, 24);
const lamps = [];
function addLamp(x, z, group, idx) {
  const mat = new THREE.MeshStandardMaterial({ color: 0x181818, emissive: 0xffaa00, emissiveIntensity: 0.1, roughness: 0.3 });
  const m = new THREE.Mesh(lampGeo, mat); m.position.set(x, 0.03, z); scene.add(m);
  const r = new THREE.Mesh(lampRingGeo, matTrim); r.rotation.x = Math.PI / 2; r.position.set(x, 0.05, z); scene.add(r);
  lamps.push({ mat, group, idx, level: 0 });
}
for (let i = 0; i < 10; i++) { const a = Math.PI + (i + 0.5) / 10 * Math.PI; addLamp(7 * Math.cos(a), -12 + 7 * Math.sin(a), 'arch', i); }
for (let i = 0; i < 5; i++) addLamp(-2 + i, 12.4, 'center', i);
let lampShowT = 0;
function lampShow(t) { lampShowT = Math.max(lampShowT, t); }

// ------------------------------------------------------------ effects: particles, score popups, ball trail
const dotTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
})();
const PN = 400, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 3), pData = [];
for (let i = 0; i < PN; i++) { pData.push({ life: 0, max: 1, vx: 0, vy: 0, vz: 0, r: 1, g: 1, b: 1 }); pPos[i * 3 + 1] = -100; }
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.5, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
points.frustumCulled = false; scene.add(points);
let pIdx = 0; const tmpCol = new THREE.Color();
function burst(x, z, n = 24, speed = 9) {
  const cols = THEME.colors.particles;
  for (let k = 0; k < n; k++) {
    const p = pData[pIdx], i = pIdx; pIdx = (pIdx + 1) % PN;
    const a = Math.random() * TAU, sp = speed * rnd(0.3, 1);
    Object.assign(p, { life: rnd(0.4, 0.9), vx: Math.cos(a) * sp, vy: rnd(3, 10), vz: Math.sin(a) * sp });
    p.max = p.life; tmpCol.set(cols[k % cols.length]); p.r = tmpCol.r; p.g = tmpCol.g; p.b = tmpCol.b;
    pPos[i * 3] = x; pPos[i * 3 + 1] = 0.9; pPos[i * 3 + 2] = z;
  }
}
function updateParticles(dt) {
  for (let i = 0; i < PN; i++) {
    const p = pData[i]; if (p.life <= 0) continue;
    p.life -= dt; p.vy -= 22 * dt;
    pPos[i * 3] += p.vx * dt; pPos[i * 3 + 1] += p.vy * dt; pPos[i * 3 + 2] += p.vz * dt;
    if (pPos[i * 3 + 1] < 0.06) { pPos[i * 3 + 1] = 0.06; p.vy *= -0.4; p.vx *= 0.7; p.vz *= 0.7; }
    const f = Math.max(0, p.life / p.max);
    pCol[i * 3] = p.r * f; pCol[i * 3 + 1] = p.g * f; pCol[i * 3 + 2] = p.b * f;
    if (p.life <= 0) pPos[i * 3 + 1] = -100;
  }
  pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
}
const popTex = {};
function popTexture(text, color) {
  const key = text + color; if (popTex[key]) return popTex[key];
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  g.font = '900 78px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 12; g.strokeStyle = 'rgba(0,0,0,0.85)'; g.strokeText(text, 128, 66); g.fillStyle = color; g.fillText(text, 128, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return (popTex[key] = t);
}
const pops = [];
for (let i = 0; i < 10; i++) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }));
  s.renderOrder = 10; s.visible = false; scene.add(s); pops.push({ s, life: 0 });
}
let popIdx = 0;
function popup(x, z, text, scale = 1) {
  const p = pops[popIdx]; popIdx = (popIdx + 1) % pops.length;
  p.s.material.map = popTexture(text, THEME.dm.hi); p.s.material.needsUpdate = true;
  p.s.position.set(x, 2.2, z); p.s.scale.set(3 * scale, 1.5 * scale, 1); p.s.visible = true; p.life = 0.9;
}
function updatePops(dt) {
  for (const p of pops) {
    if (p.life <= 0) continue;
    p.life -= dt; p.s.position.y += dt * 3; p.s.material.opacity = Math.min(1, p.life / 0.5);
    if (p.life <= 0) p.s.visible = false;
  }
}
const TRAIL = 10, trail = [], hist = [];
for (let i = 0; i < TRAIL; i++) {
  const m = new THREE.Mesh(ballMesh.geometry, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.scale.setScalar(1 - i * 0.07); scene.add(m); trail.push(m);
}
function scoreFX(c) {
  const onBall = c.kind === 'sling' || c.kind === 'wall';
  const x = onBall ? ball.x : c.a.x, z = onBall ? ball.z : c.a.z;
  if (c.kind === 'bumper') burst(x, z, 28, 10);
  else if (c.kind === 'sling') { burst(ball.x, ball.z, 16, 7); c.flash = 1; }
  else burst(ball.x, ball.z, 8, 5);
  popup(x, z, '+' + c.score, c.kind === 'bumper' ? 1 : 0.75);
}

// ------------------------------------------------------------ backbox + dot-matrix display
const backbox = new THREE.Group();
backbox.position.set(0, -1, Z_TOP - 0.75); backbox.rotation.x = 0.1; scene.add(backbox);
const glass = new THREE.Mesh(new THREE.PlaneGeometry(21.4, 10),
  new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 0.8, roughness: 0.3 }));
glass.position.set(0, 5, 0.01); backbox.add(glass);
const bbBody = new THREE.Mesh(new THREE.BoxGeometry(21.4, 10, 1.6), matCabinet); bbBody.position.set(0, 5, -0.82); backbox.add(bbBody);
const bbTop = new THREE.Mesh(new THREE.BoxGeometry(21.8, 0.4, 1.9), matTrim); bbTop.position.set(0, 10.1, -0.7); backbox.add(bbTop);
for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10.4, 1.9), matTrim); p.position.set(s * 10.9, 5.1, -0.7); backbox.add(p); }
// light bar on top of the backbox
const lightBar = new THREE.Mesh(new THREE.BoxGeometry(20.6, 0.18, 0.3), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffffff, emissiveIntensity: 1.2 }));
lightBar.position.set(0, 10.35, 0.2); backbox.add(lightBar);

const dm = (() => {
  const W = 192, H = 48, P = 8;
  const out = document.createElement('canvas'); out.width = W * P; out.height = H * P; const og = out.getContext('2d');
  const off = document.createElement('canvas'); off.width = W * P; off.height = H * P; const fg = off.getContext('2d');
  let pal;
  function setPalette(p) {
    pal = p; fg.fillStyle = p.bg; fg.fillRect(0, 0, W * P, H * P); fg.fillStyle = p.off;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { fg.beginPath(); fg.arc(x * P + P / 2, y * P + P / 2, P * 0.36, 0, TAU); fg.fill(); }
  }
  const src = document.createElement('canvas'); src.width = W; src.height = H; const sg = src.getContext('2d', { willReadFrequently: true });
  const tex = new THREE.CanvasTexture(out); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(13.16, 3.4), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  mesh.position.set(0, 3.88, 0.05); backbox.add(mesh);
  function put(txt, y, px, o = {}) {
    sg.font = `bold ${px}px "Courier New", Courier, monospace`;
    let w = sg.measureText(txt).width, x;
    if (o.scroll && w > W - 8) x = W - ((o.t * 0.04) % (w + W + 30));
    else if (w > W - 4) { px = Math.floor(px * (W - 4) / w); sg.font = `bold ${px}px "Courier New", Courier, monospace`; w = sg.measureText(txt).width; x = (W - w) / 2; }
    else x = o.align === 'left' ? 4 : o.align === 'right' ? W - w - 4 : (W - w) / 2;
    sg.fillText(txt, x, y);
  }
  function draw(l1, l2, l2b, now, scroll) {
    sg.clearRect(0, 0, W, H); sg.fillStyle = '#fff'; sg.textBaseline = 'top';
    put(l1, 1, 27, { t: now });
    if (l2b) { put(l2, 33, 13, { align: 'left' }); put(l2b, 33, 13, { align: 'right' }); }
    else put(l2, 33, 13, { scroll, t: now });
    const d = sg.getImageData(0, 0, W, H).data;
    og.drawImage(off, 0, 0);
    og.fillStyle = pal.glow;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 90) { og.beginPath(); og.arc(x * P + P / 2, y * P + P / 2, P * 0.72, 0, TAU); og.fill(); }
    for (let pass = 0; pass < 2; pass++) {
      og.fillStyle = pass ? pal.hi : pal.mid;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const a = d[(y * W + x) * 4 + 3];
        if (pass ? a > 200 : (a > 90 && a <= 200)) { og.beginPath(); og.arc(x * P + P / 2, y * P + P / 2, P * (pass ? 0.4 : 0.36), 0, TAU); og.fill(); }
      }
    }
    tex.needsUpdate = true;
  }
  return { draw, setPalette };
})();

// ------------------------------------------------------------ themes
let THEME = THEMES[0];
const themeCache = {};
function canvasTex(c, wrap) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function applyTheme(id) {
  const T = THEMES.find(t => t.id === id) || THEMES[0]; THEME = T;
  const tc = themeCache[T.id] || (themeCache[T.id] = {
    table: canvasTex(T.table()), glass: canvasTex(T.glass()), wall: canvasTex(T.wall(), true), apron: canvasTex(apronCanvas(T)),
  });
  table.material.map = tc.table; table.material.needsUpdate = true;
  glass.material.map = glass.material.emissiveMap = tc.glass; glass.material.needsUpdate = true;
  matWall.map = tc.wall; matWall.needsUpdate = true;
  apronMat.map = tc.apron; apronMat.needsUpdate = true;
  const C = T.colors;
  scene.background.set(C.bg);
  hemi.color.set(C.hemi[0]); hemi.groundColor.set(C.hemi[1]); hemi.intensity = C.hemi[2];
  sun.color.set(C.sun[0]); sun.intensity = C.sun[1]; warm.color.set(C.warm[0]); warm.intensity = C.warm[1];
  matTrim.color.set(C.trim.color); matTrim.metalness = C.trim.metalness; matTrim.roughness = C.trim.roughness;
  matTrim.emissive.set(C.trim.emissive); matTrim.emissiveIntensity = C.trim.ei;
  for (const m of [matAccent, ...slingMats]) { m.color.set(C.accent.color); m.emissive.set(C.accent.emissive); }
  matCabinet.color.set(C.cabinet);
  bumperObjs.forEach(b => { b.body.material.color.set(C.dome); b.body.material.emissive.set(C.domeEmissive); b.cap.material.emissive.set(C.bulb); b.light.color.set(C.bumperLight); });
  lamps.forEach(l => l.mat.emissive.set(C.lamp));
  trail.forEach(m => m.material.color.set(C.trail));
  lightBar.material.emissive.set(C.lamp);
  [bloom.strength, bloom.radius, bloom.threshold] = C.bloom;
  renderer.toneMappingExposure = C.exposure;
  dm.setPalette(T.dm); Sound.setSong(T.song);
  localStorage.setItem('flipperTheme', T.id);
  document.querySelectorAll('#themes .chip').forEach(el => el.classList.toggle('on', el.dataset.id === T.id));
  document.documentElement.style.setProperty('--accent', T.dm.mid);
}
let switching = false;
function switchTheme(id) {
  if (switching || id === THEME.id) return;
  switching = true; Sound.init(); Sound.themeJingle();
  const f = $('fade'); f.style.opacity = 1;
  setTimeout(() => { applyTheme(id); f.style.opacity = 0; switching = false; }, 220);
}
function cycleTheme() { switchTheme(THEMES[(THEMES.indexOf(THEME) + 1) % THEMES.length].id); }
{
  const box = $('themes');
  THEMES.forEach(T => {
    const el = document.createElement('div'); el.className = 'chip'; el.dataset.id = T.id; el.textContent = T.name;
    el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); switchTheme(T.id); });
    box.appendChild(el);
  });
  const q = new URLSearchParams(location.search).get('theme'), saved = localStorage.getItem('flipperTheme');
  applyTheme(THEMES.some(t => t.id === q) ? q : THEMES.some(t => t.id === saved) ? saved : THEMES[0].id);
}

// ------------------------------------------------------------ game state
const game = { mode: 'title', score: 0, shown: 0, balls: 3, hi: +(localStorage.getItem('flipperHi') || 0),
  charging: false, power: 0, chargeTick: 0, respawn: 0, shake: 0,
  msgH: '', msgP: '', tmp: '', tmpUntil: 0, bumperHits: 0 };
const ball = { x: LANE_X, z: LANE_FLOOR - 0.7, vx: 0, vz: 0, active: true, still: 0 };

function setMsg(h, p) { game.msgH = h || ''; game.msgP = p || ''; }
function addScore(n) { game.score += n; if (game.score > game.hi) { game.hi = game.score; localStorage.setItem('flipperHi', game.hi); } }
function flashMsg(t, ms = 2500) { game.tmp = t; game.tmpUntil = performance.now() + ms; }

function spawnBall() { Object.assign(ball, { x: LANE_X, z: LANE_FLOOR - 0.7, vx: 0, vz: 0, active: true, still: 0 }); }
function startGame() {
  game.mode = 'play'; game.score = 0; game.shown = 0; game.balls = 3; game.power = 0; game.charging = false; game.bumperHits = 0;
  spawnBall(); Sound.start(); showHint();
}
function showHint() { setMsg('', 'HOLD SPACE - RELEASE TO LAUNCH'); }
function inLane() { return ball.x > DIVIDER_X + 0.1 && ball.z > 14; }
function launch() {
  if (game.mode !== 'play' || !ball.active || !inLane()) return;
  const p = game.power;
  ball.vz = -(33 + p * 25); ball.vx = 0;
  Sound.launch(p); game.shake = 0.3 + p * 0.4; lampShow(0.6); burst(LANE_X, LANE_FLOOR - 1, 30, 10);
  if (game.msgP.startsWith('HOLD')) setMsg('', '');
}

// ------------------------------------------------------------ Eingabe
const keys = {};
function setFlipper(side, down) {
  const f = flippers[side];
  if (down && !f.pressed) Sound.flipper();
  if (!down && f.pressed) Sound.flipperUp();
  f.pressed = down;
}
function pressStart() {
  Sound.init();
  if (game.mode === 'title' || (game.mode === 'over' && game.respawn <= 0)) startGame();
  else if (game.mode === 'play' && ball.active && inLane()) game.charging = true;
}
function releaseStart() { if (game.charging) { game.charging = false; launch(); game.power = 0; } }
function nudge() {
  if (game.mode !== 'play' || !ball.active || inLane()) return;
  ball.vx += (Math.random() - 0.5) * 8; ball.vz -= 3 + Math.random() * 3;
  game.shake = 0.8; Sound.nudge();
}
addEventListener('keydown', e => {
  if (e.repeat) return;
  const c = e.code;
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(c)) e.preventDefault();
  Sound.init();
  if (c === 'ArrowLeft' || c === 'KeyZ' || c === 'KeyY' || c === 'ShiftLeft' || c === 'KeyA') setFlipper('left', true);
  if (c === 'ArrowRight' || c === 'Period' || c === 'Slash' || c === 'ShiftRight' || c === 'KeyD') setFlipper('right', true);
  if (c === 'Space' || c === 'Enter') pressStart();
  if (c === 'KeyN') nudge();
  if (c === 'KeyM') Sound.toggleMusic();
  if (c === 'KeyT') cycleTheme();
  if (c === 'KeyB') toggleBloom();
  if (c === 'KeyR') resetView();
});
addEventListener('keyup', e => {
  const c = e.code;
  if (c === 'ArrowLeft' || c === 'KeyZ' || c === 'KeyY' || c === 'ShiftLeft' || c === 'KeyA') setFlipper('left', false);
  if (c === 'ArrowRight' || c === 'Period' || c === 'Slash' || c === 'ShiftRight' || c === 'KeyD') setFlipper('right', false);
  if (c === 'Space' || c === 'Enter') releaseStart();
});
const bind = (id, down, up) => {
  const el = $(id);
  el.addEventListener('pointerdown', e => { e.preventDefault(); Sound.init(); down(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => el.addEventListener(ev, up));
};
bind('bL', () => setFlipper('left', true), () => setFlipper('left', false));
bind('bR', () => setFlipper('right', true), () => setFlipper('right', false));
bind('bP', pressStart, releaseStart);
addEventListener('blur', () => { setFlipper('left', false); setFlipper('right', false); releaseStart(); });

// ------------------------------------------------------------ Physik
function hit(c, impact) {
  const now = performance.now();
  if (c.kind === 'bumper') {
    Sound.bumper(); game.shake = Math.max(game.shake, 0.35);
    if (++game.bumperHits % 10 === 0) { addScore(1000); flashMsg(THEME.bonus); lampShow(1.5); popup(ball.x, ball.z - 1.5, '+1000', 1.6); }
    const b = bumperObjs.find(o => o.c === c); if (b) b.flash = 1;
  } else if (c.kind === 'sling') { Sound.sling(); game.shake = Math.max(game.shake, 0.2); }
  else if (c.kind === 'post') { if (impact > 3) Sound.post(); }
  else if (c.kind === 'flipper') { if (impact > 6) Sound.wall(impact * 0.5); }
  else if (impact > 3) Sound.wall(impact);
  if (c.score && now - c.last > 120) { addScore(c.score); scoreFX(c); }
  c.last = now;
}

// Kollision Kugel <-> Segment/Kapsel. surf(px,pz) liefert Oberflächengeschwindigkeit (Flipper).
function collide(c, surf) {
  const R = BALL_R + c.r;
  const { a, b } = c;
  let nx, nz, dist;
  if (c.oneWay) {
    const side = (ball.x - a.x) * c.nf.x + (ball.z - a.z) * c.nf.z;
    if (side < 0 || side >= R) return;
    if (ball.vx * c.nf.x + ball.vz * c.nf.z >= 0) return;
    const abx = b.x - a.x, abz = b.z - a.z;
    const t = ((ball.x - a.x) * abx + (ball.z - a.z) * abz) / (abx * abx + abz * abz);
    if (t < 0 || t > 1) return;
    nx = c.nf.x; nz = c.nf.z; dist = side;
  } else {
    const abx = b.x - a.x, abz = b.z - a.z, l2 = abx * abx + abz * abz;
    let t = l2 > 0 ? ((ball.x - a.x) * abx + (ball.z - a.z) * abz) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const cx = a.x + t * abx, cz = a.z + t * abz;
    const dx = ball.x - cx, dz = ball.z - cz;
    dist = Math.hypot(dx, dz);
    if (dist >= R) return;
    if (dist < 1e-6) { nx = -abz; nz = abx; const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l; }
    else { nx = dx / dist; nz = dz / dist; }
    var cxp = cx, czp = cz;
  }
  // Positionskorrektur
  const pen = R - dist;
  ball.x += nx * pen; ball.z += nz * pen;
  // Relativgeschwindigkeit zur (bewegten) Oberfläche
  let sx = 0, sz = 0;
  if (surf) [sx, sz] = surf(cxp, czp);
  const rvx = ball.vx - sx, rvz = ball.vz - sz;
  const vn = rvx * nx + rvz * nz;
  if (vn < 0) {
    const j = -(1 + c.e) * vn;
    ball.vx += j * nx; ball.vz += j * nz;
    // leichte Reibung entlang der Oberfläche
    const tx = -nz, tz = nx, vt = (ball.vx - sx) * tx + (ball.vz - sz) * tz;
    ball.vx -= vt * 0.01 * tx; ball.vz -= vt * 0.01 * tz;
    if (c.kick) {
      const out = ball.vx * nx + ball.vz * nz;
      if (out < c.kick) { ball.vx += nx * (c.kick - out); ball.vz += nz * (c.kick - out); }
    }
    hit(c, -vn);
  }
}

const flipperColliders = {};
for (const k of ['left', 'right']) flipperColliders[k] = { a: {}, b: {}, r: FLIPPER_R, e: 0.2, kick: 0, score: 0, kind: 'flipper', last: 0 };

function updateFlipper(side, h) {
  const f = flippers[side], target = f.pressed ? f.active : f.rest;
  const diff = target - f.th, d = Math.sign(diff) * Math.min(Math.abs(diff), FLIPPER_SPEED * h);
  f.om = d / h; f.th += d;
}
function collideFlipper(side) {
  const f = flippers[side], c = flipperColliders[side];
  c.a.x = f.px; c.a.z = f.pz;
  c.b.x = f.px + Math.cos(f.th) * FLIPPER_LEN; c.b.z = f.pz + Math.sin(f.th) * FLIPPER_LEN;
  collide(c, (x, z) => [-(z - f.pz) * f.om, (x - f.px) * f.om]);
}

function physicsStep(h) {
  ball.vz += GRAVITY * h;
  const damp = 1 - 0.04 * h; ball.vx *= damp; ball.vz *= damp;
  ball.x += ball.vx * h; ball.z += ball.vz * h;
  for (const c of colliders) collide(c);
  collideFlipper('left'); collideFlipper('right');
  const sp = Math.hypot(ball.vx, ball.vz);
  if (sp > MAX_SPEED) { ball.vx *= MAX_SPEED / sp; ball.vz *= MAX_SPEED / sp; }
  // Sicherheitsnetz: nie durch die Seitenwände
  if (ball.x < -TABLE_X + BALL_R && ball.z < 10.5) ball.x = -TABLE_X + BALL_R;
  if (ball.x > TABLE_X - BALL_R && ball.z < LANE_FLOOR) ball.x = TABLE_X - BALL_R;
}

function drain() {
  ball.active = false; game.balls--; Sound.drain(); game.shake = 0.5; lampShow(1.0);
  if (game.balls > 0) {
    setMsg('BALL LOST', `${game.balls} ${game.balls === 1 ? 'BALL' : 'BALLS'} LEFT`);
    game.respawn = 1.6;
  } else {
    game.mode = 'over'; game.respawn = 1.5; Sound.over();
    setMsg('GAME OVER', game.score >= game.hi && game.score > 0 ? 'NEW HIGH SCORE!' : 'THANK YOU FOR PLAYING');
  }
}

function update(dt) {
  if (game.charging) {
    game.power = Math.min(1, game.power + dt / 1.1);
    game.chargeTick -= dt;
    if (game.chargeTick <= 0) { Sound.charge(game.power); game.chargeTick = 0.09; }
  }
  if (game.respawn > 0) {
    game.respawn -= dt;
    if (game.respawn <= 0) {
      if (game.mode === 'play') { spawnBall(); setMsg('', ''); showHint(); }
      else if (game.mode === 'over') setMsg('GAME OVER', 'PRESS SPACE FOR A NEW GAME');
    }
  }
  const n = Math.ceil(dt / (1 / 600)), h = dt / n;
  for (let i = 0; i < n; i++) {
    updateFlipper('left', h); updateFlipper('right', h);
    if (ball.active && (game.mode === 'play' || game.mode === 'title')) physicsStep(h);
  }
  if (ball.active && game.mode === 'play') {
    if (ball.z > Z_BOT) drain();
    // Festhänger lösen
    const sp = Math.hypot(ball.vx, ball.vz);
    if (!inLane() && sp < 0.6 && (ball.z < 12 || !(flippers.left.pressed || flippers.right.pressed))) {
      ball.still += dt;
      if (ball.still > 1.5) { ball.vx = (Math.random() - 0.5) * 12; ball.vz = -10; ball.still = 0; Sound.nudge(); }
    } else ball.still = 0;
  }
}



// ------------------------------------------------------------ display content
function displayContent(now) {
  const n = 3 - game.balls + 1, shown = Math.round(game.shown).toLocaleString('en-US');
  let l1, l2 = '', l2b = '', scroll = false;
  if (game.mode === 'title') {
    l1 = Math.floor(now / 2200) % 2 ? THEME.t2 : THEME.t1;
    l2 = 'PRESS SPACE TO START  **  HI-SCORE ' + game.hi.toLocaleString('en-US') + '  **  LEFT/RIGHT = FLIPPERS  **  N = NUDGE  **  T = THEME  **  M = MUSIC  **  B = BLOOM  **  DRAG = ROTATE  **  WHEEL = ZOOM  **  R = RESET VIEW';
    scroll = true;
  } else {
    l1 = game.msgH || shown;
    if (game.mode === 'over' && Math.floor(now / 1400) % 2) l1 = shown;
    if (now < game.tmpUntil) { l2 = game.tmp; scroll = true; }
    else if (game.msgP) { l2 = game.msgP; scroll = true; }
    else { l2 = 'BALL ' + Math.min(n, 3); l2b = 'HI ' + game.hi.toLocaleString('en-US'); }
  }
  return [l1, l2, l2b, scroll];
}

// ------------------------------------------------------------ lamps / attract mode
let attractT = 0;
function updateLamps(dt, now) {
  lampShowT = Math.max(0, lampShowT - dt);
  const chase = Math.floor(now / 90), progress = game.bumperHits % 10;
  for (const l of lamps) {
    let on;
    if (lampShowT > 0) on = (Math.floor(now / 70) + l.idx) % 2 === 0;
    else if (game.mode !== 'play') on = l.group === 'arch' ? (chase + l.idx) % 5 === 0 : Math.abs(((chase >> 1) % 8) - 4) === l.idx;
    else if (l.group === 'arch') on = l.idx < progress || (l.idx === progress && Math.floor(now / 250) % 2 === 0);
    else on = l.idx === (Math.floor(now / 160) % 5);
    l.level += ((on ? 1 : 0) - l.level) * Math.min(1, dt * 18);
    l.mat.emissiveIntensity = 0.08 + l.level * 2.6;
  }
  lightBar.material.emissiveIntensity = 0.6 + 0.6 * Math.sin(now / 300) ** 2 + (lampShowT > 0 ? 1.5 : 0);
  if (game.mode !== 'play') {
    attractT -= dt;
    if (attractT <= 0) { attractT = 0.7; bumperObjs[Math.floor(Math.random() * bumperObjs.length)].flash = 0.6; }
  }
}

// ------------------------------------------------------------ render loop
const clock = new THREE.Clock();
const axis = new THREE.Vector3(), dq = new THREE.Quaternion();
const powerEl = $('power').firstElementChild;
let lastDisp = 0;
function frame() {
  const dt = Math.min(clock.getDelta(), 1 / 30), now = performance.now();
  update(dt);

  const sp = Math.hypot(ball.vx, ball.vz);
  if (ball.active) {
    if (sp > 0.01) { axis.set(ball.vz, 0, -ball.vx).normalize(); dq.setFromAxisAngle(axis, sp * dt / BALL_R); ballMesh.quaternion.premultiply(dq); }
    ballMesh.position.set(ball.x, BALL_R, ball.z);
  } else ballMesh.position.y = -50;

  // trail
  hist.unshift([ballMesh.position.x, ballMesh.position.y, ballMesh.position.z]); if (hist.length > TRAIL * 2 + 2) hist.pop();
  const tf = ball.active ? Math.min(1, Math.max(0, (sp - 14) / 30)) : 0;
  trail.forEach((m, i) => { const h = hist[i * 2 + 2]; if (h) m.position.set(h[0], h[1], h[2]); m.material.opacity = tf * 0.32 * (1 - i / TRAIL); m.visible = tf > 0 && ball.z < 18.2; });

  for (const k of ['left', 'right']) flippers[k].mesh.rotation.y = -flippers[k].th;
  plunger.position.z = LANE_FLOOR + 0.3 + game.power * 1.6;
  powerEl.style.height = (game.power * 100) + '%';

  for (const b of bumperObjs) {
    b.flash = Math.max(0, b.flash - dt * 4);
    b.g.scale.set(1 + b.flash * 0.12, 1, 1 + b.flash * 0.12);
    b.body.material.emissiveIntensity = 0.55 + b.flash * 2.5;
    b.cap.material.emissiveIntensity = 0.9 + b.flash * 3;
    b.light.intensity = b.flash * 70;
  }
  colliders.forEach(c => { if (c.kind === 'sling' && c.mesh) { c.flash = Math.max(0, c.flash - dt * 5); c.mesh.material.emissiveIntensity = 1 + c.flash * 4; } });
  updateLamps(dt, now); updateParticles(dt); updatePops(dt);

  // camera: gentle follow + shake
  const follow = ball.active && game.mode === 'play';
  camLook.x += ((follow ? ball.x * 0.1 : 0) - camLook.x) * Math.min(1, dt * 2);
  camLook.z += ((follow ? camLookBase.z + (ball.z - 1) * 0.05 : camLookBase.z) - camLook.z) * Math.min(1, dt * 2);
  game.shake = Math.max(0, game.shake - dt * 2.5);
  const s = game.shake * 0.35;
  const k = Math.min(1, dt * 8);
  view.yaw += (viewT.yaw - view.yaw) * k; view.pitch += (viewT.pitch - view.pitch) * k; view.zoom += (viewT.zoom - view.zoom) * k;
  camOff.subVectors(camBase, camLookBase); sph.setFromVector3(camOff);
  sph.theta += view.yaw; sph.phi = Math.max(0.12, Math.min(1.5, sph.phi - view.pitch)); sph.radius *= view.zoom;
  camOff.setFromSpherical(sph);
  camera.position.copy(camLook).add(camOff).add({ x: (Math.random() - 0.5) * s, y: (Math.random() - 0.5) * s, z: (Math.random() - 0.5) * s });
  camera.lookAt(camLook);

  game.shown += (game.score - game.shown) * Math.min(1, dt * 9);
  if (Math.abs(game.score - game.shown) < 1) game.shown = game.score;
  if (now - lastDisp > 60) { lastDisp = now; const [a, b, c, d] = displayContent(now); dm.draw(a, b, c, now, d); }

  if (bloomOn) composer.render(); else renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
addEventListener('pointerdown', () => Sound.init(), { once: true });
window.__game = { game, ball, flippers, viewT, burst, popup, lampShow, switchTheme };
frame();
