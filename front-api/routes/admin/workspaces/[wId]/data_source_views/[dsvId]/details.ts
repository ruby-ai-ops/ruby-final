import type { AdminGetDataSourceViewDetails } from "@app/lib/api/admin/data_source_views";
import { dataSourceViewToAdminJSON } from "@app/lib/admin/utils";
import { DataSourceViewResource } from "@app/lib/resources/data_source_view_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  dsvId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/data_source_views/:dsvId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetDataSourceViewDetails> => {
    const auth = ctx.get("auth");
    const { dsvId } = ctx.req.valid("param");

    const dataSourceView = await DataSourceViewResource.fetchById(auth, dsvId, {
      includeEditedBy: true,
    });

    if (!dataSourceView) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "data_source_view_not_found",
          message: "Data source view not found.",
        },
      });
    }

    const dataSourceViewJSON = await dataSourceViewToAdminJSON(
      auth,
      dataSourceView
    );

    return ctx.json({ dataSourceView: dataSourceViewJSON });
  }
);

export default app;
