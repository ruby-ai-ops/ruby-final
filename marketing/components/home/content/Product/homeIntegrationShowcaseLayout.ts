export interface ShowcaseRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface ShowcaseSize {
  width: number;
  height: number;
}

export interface CapabilityBubblePlacement {
  left: number;
  top: number;
  placement: "above" | "below";
}

const VIEWPORT_MARGIN_PX = 16;
const BUBBLE_GAP_PX = 16;
const CAPABILITY_BUBBLE_MAX_WIDTH_PX = 320;

export function getCapabilityBubbleSize(
  viewport: ShowcaseSize,
  height: number
): ShowcaseSize {
  return {
    width: Math.min(
      CAPABILITY_BUBBLE_MAX_WIDTH_PX,
      Math.max(0, viewport.width - VIEWPORT_MARGIN_PX * 2)
    ),
    height,
  };
}

export function getCapabilityBubblePlacement(
  anchor: ShowcaseRect,
  viewport: ShowcaseSize,
  bubble: ShowcaseSize
): CapabilityBubblePlacement {
  const centeredLeft = (anchor.left + anchor.right - bubble.width) / 2;
  const left = Math.min(
    Math.max(centeredLeft, VIEWPORT_MARGIN_PX),
    viewport.width - bubble.width - VIEWPORT_MARGIN_PX
  );
  const aboveTop = anchor.top - bubble.height - BUBBLE_GAP_PX;
  const placement = aboveTop >= VIEWPORT_MARGIN_PX ? "above" : "below";

  return {
    left,
    top:
      placement === "above"
        ? aboveTop
        : Math.min(
            anchor.bottom + BUBBLE_GAP_PX,
            viewport.height - bubble.height - VIEWPORT_MARGIN_PX
          ),
    placement,
  };
}
