import type { FAQItem } from "@marketing/components/home/FAQ";
import type { ReactNode } from "react";

interface HeroConfig {
  chip: string;
  headline: ReactNode;
  postItText: string;
  valuePropTitle: string;
  valueProps: string[];
  ctaButtonText: string;
  trustBadges: string[];
}

interface ComparisonFeature {
  name: string;
  description?: string;
  ruby: "yes" | "no" | "partial";
  competitor: "yes" | "no" | "partial";
}

interface ComparisonConfig {
  rubyHeader: string;
  competitorHeader: string;
  features: ComparisonFeature[];
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  logo: string;
}

interface Differentiator {
  title: string;
  description: string;
  iconColor: "green" | "orange" | "blue" | "red";
  icon: "robot" | "bolt" | "book" | "users";
}

interface Stat {
  value: string;
  label: string;
  company: string;
  logo: string;
}

interface CTAConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  trustBadges: string[];
}

export interface ChatGPTConfig {
  hero: HeroConfig;
  comparison: ComparisonConfig;
  testimonials: Testimonial[];
  differentiators: Differentiator[];
  stats: Stat[];
  faq: FAQItem[];
  cta: CTAConfig;
}

export const chatgptConfig: ChatGPTConfig = {
  hero: {
    chip: "Ruby vs ChatGPT - Sales Use Case Comparison",
    headline: (
      <>
        <span className="text-gray-900">ChatGPT gives advice.</span>
        <br />
        <span className="bg-linear-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Ruby helps teams get work done.
        </span>
      </>
    ),
    postItText: "From repetitive follow-up to a team agent.",
    valuePropTitle: "Why teams use Ruby for agent-led work:",
    valueProps: [
      "Automate approved sales workflows with team agents.",
      "Connect approved company knowledge and tools to your agents.",
      "Build specialized agents around the way your team works.",
    ],
    ctaButtonText: "Get started",
    trustBadges: [],
  },

  comparison: {
    rubyHeader: "RUBY",
    competitorHeader: "ChatGPT",
    features: [
      {
        name: "Actions on external sales tools",
        description:
          "Connect approved company tools and knowledge to shared agents",
        ruby: "yes",
        competitor: "partial",
      },
      {
        name: "Multi-model AI",
        description: "Ruby manages model routing for every task",
        ruby: "yes",
        competitor: "no",
      },
      {
        name: "Transparent pricing",
        description:
          "Paid Lite, Pro, Plus, and Max seats with published credit allowances",
        ruby: "yes",
        competitor: "no",
      },
      {
        name: "Connected company knowledge",
        description:
          "Use approved company knowledge and tools with your team agents.",
        ruby: "yes",
        competitor: "yes",
      },
      {
        name: "Automated workflows",
        description: "Support focused workflows with shared agent instructions",
        ruby: "yes",
        competitor: "partial",
      },
      {
        name: "Team collaboration",
        description:
          "Share agents, company knowledge, and instructions across your sales team",
        ruby: "yes",
        competitor: "no",
      },
      {
        name: "Interactive dashboards (Frames)",
        description: "Share structured work outputs with your sales team",
        ruby: "yes",
        competitor: "no",
      },
      {
        name: "SOC 2 Type II certified",
        description: "Enterprise-grade security and compliance",
        ruby: "yes",
        competitor: "yes",
      },
    ],
  },

  testimonials: [
    {
      quote:
        "Ruby is the most impactful software we've adopted since building Clay. It delivers immediate value while continuously getting smarter and more valuable over time.",
      name: "Everett Berry",
      title: "Head of GTM Engineering at Clay",
      logo: "/static/landing/logos/color/clay.png",
    },
    {
      quote:
        "Ruby has transformed how our sales team operates. Our reps spend time selling, not updating spreadsheets — the AI handles the admin work automatically.",
      name: "Amance Carbero-Caux",
      title: "Employee Experience Manager at PayFit",
      logo: "/static/landing/logos/color/payfit.png",
    },
    {
      quote:
        "We cut RFP response time by 97% and our reps finally focus on deals, not documentation. Ruby plugs right into our existing sales stack.",
      name: "Danny Barati",
      title: "Business Systems Lead for GTM at Vanta",
      logo: "/static/landing/logos/gray/vanta.svg",
    },
  ],

  differentiators: [
    {
      title: "Custom AI Agents",
      description:
        "Build specialized sales agents that understand your playbooks, products, and processes — and can take action, not just answer questions.",
      iconColor: "green",
      icon: "robot",
    },
    {
      title: "Workflow Automation",
      description:
        "Agents that work while you sleep. Automate CRM updates, follow-up emails, and pipeline reports — triggered by calls, meetings, or external events.",
      iconColor: "orange",
      icon: "bolt",
    },
    {
      title: "Living Knowledge Base",
      description:
        "Your sales playbooks, competitive intel, and product knowledge stay current and accessible, connected to all your data sources in real-time.",
      iconColor: "blue",
      icon: "book",
    },
    {
      title: "Team-First Design",
      description:
        "Agents designed to collaborate with your sales team, not replace them. Full transparency, human oversight, and team-wide sharing built in.",
      iconColor: "red",
      icon: "users",
    },
  ],

  stats: [
    {
      value: "97%",
      label: "time saved on RFPs",
      company: "Watershed",
      logo: "/static/landing/logos/gray/watershed.svg",
    },
    {
      value: "58 hours",
      label: "saved per month (team of 20 sales reps)",
      company: "Clay",
      logo: "/static/landing/logos/gray/clay.svg",
    },
    {
      value: "80%",
      label: "less admin time",
      company: "Pennylane",
      logo: "/static/landing/logos/gray/pennylane.svg",
    },
    {
      value: "20%+",
      label: "productivity gains in sales operations",
      company: "Vanta",
      logo: "/static/landing/logos/gray/vanta.svg",
    },
  ],

  faq: [
    {
      question: "How is Ruby different from ChatGPT for sales teams?",
      answer: (
        <>
          <p>
            ChatGPT is a great conversational AI, but it can't take action in
            your sales tools. Ruby is built around AI agents that actually
            execute tasks in your stack. With Ruby, your sales team gets AI
            teammates that can:
          </p>
          <ul>
            <li>Update CRM records and pipeline stages automatically</li>
            <li>Draft and send follow-up emails after every call</li>
            <li>Generate RFP responses from your knowledge base</li>
            <li>
              Collaborate across your approved company tools and knowledge
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "Can Ruby integrate with my existing CRM?",
      answer: (
        <>
          <p>
            Yes. Ruby can connect team agents to approved company tools and
            knowledge so they can support your workflows with the right context.
          </p>
        </>
      ),
    },
    {
      question: "What does a sales agent in Ruby actually do?",
      answer: (
        <>
          <p>
            A Ruby sales agent is a specialized AI teammate configured for your
            specific workflows. Examples include:
          </p>
          <ul>
            <li>
              <strong>Call summarizer:</strong> Automatically updates CRM with
              meeting notes and next steps
            </li>
            <li>
              <strong>RFP responder:</strong> Generates proposal drafts from
              your knowledge base in minutes
            </li>
            <li>
              <strong>Pipeline analyst:</strong> Surfaces at-risk deals and
              coaching insights from your data
            </li>
            <li>
              <strong>Onboarding assistant:</strong> Ramps new reps faster with
              instant answers on products and processes
            </li>
          </ul>
        </>
      ),
    },
    {
      question: "How quickly can we get started?",
      answer: (
        <>
          <p>
            Most sales teams are up and running within minutes. Our no-code
            builder means you can create your first custom agent without any
            technical expertise. Connect your data sources, configure your
            agent's instructions, and you're ready to go. For enterprise
            deployments, we offer dedicated onboarding support.
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

  cta: {
    title: "Start building AI teammates for your Sales team",
    subtitle: "Build your first team agent with Ruby.",
    buttonText: "Get started",
    trustBadges: [],
  },
};
