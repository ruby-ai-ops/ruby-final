import { RubyUIContext } from "@ui/context";
import React, { type ImgHTMLAttributes } from "react";

/**
 * Renders an image through the host application's image component when one is
 * provided via RubyUIContext (e.g. next/image), falling back to a plain
 * `<img>` otherwise. Use it inside RubyUI components instead of a raw `<img>`
 * so consuming apps can plug in their own optimized image rendering.
 *
 * @summary Context-aware image element.
 */
export const ImageWrapper = React.forwardRef<
  HTMLImageElement,
  ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => {
  const { components } = React.useContext(RubyUIContext);
  const Image = components.image;

  if (Image) {
    return <Image ref={ref} {...props} />;
  }

  return <img ref={ref} {...props} />;
});
