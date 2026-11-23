// Shared table geometry + canvas layout (used by physics, 3D scene and theme art)
export const TABLE_X = 10, Z_TOP = -18, Z_BOT = 20;
export const BALL_R = 0.5, GRAVITY = 24, MAX_SPEED = 65;
export const LANE_X = 9.0, LANE_FLOOR = 17.5, DIVIDER_X = 8.0;
export const FLIPPER_LEN = 3.8, FLIPPER_R = 0.4, FLIPPER_SPEED = 18;
export const TAU = Math.PI * 2;

export const BUMPERS = [{ x: -4, z: -7, r: 1.4 }, { x: 4, z: -7, r: 1.4 }, { x: 0, z: -2.5, r: 1.4 }];
export const POSTS = [{ x: -6, z: -3 }, { x: 6, z: -3 }, { x: -2, z: -13 }, { x: 2, z: -13 }];
export const GUIDE_ZONES = [
  [[-10, 10.5], [-4.5, 14.3], [-4.6, 20], [-10, 20]],
  [[8, 10.5], [4.5, 14.3], [4.6, 20], [8, 20]],
];

// canvas sizes: playfield 50 px per unit, backglass 2140 x 1000 with a display window
export const PX = 50, TW = 20 * PX, TH = (Z_BOT - Z_TOP) * PX;
export const GW = 2140, GH = 1000;
export const WIN = { x: 396, y: 428, w: 1348, h: 372 };
