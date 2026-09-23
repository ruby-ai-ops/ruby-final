// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file

import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";
import {
  SOLUTION_CATALOG_GROUPS,
  SOLUTION_CATALOG_GROUP_LABEL_CLASS,
  type SolutionCatalogTone,
} from "@marketing/components/home/content/Product/homeTeamUsageData";
import { getIcon } from "@marketing/components/resources/resources_icons";
import { ChevronRight, Icon } from "@ruby-ai/ui";
import Link from "next/link";

const TONE_CLASSES: Record<SolutionCatalogTone, string> = {
  clay: "bg-[#E7EEF7]",
  ember: "bg-[#E7EEF7]",
  olive: "bg-[#E7EEF7]",
  sky: "bg-[#E7EEF7]",
  fig: "bg-[#E7EEF7]",
  leather: "bg-[#E7EEF7]",
};

export function HomeSolutionCatalog() {
  return (
    <HomeReveal delay={400}>
      <div className="rounded-[28px] bg-[#F3F2EF] p-5 shadow-[0_22px_60px_-50px_rgba(35,35,32,0.32)] sm:p-6 md:p-8">
        <div className="grid gap-9 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          {SOLUTION_CATALOG_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-4 sm:gap-5">
              <div className={SOLUTION_CATALOG_GROUP_LABEL_CLASS}>
                {group.label}
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {group.items.map((item) => {
                  const ItemIcon = getIcon(item.icon);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group/catalog grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-black/[0.05] bg-white/80 px-2.5 py-2 text-sm font-medium text-foreground transition-[transform,border-color,background-color,box-shadow] [transition-duration:320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [@media(pointer:coarse)]:active:scale-[0.99] [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:border-black/[0.09] [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:shadow-[0_14px_34px_-28px_rgba(35,35,32,0.42)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transform-none"
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors [transition-duration:320ms] [@media(hover:hover)]:group-hover/catalog:bg-[#DCE8F5] ${TONE_CLASSES[item.tone]}`}
                      >
                        <Icon
                          visual={ItemIcon}
                          size="sm"
                          className="text-[#4E6B86]"
                        />
                      </span>
                      <span className="min-w-0 leading-tight">
                        {item.label}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.05] text-muted-foreground transition-[background-color,color,transform] [transition-duration:320ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover/catalog:translate-x-0.5 [@media(hover:hover)]:group-hover/catalog:bg-foreground/[0.08] [@media(hover:hover)]:group-hover/catalog:text-foreground motion-reduce:transform-none">
                        <Icon visual={ChevronRight} size="xs" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomeReveal>
  );
}
