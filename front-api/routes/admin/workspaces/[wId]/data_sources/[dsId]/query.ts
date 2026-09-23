import config from "@app/lib/api/config";
import { DataSourceResource } from "@app/lib/resources/data_source_resource";
import logger from "@app/logger/logger";
import { CoreAPI } from "@app/types/core/core_api";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const QueryBodySchema = z.object({
  query: z.string().min(1),
  tableIds: z.array(z.string()).min(1),
});

const ParamsSchema = z.object({
  dsId: z.string(),
});

export type AdminQueryResponseBody = {
  schema: Array<{
    name: string;
    value_type: string;
  }>;
  results: Array<Record<string, string | number | boolean | null | undefined>>;
};

// Mounted at /api/admin/workspaces/:wId/data_sources/:dsId/query.
const app = adminApp();

/** @ignoreswagger */
app.post(
  "/",
  validate("param", ParamsSchema),
  validate("json", QueryBodySchema),
  async (ctx): HandlerResult<AdminQueryResponseBody> => {
    const auth = ctx.get("auth");
    const { dsId } = ctx.req.valid("param");
    const { query, tableIds } = ctx.req.valid("json");

    const dataSource = await DataSourceResource.fetchById(auth, dsId);
    if (!dataSource) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "data_source_not_found",
          message: "The data source you requested was not found.",
        },
      });
    }

    const coreAPI = new CoreAPI(config.getCoreAPIConfig(), logger);

    const tables = tableIds.map((tableId) => ({
      project_id: parseInt(dataSource.rubyAPIProjectId, 10),
      data_source_id: dataSource.rubyAPIDataSourceId,
      table_id: tableId,
    }));

    const queryResult = await coreAPI.queryDatabase({ tables, query });

    if (queryResult.isErr()) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "data_source_error",
          message: queryResult.error.message,
        },
      });
    }

    return ctx.json({
      schema: queryResult.value.schema,
      results: queryResult.value.results.map((r) => r.value),
    });
  }
);

export default app;
