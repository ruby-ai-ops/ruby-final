export const RUBY_SCENE_TRANSLATE = {
  x: -9.1,
  y: -33.1,
} as const;

export const DEFAULT_ROOM_WALL_DEPTH = 45;

type RoomKey = "office-d" | "office-c" | "office-bl" | "office-t";
type RubyLetter = "R" | "U" | "B" | "Y";
type ContourKind = "outer" | "counter";

export interface SvgPoint {
  x: number;
  y: number;
}

export interface RoofContour {
  kind: ContourKind;
  points: readonly SvgPoint[];
}

export interface ExtrudedWallFace {
  kind: ContourKind;
  shade: "left" | "right" | "inner";
  points: readonly [SvgPoint, SvgPoint, SvgPoint, SvgPoint];
}

export interface RoomGeometry {
  room: RoomKey;
  letter: RubyLetter;
  roofPath: string;
  contours: readonly RoofContour[];
}

export const createExtrudedWallFaces = (
  contours: readonly RoofContour[],
  depthY: number
): ExtrudedWallFace[] =>
  contours.flatMap((contour) =>
    contour.points.map((start, index) => {
      const end = contour.points[(index + 1) % contour.points.length];
      const shade =
        contour.kind === "counter"
          ? "inner"
          : end.x >= start.x
            ? "right"
            : "left";

      return {
        kind: contour.kind,
        shade,
        points: [
          start,
          end,
          { x: end.x, y: end.y + depthY },
          { x: start.x, y: start.y + depthY },
        ],
      };
    })
  );

const roofPaths = [
  "M 719.8,410.5 L 743.7,424.2 L 725.0,523.5 L 733.6,532.8 L 778.2,558.6 L 798.9,563.8 L 813.8,561.9 L 828.9,552.3 L 845.4,470.8 L 876.6,476.7 L 903.5,478.2 L 933.4,475.7 L 958.7,469.4 L 983.2,458.4 L 1002.9,444.2 L 1014.7,428.8 L 1018.8,412.3 L 1016.0,396.9 L 1007.1,380.7 L 993.2,365.1 L 974.5,350.0 L 840.0,270.9 L 833.6,268.1 L 818.2,265.7 L 802.8,268.1 L 796.4,270.9 L 559.9,407.4 L 555.0,411.1 L 550.9,420.0 L 555.0,428.9 L 559.9,432.6 L 598.9,455.1 L 605.3,457.9 L 620.7,460.3 L 628.7,459.7 L 642.5,455.1 Z M 839.0,397.3 L 790.8,369.5 L 829.8,347.0 L 893.5,384.9 L 904.4,395.2 L 907.5,404.9 L 896.5,413.0 L 882.4,414.0 L 864.1,409.3 Z",
  "M 996.5,684.7 L 1040.1,705.0 L 1088.3,717.8 L 1116.1,721.0 L 1138.3,721.4 L 1182.9,716.3 L 1211.6,708.0 L 1238.9,695.7 L 1385.6,611.1 L 1393.6,603.1 L 1393.6,593.9 L 1385.6,585.9 L 1342.1,561.7 L 1326.7,559.3 L 1318.7,559.9 L 1304.9,564.5 L 1165.1,645.2 L 1143.9,654.8 L 1126.0,658.3 L 1106.7,657.6 L 1085.1,651.5 L 1065.0,641.5 L 1050.1,630.2 L 1042.6,619.5 L 1042.4,608.3 L 1049.7,597.9 L 1064.7,587.2 L 1204.4,506.5 L 1212.4,498.5 L 1212.4,489.3 L 1204.4,481.3 L 1167.4,459.9 L 1153.5,455.3 L 1137.6,455.3 L 1123.7,459.9 L 976.4,545.1 L 955.9,560.4 L 942.1,576.0 L 935.5,589.0 L 932.7,602.7 L 933.4,615.5 L 938.9,631.5 L 961.1,659.3 Z",
  "M 623.4,523.9 L 512.7,459.9 L 498.8,455.3 L 482.8,455.3 L 469.0,459.9 L 232.6,596.4 L 224.6,604.4 L 224.6,613.6 L 232.6,621.6 L 352.5,690.8 L 402.3,714.1 L 430.2,722.4 L 465.0,728.1 L 495.4,728.5 L 522.3,724.5 L 553.6,713.2 L 577.3,696.7 L 589.2,678.0 L 589.6,657.7 L 621.0,655.0 L 648.2,646.5 L 671.8,632.4 L 687.4,613.8 L 690.8,593.4 L 680.0,568.9 L 659.5,548.2 Z M 363.6,616.0 L 401.3,594.3 L 472.8,636.7 L 484.2,649.4 L 482.9,659.0 L 476.0,663.0 L 468.0,664.3 L 444.3,660.1 L 425.1,651.5 Z M 542.9,592.3 L 471.9,553.5 L 503.0,535.5 L 564.8,572.2 L 577.1,583.8 L 579.2,590.9 L 570.6,596.8 L 560.3,597.2 Z",
  "M 850.4,769.4 L 880.8,678.3 L 880.1,669.7 L 872.4,662.3 L 830.9,638.4 L 816.5,633.7 L 800.0,634.0 L 786.1,639.1 L 778.8,647.6 L 731.4,790.3 L 622.3,854.2 L 618.2,863.1 L 619.2,867.7 L 627.2,875.7 L 671.8,900.6 L 687.3,903.0 L 695.3,902.4 L 709.1,897.8 L 813.3,837.6 L 1060.4,810.3 L 1075.2,806.0 L 1084.1,798.0 L 1084.6,788.5 L 1076.4,780.1 L 1035.8,756.7 L 1023.0,752.2 L 1008.1,751.8 Z",
] as const;

const parseRoofContours = (roofPath: string): readonly RoofContour[] => {
  const subpaths = roofPath.match(/M [^Z]+Z/g);
  if (!subpaths) {
    throw new Error("RUBY roof path must contain at least one closed contour");
  }

  return subpaths.map((subpath, index) => ({
    kind: index === 0 ? "outer" : "counter",
    points: Array.from(
      subpath.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g),
      (match) => ({ x: Number(match[1]), y: Number(match[2]) })
    ),
  }));
};

const createRoomGeometry = (
  room: RoomKey,
  letter: RubyLetter,
  roofPath: string
): RoomGeometry => ({
  room,
  letter,
  roofPath,
  contours: parseRoofContours(roofPath),
});

export const RUBY_ROOM_GEOMETRIES: readonly RoomGeometry[] = [
  createRoomGeometry("office-d", "R", roofPaths[0]),
  createRoomGeometry("office-c", "U", roofPaths[1]),
  createRoomGeometry("office-bl", "B", roofPaths[2]),
  createRoomGeometry("office-t", "Y", roofPaths[3]),
];
