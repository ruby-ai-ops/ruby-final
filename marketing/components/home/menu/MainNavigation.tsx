// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import { menuConfig } from "@marketing/components/home/menu/config";
import { getVisibleNavigationItems } from "@marketing/lib/marketing_visibility";
import { classNames } from "@marketing/lib/utils";
import { ChevronDown } from "@ruby-ai/ui";
import Link from "next/link";
import * as React from "react";

export function MainNavigation() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const navigationItems = getVisibleNavigationItems(menuConfig.mainNav);

  return (
    <nav
      aria-label="Main"
      className="relative z-10 hidden items-center gap-1 xl:flex xl:justify-self-center"
    >
      {navigationItems.map((item, index) => {
        if (item.href) {
          return (
            <Link
              key={index}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              className="inline-flex h-9 items-center px-4 text-base font-semibold text-black transition-colors duration-150 hover:text-black"
            >
              {item.title}
            </Link>
          );
        }

        const isOpen = openId === item.title;

        return (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setOpenId(item.title)}
            onMouseLeave={() => setOpenId(null)}
            onFocus={() => setOpenId(item.title)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setOpenId(null);
              }
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => {
                setOpenId(item.title);
              }}
              className="inline-flex h-9 items-center gap-1 px-4 text-base font-semibold text-black transition-colors duration-150 hover:text-black focus:outline-hidden"
            >
              {item.title}
              <ChevronDown
                className={classNames(
                  "mt-px h-3 w-3 opacity-40 transition-transform duration-200 ease-out motion-reduce:transition-none",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
                aria-hidden="true"
              />
            </button>

            <div
              role="menu"
              aria-label={item.title}
              className={classNames(
                "absolute left-1/2 top-full -translate-x-1/2 origin-top pt-3",
                "transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[opacity,transform] motion-reduce:transition-none",
                isOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
              )}
            >
              <div className="min-w-[180px] flex flex-col gap-3 rounded-2xl border border-border/60 bg-background p-5 shadow-[0_2px_6px_rgba(0,0,0,0.02),0_8px_24px_rgba(0,0,0,0.04),0_24px_48px_rgba(0,0,0,0.03)]">
                <ul
                  className={classNames(
                    "grid-rows-" + item.rows,
                    "grid grid-flow-col gap-x-10 gap-y-2"
                  )}
                >
                  {item.items?.map((subItem, subIndex) => (
                    <DropdownItem
                      key={subItem.title || `spacer-${subIndex}`}
                      title={subItem.title}
                      href={subItem.href}
                      isExternal={subItem.isExternal}
                      isColumnStart={
                        item.rows ? subIndex % item.rows === 0 : subIndex === 0
                      }
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

interface DropdownItemProps {
  title?: string;
  href?: string;
  isExternal?: boolean;
  isColumnStart?: boolean;
}

function DropdownItem({
  title,
  href,
  isExternal,
  isColumnStart,
}: DropdownItemProps) {
  if (!href) {
    return (
      <li className={classNames("pb-0.5", isColumnStart ? "pt-0" : "pt-3")}>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
          {title}
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        role="menuitem"
        className="block whitespace-nowrap py-0.5 text-[15px] font-semibold text-black transition-colors duration-100 hover:text-black"
      >
        {title}
      </Link>
    </li>
  );
}
