import { TEMPORAL_MAXED_CACHED_WORKFLOWS } from "@app/lib/temporal";
import { ActivityInboundLogInterceptor } from "@app/lib/temporal_monitoring";
import { getTemporalWorkerConnection } from "@app/lib/temporal_worker";
import logger from "@app/logger/logger";
import * as activities from "@app/admin-app/temporal/activities";
import {
  createTemporalWorker,
  getWorkflowConfig,
} from "@app/temporal/bundle_helper";
import type { Context } from "@temporalio/activity";

// Must match the deployment's terminationGracePeriodSeconds minus 10s buffer.
const SHUTDOWN_GRACE_TIME_MS = 70 * 1_000;

export async function runAdminWorker() {
  const { connection, namespace } = await getTemporalWorkerConnection();
  const worker = await createTemporalWorker({
    ...getWorkflowConfig({
      workerName: "admin",
      getWorkflowsPath: () => require.resolve("./workflows"),
    }),
    activities,
    taskQueue: "admin-queue",
    maxConcurrentActivityTaskExecutions: 5,
    maxCachedWorkflows: TEMPORAL_MAXED_CACHED_WORKFLOWS,
    connection,
    namespace,
    shutdownGraceTime: SHUTDOWN_GRACE_TIME_MS,
    interceptors: {
      activityInbound: [
        (ctx: Context) => {
          return new ActivityInboundLogInterceptor(ctx, logger);
        },
      ],
    },
  });

  await worker.run();
}
