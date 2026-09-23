import type { ReactNode } from "react";

interface HeroTestimonial {
  quote: string;
  company: string;
  author: string;
  image: string;
}

interface HeroConfig {
  headline: ReactNode;
  subtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  testimonials: HeroTestimonial[];
}

interface ComparisonCardItem {
  text: string;
}

interface ComparisonApproach {
  title: string;
  items: ComparisonCardItem[];
  variant: "warning" | "positive";
}

interface WhyReason {
  title: string;
  description: string;
  iconColor: "amber" | "red" | "purple" | "blue";
}

interface ComparisonTableRow {
  name: string;
  ruby: string;
  ms: string;
  google: string;
  claude: string;
  perplexity: string;
}

interface RubyProConfig {
  pros: string[];
  testimonials: HeroTestimonial[];
}

interface CTAConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface ChatGptEnterpriseConfig {
  hero: HeroConfig;
  logoBarTitle: string;
  whatIs: {
    title: string;
    description: string;
    catchLine: ReactNode;
    approaches: [ComparisonApproach, ComparisonApproach];
  };
  whyEvaluate: {
    title: string;
    subtitle: string;
    reasons: WhyReason[];
  };
  comparisonTable: {
    title: string;
    rows: ComparisonTableRow[];
  };
  rubyDeepDive: RubyProConfig;
  cta: CTAConfig;
}

export const chatGptEnterpriseConfig: ChatGptEnterpriseConfig = {
  hero: {
    headline: (
      <>
        The 6 Best <span className="text-[#1C91FF]">ChatGPT</span>
        <br />
        <span className="text-[#1C91FF]">Enterprise</span> Alternatives
        <br />
        for Teams in 2026
      </>
    ),
    subtitle:
      "See how Ruby connects team agents to company knowledge and tools.",
    ctaButtonText: "See the Comparison",
    ctaButtonLink: "#ruby-deep-dive",
    secondaryButtonText: "Talk to an Expert",
    secondaryButtonLink: "/home/contact",
    testimonials: [
      {
        quote:
          "Ruby is the most impactful software we've adopted since building Clay.",
        company: "Clay",
        author: "Everett Berry, Head of GTM Engineering",
        image: "/static/landing/chatgpt-enterprise/everett.png",
      },
      {
        quote:
          "We use Ruby to query our internal API documentation instantly. It's magic.",
        company: "Vanta",
        author: "Daniel Baralt, Head of AI Solutions",
        image: "/static/landing/chatgpt-enterprise/martin.png",
      },
      {
        quote:
          "The AI assistants feel like having expert teammates available 24/7.",
        company: "WhatNot",
        author: "Martin Perrin, Head of Trust & Safety",
        image: "/static/landing/chatgpt-enterprise/daniel.png",
      },
    ],
  },

  logoBarTitle: "2,000+ teams already building with Ruby",

  whatIs: {
    title: "What is ChatGPT Enterprise?",
    description:
      "ChatGPT Enterprise is a business AI workspace designed for organizations that need centralized administration and access controls.",
    catchLine: (
      <>
        But there&apos;s a catch: It&apos;s fundamentally a{" "}
        <span className="text-[#1C91FF]">single-player tool.</span>
      </>
    ),
    approaches: [
      {
        title: "The ChatGPT Approach",
        variant: "warning",
        items: [
          { text: "Isolated chat threads for each employee" },
          { text: "Limited flexibility across team workflows" },
          {
            text: "Limited, read-only connections to your data (no fully open MCP integrations)",
          },
        ],
      },
      {
        title: "The Ruby Approach",
        variant: "positive",
        items: [
          { text: "Shared AI agents acting as team infrastructure" },
          { text: "Team agents connected to company knowledge and tools" },
          {
            text: "Connect approved company knowledge and tools to shared agents",
          },
        ],
      },
    ],
  },

  whyEvaluate: {
    title: "Why teams look for alternatives",
    subtitle:
      "ChatGPT Enterprise is fundamentally a single-player tool. It's great for individual productivity, but it doesn't create the compounding effect teams need at scale.",
    reasons: [
      {
        title: "Limited flexibility across team workflows",
        description:
          "Teams need workflows that can be configured around their company knowledge, tools, and operating practices.",
        iconColor: "amber",
      },
      {
        title: "Limited company data integration",
        description:
          "Teams need a practical way to connect approved company knowledge and tools instead of manually moving context between systems.",
        iconColor: "red",
      },
      {
        title: "No specialized agents or workflows",
        description:
          "Basic assistants are not always enough for multi-step workflows or department-specific agents that support work across systems.",
        iconColor: "purple",
      },
      {
        title: "Generic capabilities for all teams",
        description:
          "Marketing, sales, engineering, and support need different workflows. Ruby lets teams configure agents around their company knowledge and ways of working.",
        iconColor: "blue",
      },
    ],
  },

  comparisonTable: {
    title: "ChatGPT Enterprise alternatives at a glance",
    rows: [
      {
        name: "Starting price",
        ruby: "Lite from $55/year",
        ms: "$21/user/month",
        google: "$14/user/month",
        claude: "Custom",
        perplexity: "$40/user/month",
      },
      {
        name: "Best for",
        ruby: "Specialized agents + company data",
        ms: "Microsoft ecosystem",
        google: "Google Workspace teams",
        claude: "Coding & long documents",
        perplexity: "Research teams",
      },
      {
        name: "Key differentiator",
        ruby: "Shared agents connected to company knowledge and tools",
        ms: "Native Office/Teams integration",
        google: "1M token context, Google app integration",
        claude: "Superior coding, 1M token context",
        perplexity: "Real-time search with citations",
      },
    ],
  },

  rubyDeepDive: {
    pros: [
      "Team agents configured around company knowledge and workflows",
      "Build domain expert AI agents in minutes without an engineer",
      "Team collaboration that scales with shared agent instructions",
      "Agents execute actions across systems via MCP protocol",
      "Connect approved company tools and knowledge to shared team agents",
      "Interactive visualizations—Frames create live dashboards and data views",
    ],
    testimonials: [
      {
        quote:
          "Ruby is the most impactful software we've adopted since building Clay.",
        company: "Clay",
        author: "Everett Berry, Head of GTM Engineering",
        image: "/static/landing/chatgpt-enterprise/everett.png",
      },
      {
        quote:
          "We use Ruby to query our internal API documentation instantly. It's magic.",
        company: "Vanta",
        author: "Daniel Baralt, Head of AI Solutions",
        image: "/static/landing/chatgpt-enterprise/martin.png",
      },
      {
        quote:
          "The AI assistants feel like having expert teammates available 24/7.",
        company: "WhatNot",
        author: "Martin Perrin, Head of Trust & Safety",
        image: "/static/landing/chatgpt-enterprise/daniel.png",
      },
    ],
  },

  cta: {
    title: "Want AI that actually knows your company?",
    subtitle: "Build team agents around your company knowledge and workflows.",
    buttonText: "Schedule a Demo",
    buttonLink: "/home/contact",
  },
};
