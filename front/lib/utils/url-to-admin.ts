/**
 * Converts Ruby webapp URLs to their admin equivalents
 * Returns null if no admin equivalent exists
 */

interface RouteMapping {
  pattern: RegExp;
  adminPath: string | null;
}

const ROUTE_MAPPINGS: RouteMapping[] = [
  // Conversations (old /assistant/, /agent/, and new /conversation/ URLs)
  {
    pattern: /^\/w\/([^/]+)\/assistant\/([^/]+)$/,
    adminPath: "/admin/$1/conversation/$2",
  },
  {
    pattern: /^\/w\/([^/]+)\/agent\/([^/]+)$/,
    adminPath: "/admin/$1/conversation/$2",
  },
  {
    pattern: /^\/w\/([^/]+)\/conversation\/([^/]+)$/,
    adminPath: "/admin/$1/conversation/$2",
  },

  // Assistants
  {
    pattern: /^\/w\/([^/]+)\/builder\/assistants\/([^/]+)$/,
    adminPath: "/admin/$1/assistants/$2",
  },

  // Spaces
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)$/,
    adminPath: "/admin/$1/spaces/$2",
  },

  // Apps
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)\/apps\/([^/]+)$/,
    adminPath: "/admin/$1/spaces/$2/apps/$3",
  },

  // App runs
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)\/apps\/([^/]+)\/runs$/,
    adminPath: "/admin/$1/spaces/$2/apps/$3",
  },

  // Specific app run
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)\/apps\/([^/]+)\/runs\/([^/]+)$/,
    adminPath: "/admin/$1/spaces/$2/apps/$3",
  },

  // Data source views in spaces/categories
  {
    pattern:
      /^\/w\/([^/]+)\/spaces\/([^/]+)\/categories\/[^/]+\/data_source_views\/([^/]+)$/,
    adminPath: "/admin/$1/spaces/$2/data_source_views/$3",
  },

  // MCP server views
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)\/mcp_server_views\/([^/]+)$/,
    adminPath: "/admin/$1/spaces/$2/mcp_server_views/$3",
  },

  // Workspace root
  {
    pattern: /^\/w\/([^/]+)$/,
    adminPath: "/admin/$1",
  },

  // Workspace/memberships
  {
    pattern: /^\/w\/([^/]+)\/workspace$/,
    adminPath: "/admin/$1",
  },

  // Members
  {
    pattern: /^\/w\/([^/]+)\/members$/,
    adminPath: "/admin/$1/memberships",
  },

  // Data sources (legacy)
  {
    pattern: /^\/w\/([^/]+)\/data_sources\/([^/]+)$/,
    adminPath: "/admin/$1/data_sources/$2",
  },

  // Routes without admin equivalents
  {
    pattern: /^\/w\/([^/]+)\/join$/,
    adminPath: null,
  },
  {
    pattern: /^\/w\/([^/]+)\/subscription$/,
    adminPath: null,
  },
  {
    pattern: /^\/w\/([^/]+)\/oauth\//,
    adminPath: null,
  },
  {
    pattern: /^\/w\/([^/]+)\/builder\/data_sources/,
    adminPath: null,
  },
  {
    pattern: /^\/w\/([^/]+)\/spaces\/([^/]+)\/categories\//,
    adminPath: null,
  },
  {
    pattern:
      /^\/w\/([^/]+)\/spaces\/([^/]+)\/apps\/([^/]+)\/(settings|specification|datasets)/,
    adminPath: null,
  },
  {
    pattern: /^\/w\/([^/]+)\/labs\/(transcripts|mcp_actions)/,
    adminPath: null,
  },
];

export function convertUrlToAdmin(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Check if it's a Ruby domain (ruby.ad or any subdomain like app.ruby.ad) or localhost
    // Must be exactly ruby.ad or *.ruby.ad (not *ruby.ad which would match notruby.ad)
    const isValidHostname =
      urlObj.hostname === "ruby.ad" ||
      urlObj.hostname.endsWith(".ruby.ad") ||
      urlObj.hostname === "localhost" ||
      urlObj.hostname === "127.0.0.1";

    if (!isValidHostname) {
      return null;
    }

    const pathname = urlObj.pathname;

    // Find matching route
    for (const mapping of ROUTE_MAPPINGS) {
      const match = pathname.match(mapping.pattern);
      if (match) {
        if (mapping.adminPath === null) {
          return null;
        }

        // Replace placeholders with captured groups
        let adminPath = mapping.adminPath;
        for (let i = 1; i < match.length; i++) {
          adminPath = adminPath.replace(`$${i}`, match[i]);
        }

        // Construct new URL with admin path
        const adminUrl = new URL(urlObj);
        adminUrl.pathname = adminPath;

        // Remove query params that might not be relevant in admin
        adminUrl.search = "";

        return adminUrl.toString();
      }
    }

    // No match found
    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // biome-ignore lint/correctness/noUnusedVariables: ignored using `--suppress`
  } catch (error) {
    // Invalid URL
    return null;
  }
}
