import type { MultiProductComparisonColumn } from "@marketing/components/home/content/Competitive/MultiProductComparisonTable";
import type { FAQItem } from "@marketing/components/home/FAQ";
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

interface RubyProConfig {
  pros: string[];
  testimonials: HeroTestimonial[];
}

interface PricingRow {
  product: string;
  price: string;
  includes: string;
  caveat: string;
}

interface PricingConfig {
  title: string;
  subtitle: string;
  gleanDescription: string;
  rows: PricingRow[];
}

export interface GleanLandingConfig {
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
  pricing: PricingConfig;
  comparisonTable: {
    title: string;
    columns: MultiProductComparisonColumn[];
    rows: Record<string, string>[];
  };
  rubyDeepDive: RubyProConfig;
  faq: FAQItem[];
}

export const gleanLandingConfig: GleanLandingConfig = {
  hero: {
    headline: (
      <>
        The Best{" "}
        <span className="bg-linear-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Glean Alternatives
        </span>
        <br />
        for Enterprise Teams
        <br />
        in 2026
      </>
    ),
    subtitle:
      "See how Ruby connects team agents to company knowledge and tools.",
    ctaButtonText: "See the Comparison",
    ctaButtonLink: "#ruby-deep-dive",
    secondaryButtonText: "Talk to an Expert",
    secondaryButtonLink: "/home/contact",
  },

  logoBarTitle: "2,000+ teams already building with Ruby",

  whatIs: {
    title: "What is Glean?",
    description:
      "Glean is an enterprise search platform that indexes workplace data and provides contextual answers. It is designed to help teams find information scattered across company tools.",
    catchLine: (
      <>
        But there&apos;s a catch: It&apos;s fundamentally a{" "}
        <span className="bg-linear-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          search-first tool.
        </span>{" "}
        Teams often need more than finding information. They need workflows that
        can understand context and help move work forward.
      </>
    ),
    approaches: [
      {
        title: "The Glean Approach",
        variant: "warning",
        items: [
          { text: "Search-first: finds answers but can't execute tasks" },
          {
            text: "Limited workflow automation with no multi-step agent capabilities",
          },
          { text: "Opaque, custom pricing with steep tier jumps" },
        ],
      },
      {
        title: "The Ruby Approach",
        variant: "positive",
        items: [
          {
            text: "Agent-first: AI teammates that search, reason, and take action",
          },
          { text: "Team agents connected to company knowledge and tools" },
          {
            text: "Workflows that connect company knowledge with team agents",
          },
        ],
      },
    ],
  },

  whyEvaluate: {
    title: "Why teams evaluate Glean competitors and alternatives",
    subtitle:
      "Glean is a strong enterprise search tool, but teams increasingly need AI that goes beyond finding information. They need AI that acts on it.",
    reasons: [
      {
        title: "Search alone doesn't move the needle",
        description:
          "Finding information is table stakes. Teams need AI that can take multi-step actions across systems: drafting responses, updating CRMs, triaging tickets, and executing workflows end-to-end.",
        iconColor: "amber",
      },
      {
        title: "Limited customization for specific workflows",
        description:
          "Glean's search capabilities are broad but not deep. Marketing, sales, engineering, and support each need specialized agents trained on their domain, not a generic search bar.",
        iconColor: "red",
      },
      {
        title: "Teams need more than search",
        description:
          "Teams often need more than a search surface. Ruby is built around team agents connected to company knowledge and approved tools.",
        iconColor: "purple",
      },
      {
        title: "No agent-first architecture",
        description:
          "Glean was built for search and retrofitted for AI. Ruby was built from day one for agentic automation. Agents that collaborate, trigger actions, and improve over time.",
        iconColor: "blue",
      },
    ],
  },

  pricing: {
    title: "Glean pricing vs competitors",
    subtitle:
      "Glean does not publish pricing on its website. Based on industry reports, Glean's base license starts around $45-50 per user per month, with AI add-ons (~$15/user), mandatory support fees (10% of ARR), and annual renewal increases of 7-12% pushing total cost to $50-65+ per user per month.",
    gleanDescription:
      "Glean requires custom quotes for all plans, with reported minimums of 100+ seats and minimum annual contracts of $50,000-$60,000. Many teams discover unexpected costs from mandatory support fees, AI capability add-ons, and cloud hosting charges that can exceed $10,000/month for mid-sized deployments. There is no free trial or self-serve option.",
    rows: [
      {
        product: "Ruby",
        price: "Lite $55/year; Pro $10/month; Plus $15/month; Max $20/month",
        includes: "Shared agents, approved integrations, and no-code builder",
        caveat: "Published seat pricing with monthly credit allowances",
      },
      {
        product: "Glean",
        price: "Custom (est. $50-65+/user/month total)",
        includes: "Enterprise search, 100+ connectors, AI answers",
        caveat:
          "Annual contract, 100+ seat minimums, mandatory support fees, AI add-ons extra",
      },
      {
        product: "Microsoft Copilot",
        price: "$30/user/month",
        includes: "Office/Teams AI, requires Microsoft 365 subscription",
        caveat: "Add-on cost on top of existing Microsoft license",
      },
      {
        product: "Guru",
        price: "$25/user/month",
        includes: "Knowledge management, verification workflows",
        caveat: "Limited AI capabilities compared to newer platforms",
      },
      {
        product: "Notion AI",
        price: "$22/user/month",
        includes: "Workspace AI, document search, basic automation",
        caveat: "Only works within Notion, performance issues at scale",
      },
    ],
  },

  comparisonTable: {
    title: "Glean competitors and alternatives at a glance",
    columns: [
      { key: "ruby", label: "Ruby", highlight: true },
      { key: "copilot", label: "Microsoft Copilot" },
      { key: "guru", label: "Guru" },
      { key: "notion", label: "Notion AI" },
      { key: "chatgpt", label: "ChatGPT Enterprise" },
      { key: "gemini", label: "Gemini Enterprise" },
    ],
    rows: [
      {
        name: "Starting price",
        ruby: "Lite from $55/year",
        copilot: "$30/user/month",
        guru: "$25/user/month",
        notion: "$22/user/month",
        chatgpt: "Custom",
        gemini: "Custom",
      },
      {
        name: "Best for",
        ruby: "AI agents + company data",
        copilot: "Microsoft ecosystem",
        guru: "Sales & support teams",
        notion: "Small-medium teams",
        chatgpt: "Large organizations",
        gemini: "Google Workspace teams",
      },
      {
        name: "Task automation",
        ruby: "Full multi-step agents",
        copilot: "Limited",
        guru: "Limited",
        notion: "Within Notion only",
        chatgpt: "Limited",
        gemini: "Agentic capabilities",
      },
      {
        name: "Key differentiator",
        ruby: "Agent-first, 50+ integrations, no-code builder",
        copilot: "Native Office/Teams integration",
        guru: "Knowledge verification, browser extension",
        notion: "All-in-one workspace",
        chatgpt: "Brand recognition, unlimited GPT access",
        gemini: "Multi-modal analysis, Google integration",
      },
    ],
  },

  rubyDeepDive: {
    pros: [
      "Agent-first architecture: AI that acts, not just answers",
      "No-code agent builder: create specialized agents in minutes",
      "Team agents configured around company knowledge and workflows",
      "Connect approved company tools and knowledge to shared team agents",
      "Multi-agent orchestration for complex cross-domain workflows",
      "Share structured work outputs with your team",
    ],
    testimonials: [
      {
        quote:
          "Ruby is the most impactful software we've adopted since building Clay. It delivers immediate value while continuously getting smarter and more valuable over time.",
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

  faq: [
    {
      question: "How much does Glean cost?",
      answer: (
        <>
          <p>
            Glean does not publish pricing publicly. All plans require a custom
            quote. Based on industry reports, Glean&apos;s base license starts
            around $45-50 per user per month, with AI capabilities often adding
            ~$15/user and a mandatory support fee of 10% of ARR. Total cost per
            user typically ranges from $50-65+ per month, with minimum annual
            contracts of $50,000-$60,000 and 100+ seat requirements. In
            contrast, Ruby publishes paid Lite, Pro, Plus, and Max seat prices
            together with each seat&apos;s monthly credit allowance.
          </p>
        </>
      ),
    },
    {
      question: "Who are Glean's main competitors?",
      answer: (
        <>
          <p>
            The main Glean competitors in the enterprise AI space include Ruby,
            Microsoft Copilot, Guru, Notion AI, ChatGPT Enterprise, and Google
            Gemini Enterprise. Each takes a different approach:
          </p>
          <ul>
            <li>
              <strong>Ruby:</strong> Agent-first platform that goes beyond
              search to execute tasks and automate workflows
            </li>
            <li>
              <strong>Microsoft Copilot:</strong> Best for teams already deep in
              the Microsoft 365 ecosystem
            </li>
            <li>
              <strong>Guru:</strong> Focused on knowledge management for sales
              and support teams
            </li>
            <li>
              <strong>Notion AI:</strong> Works well for small-medium teams
              already using Notion
            </li>
            <li>
              <strong>ChatGPT Enterprise:</strong> General-purpose AI chat for
              large organizations
            </li>
            <li>
              <strong>Gemini Enterprise:</strong> Best for Google Workspace
              teams wanting search plus agentic AI
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "How is Ruby different from Glean?",
      answer: (
        <>
          <p>
            While Glean focuses primarily on enterprise search and finding
            information, Ruby is built around AI agents that can actually
            execute tasks. With Ruby, you&apos;re not just getting answers.
            You&apos;re getting AI teammates that can:
          </p>
          <ul>
            <li>Take multi-step actions across your tools</li>
            <li>Automate complex workflows without code</li>
            <li>Collaborate with multiple specialized agents</li>
            <li>Learn and improve from your team&apos;s feedback</li>
          </ul>
        </>
      ),
    },
    {
      question: "Can Ruby replace our existing search tools?",
      answer: (
        <>
          <p>
            Yes. Ruby includes powerful search capabilities across all your
            connected data sources, but goes further by letting you build agents
            that can act on that information. You get the best of both worlds:
            instant answers when you need them, plus AI agents that can handle
            tasks end-to-end.
          </p>
        </>
      ),
    },
    {
      question: "What makes Ruby's agents different from chatbots?",
      answer: (
        <>
          <p>
            Traditional chatbots can answer questions. Ruby agents are designed
            to support team workflows:
          </p>
          <ul>
            <li>
              <strong>Multi-step execution:</strong> They can break down complex
              tasks and execute them across multiple tools
            </li>
            <li>
              <strong>Tool integration:</strong> Connect approved company
              systems and knowledge to shared agents.
            </li>
            <li>
              <strong>Knowledge base access:</strong> Real-time access to your
              company&apos;s documentation and data
            </li>
            <li>
              <strong>Orchestration:</strong> Multiple agents can collaborate on
              complex workflows
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "How quickly can we get started with Ruby?",
      answer: (
        <>
          <p>
            You can begin by connecting approved data sources, configuring an
            agent, and trying it with a focused team workflow.
          </p>
        </>
      ),
    },
    {
      question: "Is Ruby secure for enterprise use?",
      answer: (
        <>
          <p>
            Ruby is designed for teams that need controlled access to company
            knowledge and tools while they build and use shared agents.
          </p>
        </>
      ),
    },
  ],
};
