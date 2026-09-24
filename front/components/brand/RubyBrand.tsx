import type { SVGProps } from "react";

const iconPath = "/static/favicon180.png";

export function RubyBrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 180 180" role="img" aria-label="Ruby AI" {...props}>
      <image href={iconPath} width="180" height="180" />
    </svg>
  );
}

export const RubyBrandLogo = RubyBrandIcon;
