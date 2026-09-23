import {
  DEFAULT_ROOM_WALL_DEPTH,
  RUBY_ROOM_GEOMETRIES,
  RUBY_SCENE_TRANSLATE,
  createExtrudedWallFaces,
  type RoomGeometry,
} from "./heroOfficeGeometry.ts";

// Static SVG markup for the home-page hero floor scene. The four
// Söhne letter-shaped rooms, isometric ground/grid, door lights, and hidden
// room labels are baked here. Empty <g id="humans"> / <g id="agents">
// layers are populated at runtime by heroOfficeActors / scenario engine.

const renderRoom = (room: RoomGeometry): string => {
  const counterAttribute =
    room.contours.length > 1 ? ' data-counter="true"' : "";
  const wallFaces = createExtrudedWallFaces(
    room.contours,
    DEFAULT_ROOM_WALL_DEPTH
  )
    .map((face) => {
      const points = face.points
        .map((point) => `${point.x},${point.y}`)
        .join(" ");
      return `      <polygon class="room-wall room-wall-${face.shade}" data-contour="${face.kind}" points="${points}"/>`;
    })
    .join("\n");

  return `  <g class="room-block" data-room="${room.room}" data-letter="${room.letter}">
    <g class="room-wall-group">
${wallFaces}
    </g>
    <path class="roof-logo"${counterAttribute} fill-rule="evenodd" clip-rule="evenodd" d="${room.roofPath}"/>
    <path class="roof-edge" fill-rule="evenodd" clip-rule="evenodd" d="${room.roofPath}"/>
  </g>`;
};

const renderedRooms = RUBY_ROOM_GEOMETRIES.map(renderRoom).join("\n");

export const STATIC_SVG_MARKUP = `<svg class="floor-svg" viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid meet" id="plan">
  <defs>
    <clipPath id="avatar-clip"><circle cx="0" cy="0" r="14"/></clipPath>
    <filter id="room-shadow" x="-12%" y="-12%" width="124%" height="148%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#111418" flood-opacity="0.18"/>
    </filter>
  </defs>

  <g class="ground-depth">
    <polygon class="ground-shadow" points="800.0,166.0 1630.2,646.0 800.0,1124.0 -30.2,646.0"/>
    <polygon class="ground-wall ground-wall-right" points="1600.2,588.0 800.0,1050.0 800.0,1082.0 1600.2,620.0"/>
    <polygon class="ground-wall ground-wall-left" points="800.0,1050.0 -0.2,588.0 -0.2,620.0 800.0,1082.0"/>
  </g>
  <polygon class="ground" points="800.0,126.0 1600.2,588.0 800.0,1050.0 -0.2,588.0"/>
  <g class="ground-grid">
    <line class="grid-line" x1="800.0" y1="147.0" x2="36.2" y2="588.0"/>
    <line class="grid-line" x1="800.0" y1="147.0" x2="1563.8" y2="588.0"/>
    <line class="grid-line" x1="881.8" y1="194.3" x2="118.0" y2="635.3"/>
    <line class="grid-line" x1="718.2" y1="194.3" x2="1482.0" y2="635.3"/>
    <line class="grid-line" x1="963.7" y1="241.5" x2="199.8" y2="682.5"/>
    <line class="grid-line" x1="636.3" y1="241.5" x2="1400.2" y2="682.5"/>
    <line class="grid-line" x1="1045.5" y1="288.8" x2="281.7" y2="729.8"/>
    <line class="grid-line" x1="554.5" y1="288.8" x2="1318.3" y2="729.8"/>
    <line class="grid-line" x1="1127.4" y1="336.0" x2="363.5" y2="777.0"/>
    <line class="grid-line" x1="472.6" y1="336.0" x2="1236.5" y2="777.0"/>
    <line class="grid-line" x1="1209.2" y1="383.3" x2="445.4" y2="824.3"/>
    <line class="grid-line" x1="390.8" y1="383.3" x2="1154.6" y2="824.3"/>
    <line class="grid-line" x1="1291.0" y1="430.5" x2="527.2" y2="871.5"/>
    <line class="grid-line" x1="309.0" y1="430.5" x2="1072.8" y2="871.5"/>
    <line class="grid-line" x1="1372.9" y1="477.8" x2="609.0" y2="918.8"/>
    <line class="grid-line" x1="227.1" y1="477.8" x2="991.0" y2="918.8"/>
    <line class="grid-line" x1="1454.7" y1="525.0" x2="690.9" y2="966.0"/>
    <line class="grid-line" x1="145.3" y1="525.0" x2="909.1" y2="966.0"/>
    <line class="grid-line" x1="1536.6" y1="572.3" x2="772.7" y2="1013.3"/>
    <line class="grid-line" x1="63.4" y1="572.3" x2="827.3" y2="1013.3"/>
  </g>

  <g id="ruby-floor-scene" transform="translate(${RUBY_SCENE_TRANSLATE.x} ${RUBY_SCENE_TRANSLATE.y})">
${renderedRooms}
  <g id="doors">
    <circle id="light-office-d" class="door-light" cx="586.3" cy="404.8" r="14"/>
    <circle id="light-office-c" class="door-light" cx="1027.3" cy="654.1" r="14"/>
    <circle id="light-office-bl" class="door-light" cx="259.0" cy="593.8" r="14"/>
    <circle id="light-office-t" class="door-light" cx="663.6" cy="848.4" r="14"/>
  </g>

  <g class="room-label-g" transform="translate(790.9,183.8)">
    <circle class="room-chip" cx="0" cy="-2" r="4.5" fill="#E2F78C"/>
    <text class="room-label" x="14" y="3">Engineering</text>
  </g>
  <g class="room-label-g" transform="translate(1218.3,420.0)">
    <circle class="room-chip" cx="0" cy="-2" r="4.5" fill="#FFC3DF"/>
    <text class="room-label" x="14" y="3">Marketing</text>
  </g>
  <g class="room-label-g" transform="translate(254.4,472.5)">
    <circle class="room-chip" cx="0" cy="-2" r="4.5" fill="#9FDBFF"/>
    <text class="room-label" x="14" y="3">Support</text>
  </g>
  <g class="room-label-g" transform="translate(581.8,472.5)">
    <circle class="room-chip" cx="0" cy="-2" r="4.5" fill="#3B82F6"/>
    <text class="room-label" x="14" y="3">Product · Sales</text>
  </g>

  <g id="humans"></g>
  <g id="agents"></g>
  </g>
</svg>`;
