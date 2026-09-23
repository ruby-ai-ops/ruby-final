import {
  isMarketingSurfaceVisible,
  type MarketingSurface,
} from "@marketing/lib/marketing_visibility";
import type { ReactNode } from "react";

interface VisibilityGateProps {
  surface: MarketingSurface;
  children: ReactNode;
}

export function VisibilityGate({ surface, children }: VisibilityGateProps) {
  return isMarketingSurfaceVisible(surface) ? <>{children}</> : null;
}
