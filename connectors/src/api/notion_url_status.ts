import {
  checkNotionUrl,
  findNotionUrl,
} from "@connectors/connectors/notion/lib/cli";
import type { BreadcrumbItem } from "@connectors/connectors/notion/lib/utils";
import {
  buildNotionBreadcrumbs,
  pageOrDbIdFromUrl,
} from "@connectors/connectors/notion/lib/utils";
import { apiError, withLogging } from "@connectors/logger/withlogging";
import { ConnectorResource } from "@connectors/resources/connector_resource";
import type { Request, Response } from "express";

// Notion content can be reached through the legacy app domain, the current app domain,
// and published sites.
const VALID_NOTION_HOSTS = ["notion.so", "notion.site", "app.notion.com"];

function isValidNotionUrl(url: string): boolean {
  if (!URL.canParse(url)) {
    return false;
  }
  const { hostname } = new URL(url);
  return VALID_NOTION_HOSTS.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`)
  );
}

type NotionUrlStatus = {
  notion: {
    exists: boolean;
    type?: "page" | "database";
  };
  ruby: {
    synced: boolean;
    lastSync?: string;
    breadcrumbs?: BreadcrumbItem[];
  };
  summary: string;
};

export const getNotionUrlStatusHandler = withLogging(
  async (req: Request, res: Response) => {
    try {
      const { url } = req.query;

      if (!url || typeof url !== "string") {
        return apiError(req, res, {
          status_code: 400,
          api_error: {
            type: "invalid_request_error",
            message: "Missing or invalid 'url' query parameter",
          },
        });
      }

      // Validate it's a Notion URL
      if (!isValidNotionUrl(url)) {
        return apiError(req, res, {
          status_code: 400,
          api_error: {
            type: "invalid_request_error",
            message: "URL must be a valid Notion URL",
          },
        });
      }

      // Get connector ID from query parameters
      const { connector_id } = req.query;
      if (!connector_id || typeof connector_id !== "string") {
        return apiError(req, res, {
          status_code: 400,
          api_error: {
            type: "invalid_request_error",
            message: "Missing or invalid 'connector_id' query parameter",
          },
        });
      }

      const connector = await ConnectorResource.fetchById(connector_id);
      if (!connector) {
        return apiError(req, res, {
          status_code: 404,
          api_error: {
            type: "connector_not_found",
            message: "Connector not found",
          },
        });
      }

      // Verify this is a Notion connector
      if (connector.type !== "notion") {
        return apiError(req, res, {
          status_code: 400,
          api_error: {
            type: "invalid_request_error",
            message: "Connector is not a Notion connector",
          },
        });
      }

      const connectionId = connector.connectionId;

      // Check if URL exists in Notion
      const notionCheckResult = await checkNotionUrl({
        connectorId: connector.id,
        connectionId,
        url,
      });

      // Find if URL is synced in Ruby
      const rubyFindResult = await findNotionUrl({
        connectorId: connector.id,
        url,
      });

      // Build breadcrumbs if the content is synced in Ruby
      let breadcrumbs: BreadcrumbItem[] | undefined;

      if (rubyFindResult.page !== null || rubyFindResult.db !== null) {
        const pageOrDbId = pageOrDbIdFromUrl(url);
        if (pageOrDbId) {
          const resourceType =
            rubyFindResult.page !== null ? "page" : "database";
          breadcrumbs = await buildNotionBreadcrumbs(
            connector.id,
            pageOrDbId,
            resourceType
          );
        }
      }

      // Build response
      const status: NotionUrlStatus = {
        notion: {
          exists:
            notionCheckResult.page !== null || notionCheckResult.db !== null,
          type:
            notionCheckResult.page !== null
              ? "page"
              : notionCheckResult.db !== null
                ? "database"
                : undefined,
        },
        ruby: {
          synced: rubyFindResult.page !== null || rubyFindResult.db !== null,
          breadcrumbs:
            breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : undefined,
        },
        summary: generateStatusSummary(
          notionCheckResult.page !== null || notionCheckResult.db !== null,
          rubyFindResult.page !== null || rubyFindResult.db !== null
        ),
      };

      res.status(200).json(status);
    } catch (error) {
      return apiError(req, res, {
        status_code: 500,
        api_error: {
          type: "internal_server_error",
          message: `Failed to check URL status: ${error}`,
        },
      });
    }
  }
);

function generateStatusSummary(
  existsInNotion: boolean,
  syncedInRuby: boolean
): string {
  if (existsInNotion && syncedInRuby) {
    return "✅ Content is synced and available in Ruby";
  } else if (existsInNotion && !syncedInRuby) {
    return "⚠️ Content exists in Notion but is not synced to Ruby";
  } else if (!existsInNotion && syncedInRuby) {
    return "⚠️ Content was deleted from Notion but still exists in Ruby";
  } else {
    return "❌ URL not found in Notion";
  }
}
