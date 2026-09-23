import type { CustomResourceIconType } from "@marketing/components/resources/resources_icons";

export type TeamUsageId =
  | "sales"
  | "support"
  | "marketing"
  | "data"
  | "engineering";

export const TEAM_ROUTE_BY_ID: Record<TeamUsageId, string> = {
  sales: "/home/solutions/sales",
  support: "/home/solutions/customer-support",
  marketing: "/home/solutions/marketing",
  data: "/home/solutions/data-analytics",
  engineering: "/home/solutions/engineering",
};

interface SolutionCatalogItem {
  label: string;
  href: string;
  icon: CustomResourceIconType;
  tone: SolutionCatalogTone;
}

export type SolutionCatalogTone =
  | "clay"
  | "ember"
  | "olive"
  | "sky"
  | "fig"
  | "leather";

export const SOLUTION_CATALOG_GROUP_LABEL_CLASS =
  "text-sm font-bold uppercase tracking-normal text-foreground/70";

interface SolutionCatalogGroup {
  label: "Departments" | "Industries";
  items: readonly SolutionCatalogItem[];
}

export const SOLUTION_CATALOG_GROUPS: readonly SolutionCatalogGroup[] = [
  {
    label: "Departments",
    items: [
      {
        label: "Sales",
        href: "/home/solutions/sales",
        icon: "ActionBriefcaseIcon",
        tone: "sky",
      },
      {
        label: "Customer Support",
        href: "/home/solutions/customer-support",
        icon: "ActionCustomerServiceIcon",
        tone: "fig",
      },
      {
        label: "Marketing & Content",
        href: "/home/solutions/marketing",
        icon: "ActionMegaphoneIcon",
        tone: "clay",
      },
      {
        label: "Engineering",
        href: "/home/solutions/engineering",
        icon: "ActionCodeBoxIcon",
        tone: "ember",
      },
      {
        label: "Data & Analytics",
        href: "/home/solutions/data-analytics",
        icon: "ActionDashboardIcon",
        tone: "olive",
      },
      {
        label: "Knowledge",
        href: "/home/solutions/knowledge",
        icon: "ActionBookOpenIcon",
        tone: "leather",
      },
      {
        label: "IT",
        href: "/home/solutions/it",
        icon: "ActionServerIcon",
        tone: "sky",
      },
      {
        label: "Legal",
        href: "/home/solutions/legal",
        icon: "ActionScalesIcon",
        tone: "clay",
      },
      {
        label: "People",
        href: "/home/solutions/recruiting-people",
        icon: "ActionUserGroupIcon",
        tone: "leather",
      },
      {
        label: "Productivity",
        href: "/home/solutions/productivity",
        icon: "ActionRocketIcon",
        tone: "olive",
      },
    ],
  },
  {
    label: "Industries",
    items: [
      {
        label: "B2B SaaS",
        href: "/home/industry/b2b-saas",
        icon: "ActionCompanyIcon",
        tone: "sky",
      },
      {
        label: "Consulting",
        href: "/home/industry/consulting",
        icon: "ActionShakeHandsIcon",
        tone: "fig",
      },
      {
        label: "Financial Services",
        href: "/home/industry/financial-services",
        icon: "ActionBankIcon",
        tone: "olive",
      },
      {
        label: "Insurance",
        href: "/home/industry/insurance",
        icon: "ActionUmbrellaIcon",
        tone: "leather",
      },
      {
        label: "Marketplaces",
        href: "/home/industry/marketplace",
        icon: "ActionStoreIcon",
        tone: "ember",
      },
      {
        label: "Retail & E-commerce",
        href: "/home/industry/retail-ecommerce",
        icon: "ActionShoppingBasketIcon",
        tone: "clay",
      },
    ],
  },
];
