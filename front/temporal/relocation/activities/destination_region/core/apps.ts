import config from "@app/lib/api/config";
import { AppModel } from "@app/lib/resources/storage/models/apps";
import { concurrentExecutor } from "@app/lib/utils/async_utils";
import logger from "@app/logger/logger";
import type { CoreAppAPIRelocationBlob } from "@app/temporal/relocation/activities/types";
import { readFromRelocationStorage } from "@app/temporal/relocation/lib/file_storage/relocation";
import type { CellType } from "@app/types/cell";
import { CoreAPI } from "@app/types/core/core_api";

export async function processApp({
  rubyAPIProjectId,
  dataPath,
  destCell,
  sourceCell,
  workspaceId,
}: {
  rubyAPIProjectId: string;
  dataPath: string;
  destCell: CellType;
  sourceCell: CellType;
  workspaceId: string;
}) {
  const localLogger = logger.child({
    destCell,
    sourceCell,
    workspaceId,
    rubyAPIProjectId,
  });

  localLogger.info("[Core] Processing app");

  const data =
    await readFromRelocationStorage<CoreAppAPIRelocationBlob>(dataPath);

  const coreAPI = new CoreAPI(config.getCoreAPIConfig(), logger);

  // Create new project for the app.
  const projectRes = await coreAPI.createProject();

  if (projectRes.isErr()) {
    throw new Error(`Failed to create project: ${projectRes.error}`);
  }

  const newRubyAPIProjectId = projectRes.value.project.project_id.toString();

  for (const app of data.blobs.apps) {
    await concurrentExecutor(
      app.datasets,
      async (dataset) => {
        const res = await coreAPI.createDataset({
          projectId: newRubyAPIProjectId,
          datasetId: dataset.dataset_id,
          data: dataset.data,
        });

        if (res.isErr()) {
          throw new Error("Failed to create dataset");
        }
      },
      { concurrency: 10 }
    );

    await concurrentExecutor(
      Object.values(app.coreSpecifications),
      async (specification) => {
        const res = await coreAPI.saveSpecification({
          projectId: newRubyAPIProjectId,
          specification: specification,
        });

        if (res.isErr()) {
          throw new Error("Failed to save specification");
        }
      },
      { concurrency: 10 }
    );
  }

  // Update app with new project id.
  await AppModel.update(
    {
      rubyAPIProjectId: newRubyAPIProjectId,
    },
    {
      where: {
        rubyAPIProjectId: rubyAPIProjectId,
      },
    }
  );
}
