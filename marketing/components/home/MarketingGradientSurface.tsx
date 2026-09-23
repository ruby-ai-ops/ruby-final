import { classNames } from "@marketing/lib/utils";
import type { ReactNode } from "react";

export type MarketingGradientSurfaceVariant = "card" | "hero";

export interface MarketingGradientSurfaceProps {
  children?: ReactNode;
  className?: string;
  variant?: MarketingGradientSurfaceVariant;
}

const VARIANT_CLASSES: Record<MarketingGradientSurfaceVariant, string> = {
  card: "marketing-gradient-surface-card",
  hero: "marketing-gradient-surface-hero",
};

export function MarketingGradientSurface({
  children,
  className,
  variant = "card",
}: MarketingGradientSurfaceProps) {
  return (
    <div
      className={classNames(
        "marketing-gradient-surface marketing-card-dark-gradient",
        VARIANT_CLASSES[variant],
        className ?? ""
      )}
    >
      <span
        aria-hidden="true"
        className="marketing-gradient-blob marketing-gradient-blob-blue"
      />
      <span
        aria-hidden="true"
        className="marketing-gradient-blob marketing-gradient-blob-cyan"
      />
      <span
        aria-hidden="true"
        className="marketing-gradient-blob marketing-gradient-blob-lilac"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
