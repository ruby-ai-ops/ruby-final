import { apiConfig } from "@connectors/lib/api/config";
import logger from "@connectors/logger/logger";
import type { DataSourceConfig } from "@connectors/types";
import { RubyAPI } from "@ruby-ai/client";

/**
 * Creates a RubyAPI instance for the given data source configuration,
 * targeting the front API URL.
 *
 * @param dataSourceConfig - The data source configuration
 * @returns A configured RubyAPI instance
 */
export function getRubyAPI(dataSourceConfig: DataSourceConfig): RubyAPI {
  return new RubyAPI(
    {
      url: apiConfig.getRubyFrontAPIUrl(),
    },
    {
      apiKey: dataSourceConfig.workspaceAPIKey,
      workspaceId: dataSourceConfig.workspaceId,
    },
    logger
  );
}
