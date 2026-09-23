import config from "@app/lib/api/config";
import type { AdminGetAppDetails } from "@app/lib/api/admin/apps";
import { getSpecification } from "@app/lib/api/run";
import { AppResource } from "@app/lib/resources/app_resource";
import { cleanSpecificationFromCore } from "@app/lib/specification";
import logger from "@app/logger/logger";
import { CoreAPI } from "@app/types/core/core_api";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const DetailsQuerySchema = z.object({
  hash: z.string().optional(),
});

const ParamsSchema = z.object({
  aId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/apps/:aId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  validate("query", DetailsQuerySchema),
  async (ctx): HandlerResult<AdminGetAppDetails> => {
    const auth = ctx.get("auth");
    const { aId } = ctx.req.valid("param");

    const { hash } = ctx.req.valid("query");

    const appResource = await AppResource.fetchById(auth, aId);
    if (!appResource) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "app_not_found",
          message: "App not found.",
        },
      });
    }

    const coreAPI = new CoreAPI(config.getCoreAPIConfig(), logger);
    const specificationHashes = await coreAPI.getSpecificationHashes({
      projectId: appResource.rubyAPIProjectId,
    });

    let specification = JSON.parse(appResource.savedSpecification ?? "{}");
    if (hash && hash.length > 0) {
      const specificationFromCore = await getSpecification(
        appResource.toJSON(),
        hash
      );
      if (specificationFromCore) {
        cleanSpecificationFromCore(specificationFromCore);
        specification = specificationFromCore;
      }
    }

    return ctx.json({
      app: appResource.toJSON(),
      specification,
      specificationHashes: specificationHashes.isOk()
        ? specificationHashes.value.hashes.reverse()
        : null,
    });
  }
);

export default app;
