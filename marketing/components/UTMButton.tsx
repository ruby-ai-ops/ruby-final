"use client";

import { appendUTMParams } from "@marketing/lib/utils/utm";
import type { RegularButtonProps } from "@ruby-ai/ui";
import { Button } from "@ruby-ai/ui";

interface UTMButtonProps extends Omit<RegularButtonProps, "href"> {
  href?: string;
}

const UTMButton = ({ href, ...props }: UTMButtonProps) => {
  const finalHref =
    href && !href.startsWith("http") && !href.startsWith("mailto:")
      ? appendUTMParams(href)
      : href;

  return <Button href={finalHref} {...props} />;
};

export default UTMButton;
