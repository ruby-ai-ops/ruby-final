export const INTEGRATION_MARQUEE_DECELERATION_DURATION_MS = 240;
export const INTEGRATION_MARQUEE_ACCELERATION_DURATION_MS = 280;
export const INTEGRATION_BUBBLE_ENTER_DURATION_MS = 200;
export const INTEGRATION_BUBBLE_EXIT_DURATION_MS = 170;

interface PlaybackRateAnimation {
  updatePlaybackRate(rate: number): void;
}

export function applyMarqueePlaybackRate(
  animation: PlaybackRateAnimation,
  rate: number
): void {
  animation.updatePlaybackRate(rate);
}

export function getMarqueePlaybackRate(
  fromRate: number,
  toRate: number,
  elapsedMs: number,
  durationMs: number
): number {
  if (durationMs <= 0) {
    return toRate;
  }

  const progress = Math.min(Math.max(elapsedMs / durationMs, 0), 1);
  const easedProgress = 1 - (1 - progress) ** 3;
  return fromRate + (toRate - fromRate) * easedProgress;
}
