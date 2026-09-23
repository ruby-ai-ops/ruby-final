// Spatial config for the home-page hero office: room geometry (door,
// interior rects, explicit agent spawns, door-light id), where teammates sit
// inside each room, and the corridor rail used by walking agents. All
// coordinates are in plan-space (top-down xy) — heroOfficeIso.ts maps them
// to screen-space.

export type RoomKey = "office-d" | "office-c" | "office-bl" | "office-t";

export interface RoomRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RoomConfig {
  /** Door position in plan-space — used as the entry/exit waypoint. */
  door: { x: number; y: number };
  /** One or more axis-aligned rects defining solid, seatable letter strokes. */
  interior: RoomRect[];
  /** Stable idle positions that keep every agent on a solid letter stroke. */
  agentSpawns: [number, number][];
  /** SVG id of the matching door-light circle in the static markup. */
  lightId: string;
}

export const ROOMS: Record<RoomKey, RoomConfig> = {
  "office-d": {
    door: { x: 90, y: 325 },
    interior: [
      { x: 80, y: 65, w: 210, h: 50 },
      { x: 80, y: 100, w: 50, h: 225 },
      { x: 210, y: 165, w: 40, h: 30 },
      { x: 285, y: 285, w: 25, h: 30 },
    ],
    agentSpawns: [[165, 75]],
    lightId: "light-office-d",
  },
  "office-c": {
    door: { x: 570, y: 320 },
    interior: [
      { x: 440, y: 65, w: 45, h: 205 },
      { x: 635, y: 65, w: 50, h: 110 },
      { x: 645, y: 250, w: 30, h: 30 },
      { x: 500, y: 285, w: 140, h: 25 },
    ],
    agentSpawns: [
      [450, 150],
      [645, 165],
      [510, 300],
      [630, 300],
    ],
    lightId: "light-office-c",
  },
  "office-bl": {
    door: { x: 90, y: 685 },
    interior: [
      { x: 80, y: 425, w: 210, h: 50 },
      { x: 80, y: 450, w: 50, h: 240 },
      { x: 270, y: 630, w: 30, h: 40 },
    ],
    agentSpawns: [[120, 585]],
    lightId: "light-office-bl",
  },
  "office-t": {
    door: { x: 555, y: 705 },
    interior: [
      { x: 680, y: 410, w: 20, h: 20 },
      { x: 440, y: 410, w: 20, h: 20 },
      { x: 620, y: 440, w: 20, h: 20 },
      { x: 500, y: 470, w: 20, h: 20 },
      { x: 605, y: 515, w: 20, h: 20 },
      { x: 515, y: 545, w: 20, h: 20 },
      { x: 575, y: 560, w: 20, h: 20 },
      { x: 560, y: 620, w: 20, h: 20 },
      { x: 545, y: 680, w: 20, h: 20 },
    ],
    agentSpawns: [
      [510, 480],
      [585, 570],
    ],
    lightId: "light-office-t",
  },
};

/** Seat positions per room (plan-space). The engine builds one human per
 *  point, in this exact order — adding/removing entries changes the office
 *  population without touching the engine.
 *
 *  Each point projects (via heroOfficeIso `iso(px, py, 22)`) onto a solid
 *  stroke of the corresponding baked Söhne letter. */
export const ROOM_POPULATIONS: Record<RoomKey, [number, number][]> = {
  "office-d": [
    [270, 75],
    [90, 315],
    [300, 300],
    [90, 105],
    [120, 225],
    [225, 180],
  ],
  "office-c": [
    [450, 255],
    [570, 300],
    [660, 270],
    [465, 75],
    [675, 75],
  ],
  "office-bl": [
    [270, 435],
    [90, 675],
    [285, 645],
    [90, 465],
  ],
  "office-t": [
    [690, 420],
    [555, 690],
    [450, 420],
    [615, 525],
    [525, 555],
    [630, 450],
    [570, 630],
  ],
};

/** Y-coord of the horizontal corridor rail agents follow when walking
 *  between rooms. Waypoints jitter ~6–8px around this line. */
export const RAIL_Y = 780;
