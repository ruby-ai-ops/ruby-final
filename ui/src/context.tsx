import React, {
  type ComponentType,
  type ImgHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import type { UrlObject } from "url";
import url from "url";

export type RubyUILinkProps = {
  href: string | UrlObject;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-current"?:
    | boolean
    | "time"
    | "false"
    | "true"
    | "page"
    | "step"
    | "location"
    | "date";
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  replace?: boolean;
  shallow?: boolean;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  tabIndex?: number;
};

export type RubyUIContextLinkType = ComponentType<
  RubyUILinkProps & React.RefAttributes<HTMLAnchorElement>
>;

export type RubyUIContextImageType = ComponentType<
  ImgHTMLAttributes<HTMLImageElement> & React.RefAttributes<HTMLImageElement>
>;

export type RubyUIContextType = {
  components: {
    link: RubyUIContextLinkType;
    image?: RubyUIContextImageType;
  };
};

export const aLink: RubyUIContextLinkType = React.forwardRef<
  HTMLAnchorElement,
  RubyUILinkProps
>(
  (
    {
      href,
      children,
      replace: _replace,
      shallow: _shallow,
      prefetch: _prefetch,
      ...rest
    },
    ref
  ) => {
    const hrefAsString = typeof href !== "string" ? url.format(href) : href;

    return (
      <a ref={ref} href={hrefAsString} {...rest}>
        {children}
      </a>
    );
  }
);

export const noHrefLink: RubyUIContextLinkType = React.forwardRef<
  HTMLAnchorElement,
  RubyUILinkProps
>(
  (
    {
      className,
      "aria-current": ariaCurrent,
      "aria-label": ariaLabel,
      onClick,
      children,
    },
    ref
  ) => (
    <a
      ref={ref}
      className={className}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </a>
  )
);

export const RubyUIContext = React.createContext<RubyUIContextType>({
  components: {
    link: aLink,
  },
});
