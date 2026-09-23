// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import { A, Grid } from "@marketing/components/home/ContentComponents";
import { menuConfig } from "@marketing/components/home/menu/config";
import {
  getVisibleFooterLinks,
  getVisibleFooterSections,
} from "@marketing/lib/marketing_visibility";
import { RubyLogoGray } from "@ruby-ai/ui";
import Image from "next/image";
import type { LinkProps } from "next/link";
import Link from "next/link";
import * as React from "react";

export function FooterNavigation() {
  return (
    <div className="footer-navigation relative z-11 flex w-full shrink-0 flex-col items-center gap-6 overflow-hidden border-t border-border bg-muted-background pb-16 pt-12">
      <div
        className="footer-navigation__art hidden md:block"
        aria-hidden="true"
      >
        <Image
          src="/static/Wallpaper9.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 68vw"
          className="footer-navigation__art-image"
        />
      </div>
      <div className="relative z-10 w-full px-6 sm:px-12">
        <Grid gap="gap-6">
          <div className="col-span-12">
            <RubyLogoGray className="h-6 w-24" />
          </div>
          {getVisibleFooterSections(menuConfig.footerNav).map((item, index) => (
            <div
              key={index}
              className="col-span-6 flex flex-col space-y-2 sm:col-span-4 md:col-span-2"
            >
              {item.href ? (
                <FooterLink
                  key={item.href}
                  href={item.href}
                  isExternal={item.isExternal}
                >
                  {item.title}
                </FooterLink>
              ) : (
                <div className="copy-xs block select-none py-2 font-semibold uppercase leading-none text-primary-400 no-underline outline-hidden">
                  {item.title}
                </div>
              )}
              {item?.items?.length &&
                getVisibleFooterLinks(item.title, item.items)
                  .filter((item) => item.title.trim() !== "")
                  .map((item, itemIndex) => (
                    <React.Fragment key={item.href ?? `item-${itemIndex}`}>
                      {item.href ? (
                        <FooterLink
                          href={item.href}
                          isExternal={item.isExternal}
                          tag={item.tag}
                        >
                          {item.title}
                        </FooterLink>
                      ) : (
                        <div className="copy-xs block select-none py-2 pt-4 uppercase text-primary-800 no-underline outline-hidden">
                          {item.title}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

interface FooterLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
  tag?: string;
}

function FooterLink({
  href,
  children,
  isExternal,
  tag,
  ...props
}: FooterLinkProps) {
  return (
    <Link href={href} target={isExternal ? "_blank" : undefined} {...props}>
      <span className="inline-flex items-center gap-2">
        <A variant="secondary" className="label-sm">
          {children}
        </A>
        {tag && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium leading-none tracking-wide text-blue-600">
            {tag}
          </span>
        )}
      </span>
    </Link>
  );
}
