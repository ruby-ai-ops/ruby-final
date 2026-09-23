// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import type { RubyUILinkProps } from "@ruby-ai/ui";
import Link from "next/link";

export function NextLinkWrapper({
  href,
  children,
  replace = false,
  shallow = false,
  target = "_self",
  ...props
}: RubyUILinkProps) {
  return (
    <Link
      href={href}
      target={target}
      shallow={shallow}
      replace={replace}
      {...props}
    >
      {children}
    </Link>
  );
}
