// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const CONTENT_SECURITY_POLICIES = [
  "default-src 'none';",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ruby.ad *.ruby.ad https://ruby.ad https://*.ruby.ad *.googletagmanager.com *.google-analytics.com *.hsforms.net *.hs-scripts.com *.hs-analytics.net *.hubspot.com *.hs-banner.com *.hscollectedforms.net *.usercentrics.eu *.licdn.com *.datadoghq-browser-agent.com *.doubleclick.net *.hsadspixel.net *.wistia.net *.ads-twitter.com apis.google.com;`,
  `script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' ruby.ad *.ruby.ad https://ruby.ad https://*.ruby.ad *.googletagmanager.com *.google-analytics.com *.hsforms.net *.hs-scripts.com *.hs-analytics.net *.hubspot.com *.hs-banner.com *.hscollectedforms.net *.usercentrics.eu *.licdn.com *.datadoghq-browser-agent.com *.doubleclick.net *.hsadspixel.net *.wistia.net *.hsappstatic.net *.hubspotusercontent-eu1.net import-cdn.default.com *.ads-twitter.com *.vector.co apis.google.com;`,
  `style-src 'self' 'unsafe-inline' *.fontawesome.com *.googleapis.com;`,
  `style-src-elem 'self' 'unsafe-inline' *.fontawesome.com *.googleapis.com *.gstatic.com;`,
  `img-src 'self' data: blob: webkit-fake-url: https:;`,
  `connect-src 'self' blob: ruby.ad *.ruby.ad https://ruby.ad https://*.ruby.ad browser-intake-datadoghq.eu *.google-analytics.com *.googlesyndication.com *.googleadservices.com cdn.jsdelivr.net *.hsforms.com *.hscollectedforms.net *.hubspot.com *.hubapi.com *.hsappstatic.net *.usercentrics.eu *.ads.linkedin.com px.ads.linkedin.com google.com *.google.com *.workos.com translate-pa.googleapis.com forms.default.com nucleus.default.com *.default.com *.vector.co;`,
  `frame-src 'self' ruby.ad *.ruby.ad *.wistia.net eu.viz.ruby.ad viz.ruby.ad *.hsforms.net *.googletagmanager.com *.doubleclick.net *.default.com *.hsforms.com *.youtube.com *.youtube-nocookie.com *.google.com docs.google.com drive.google.com view.officeapps.live.com${isDev ? " http://localhost:3007 http://localhost:3011" : ""};`,
  `font-src 'self' data: ruby.ad *.ruby.ad https://ruby.ad https://*.ruby.ad *.gstatic.com *.wistia.net fonts.cdnfonts.com migaku-public-data.migaku.com;`,
  `media-src 'self' data:;`,
  `object-src 'none';`,
  `form-action 'self' *.hsforms.com;`,
  `base-uri 'self';`,
  `frame-ancestors 'self' https://ruby.ad https://*.ruby.ad https://app.contentful.com${isDev ? " http://localhost:3000 http://localhost:3007" : ""};`,
  `manifest-src 'self';`,
  `worker-src 'self' blob:;`,
  ...(isDev ? [] : ["upgrade-insecure-requests;"]),
].join(" ");

const config = {
  distDir: isDev ? ".next" : ".next-build",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
    ],
  },
  swcMinify: true,
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 200,
  },
  experimental: {
    ...(!isDev && { esmExternals: false }),
    // undici is a server-side fetch used by HubSpot egress; keep it out of
    // webpack's client/server bundle and let Node resolve it natively.
    serverComponentsExternalPackages: ["undici"],
  },
  async redirects() {
    return [
      {
        source:
          "/blog/how-patch-empowered-70-of-its-team-to-use-ai-agents-weekly",
        destination:
          "/customers/how-patch-empowered-70-of-its-team-to-use-ai-agents-weekly",
        permanent: true,
      },
      {
        source: "/blog/how-persona-hit-80-ai-agent-adoption-with-ruby",
        destination:
          "/customers/how-persona-hit-80-ai-agent-adoption-with-ruby",
        permanent: true,
      },
      {
        source:
          "/blog/how-cmi-strategies-achieved-95-ai-adoption-across-100-consultants-with-ruby",
        destination:
          "/customers/how-cmi-strategies-achieved-95-ai-adoption-across-100-consultants-with-ruby",
        permanent: true,
      },
      {
        source:
          "/blog/how-ardabelle-became-europes-first-ai-native-private-equity-fund",
        destination:
          "/customers/how-ardabelle-became-europes-first-ai-native-private-equity-fund",
        permanent: true,
      },
      {
        source:
          "/blog/how-42-ai-agents-transformed-insigns-end-to-end-consulting-workflow",
        destination:
          "/customers/how-42-ai-agents-transformed-insigns-end-to-end-consulting-workflow",
        permanent: true,
      },
      {
        source:
          "/blog/how-watershed-got-90-of-its-team-to-leverage-ruby-agents",
        destination:
          "/customers/how-watershed-got-90-of-its-team-to-leverage-ruby-agents",
        permanent: true,
      },
      {
        source: "/blog/why-mirakl-chose-ruby-as-its-go-to-agentic-solution",
        destination:
          "/customers/why-mirakl-chose-ruby-as-its-go-to-agentic-solution",
        permanent: true,
      },
      {
        source:
          "/blog/less-admin-more-selling-how-ruby-frees-up-payfits-sales-team-to-close-more-deals",
        destination:
          "/customers/less-admin-more-selling-how-ruby-frees-up-payfits-sales-team-to-close-more-deals",
        permanent: true,
      },
      {
        source:
          "/blog/how-wakam-cut-legal-contract-analysis-time-by-50-with-ruby",
        destination:
          "/customers/how-wakam-cut-legal-contract-analysis-time-by-50-with-ruby",
        permanent: true,
      },
      {
        source:
          "/blog/doctolibs-ai-adoption-playbook-from-30-person-pilot-to-company-wide-deployment",
        destination:
          "/customers/doctolibs-ai-adoption-playbook-from-30-person-pilot-to-company-wide-deployment",
        permanent: true,
      },
      {
        source: "/blog/doctolib-ai-transformation-blueprint-ciso-pers",
        destination:
          "/customers/doctolib-ai-transformation-blueprint-ciso-pers",
        permanent: true,
      },
      {
        source:
          "/blog/why-doctolibs-vp-of-data-stopped-internal-development-to-buy-ruby",
        destination:
          "/customers/why-doctolibs-vp-of-data-stopped-internal-development-to-buy-ruby",
        permanent: true,
      },
      {
        source:
          "/blog/why-doctolib-made-company-wide-enterprise-ai-a-national-cause",
        destination:
          "/customers/why-doctolib-made-company-wide-enterprise-ai-a-national-cause",
        permanent: true,
      },
      {
        source:
          "/blog/wakam-empowers-teams-with-self-service-data-intelligence-while-reducing-processing-time",
        destination:
          "/customers/wakam-empowers-teams-with-self-service-data-intelligence-while-reducing-processing-time",
        permanent: true,
      },
      {
        source:
          "/blog/alans-pmm-team-transforms-sales-conversations-into-intelligence-with-ai-agents",
        destination:
          "/customers/alans-pmm-team-transforms-sales-conversations-into-intelligence-with-ai-agents",
        permanent: true,
      },
      {
        source:
          "/blog/the-end-of-data-queues-how-alan-scaled-analytics-with-ruby-2",
        destination:
          "/customers/the-end-of-data-queues-how-alan-scaled-analytics-with-ruby-2",
        permanent: true,
      },
      {
        source: "/blog/long-live-the-builders-the-minh-trinh",
        destination: "/customers/long-live-the-builders-the-minh-trinh",
        permanent: true,
      },
      {
        source: "/blog/clay-scaling-gtme-team",
        destination: "/customers/clay-scaling-gtme-team",
        permanent: true,
      },
      {
        source: "/blog/customer-support-blueground",
        destination: "/customers/customer-support-blueground",
        permanent: true,
      },
      {
        source: "/blog/alan-marketing-customer-story-production-ruby",
        destination: "/customers/alan-marketing-customer-story-production-ruby",
        permanent: true,
      },
      {
        source: "/blog/malt-customer-support",
        destination: "/customers/malt-customer-support",
        permanent: true,
      },
      {
        source: "/blog/customer-story-lifen",
        destination: "/customers/customer-story-lifen",
        permanent: true,
      },
      {
        source: "/blog/kyriba-accelerating-innovation-with-ruby",
        destination: "/customers/kyriba-accelerating-innovation-with-ruby",
        permanent: true,
      },
      {
        source:
          "/blog/how-lucas-people-analyst-at-alan-introduced-ruby-to-his-hr-team",
        destination:
          "/customers/how-lucas-people-analyst-at-alan-introduced-ruby-to-his-hr-team",
        permanent: true,
      },
      {
        source: "/blog/qonto-ruby-ai-partnership",
        destination: "/customers/qonto-ruby-ai-partnership",
        permanent: true,
      },
      {
        source: "/blog/how-valentine-head-of-marketing-at-fleet-uses-ruby",
        destination:
          "/customers/how-valentine-head-of-marketing-at-fleet-uses-ruby",
        permanent: true,
      },
      {
        source: "/blog/generative-ai-insights-alan-payfit-leaders",
        destination: "/customers/generative-ai-insights-alan-payfit-leaders",
        permanent: true,
      },
      {
        source:
          "/blog/how-thomas-uses-ai-assistants-to-manage-legal-and-data-privacy-at-didomi",
        destination:
          "/customers/how-thomas-uses-ai-assistants-to-manage-legal-and-data-privacy-at-didomi",
        permanent: true,
      },
      {
        source: "/blog/ruby-ai-payfit-efficiency",
        destination: "/customers/ruby-ai-payfit-efficiency",
        permanent: true,
      },
      {
        source: "/blog/november-five-ai-transformation-ruby",
        destination: "/customers/november-five-ai-transformation-ruby",
        permanent: true,
      },
      {
        source: "/blog/integrating-ai-workflows-alan",
        destination: "/customers/integrating-ai-workflows-alan",
        permanent: true,
      },
      {
        source: "/blog/pennylane-customer-support-journey",
        destination: "/customers/pennylane-customer-support-journey",
        permanent: true,
      },
      {
        source: "/website-privacy",
        destination: "/home/platform-privacy",
        permanent: true,
      },
      {
        source: "/platform-privacy",
        destination: "/home/platform-privacy",
        permanent: true,
      },
      {
        source: "/jobs",
        destination: "/home/about",
        permanent: true,
      },
      {
        source: "/triggers",
        destination: "https://docs.ruby.ad/docs/triggers",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/home/contact",
        permanent: true,
      },
      {
        source: "/frames",
        destination: "/home/frames",
        permanent: true,
      },
      {
        source: "/pricing",
        destination: "/home/pricing",
        permanent: true,
      },
      {
        source: "/credits",
        destination: "/home/credits",
        permanent: true,
      },
      {
        source: "/security",
        destination: "/home/security",
        permanent: true,
      },
      {
        source: "/enterprise",
        destination: "/home/enterprise",
        permanent: true,
      },
      {
        source: "/solutions/customer-support",
        destination: "/home/solutions/customer-support",
        permanent: true,
      },
      {
        source: "/solutions/data-analytics",
        destination: "/home/solutions/data-analytics",
        permanent: true,
      },
      {
        source: "/solutions/ruby-platform",
        destination: "/home/solutions/ruby-platform",
        permanent: true,
      },
      {
        source: "/solutions/engineering",
        destination: "/home/solutions/engineering",
        permanent: true,
      },
      {
        source: "/solutions/knowledge",
        destination: "/home/solutions/knowledge",
        permanent: true,
      },
      {
        source: "/solutions/marketing",
        destination: "/home/solutions/marketing",
        permanent: true,
      },
      {
        source: "/solutions/recruiting-people",
        destination: "/home/solutions/recruiting-people",
        permanent: true,
      },
      {
        source: "/solutions/sales",
        destination: "/home/solutions/sales",
        permanent: true,
      },
      {
        source: "/compare/:slug",
        destination: "/",
        permanent: true,
      },
      {
        source: "/skip",
        destination:
          "/landing/skip?utm_source=podcast&utm_medium=audio&utm_campaign=skip&utm_content=listener",
        permanent: false,
      },
      {
        // Page removed, see https://ruby.ad/ruby/pull/29781.
        source: "/home/api-pricing",
        destination: "/home/pricing",
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async headers() {
    const headers = [
      {
        key: "Content-Security-Policy",
        value: CONTENT_SECURITY_POLICIES,
      },
    ];

    if (!isDev) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=86400",
      });
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
  async rewrites() {
    return {
      afterFiles: [
        // Marketing API: public URLs stay at /m/api/* but handlers live under
        // pages/api/ so Next.js treats them as API routes (not page routes).
        {
          source: "/m/api/:path*",
          destination: "/api/:path*",
        },
        // Posthog tracking - endpoint name called "subtle1"
        {
          source: "/subtle1/static/:path*",
          destination: "https://eu-assets.i.posthog.com/static/:path*",
        },
        {
          source: "/subtle1/:path*",
          destination: "https://eu.i.posthog.com/:path*",
        },
      ],
    };
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@marketing": path.resolve(__dirname, "."),
    };

    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false,
      tls: false,
      dgram: false,
      dns: false,
    };
    return config;
  },
  // @ruby-ai/ui is a workspace symlink, so Next resolves it under the
  // monorepo tree and treats it as first-party. Without transpiling, its
  // internal global CSS imports (e.g. allotment.css inside SidebarLayout) trip
  // the "Global CSS only in _app" rule and the build fails. Transpiling routes
  // ui's modules through the local pipeline so its CSS is allowed.
  transpilePackages: ["@ruby-ai/ui"],
};

module.exports = config;
