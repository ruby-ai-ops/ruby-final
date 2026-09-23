import type { Logger } from "@connectors/logger/logger";
import type { APIError, Result } from "@ruby-ai/client";

export type RubyProjectSyncActivityResult = {
  skippedDueToWorkspaceApiAccess: boolean;
};

export const RUBY_PROJECT_SYNC_COMPLETED: RubyProjectSyncActivityResult = {
  skippedDueToWorkspaceApiAccess: false,
};

export type RubyApiCallResult<T> =
  | { skipped: false; value: T }
  | { skipped: true; skipResult: RubyProjectSyncActivityResult };

export function isWorkspaceCanUseProductRequiredError(
  error: APIError
): boolean {
  return error.type === "workspace_can_use_product_required_error";
}

/**
 * When the target workspace plan disallows API access, log and signal that
 * the sync should be skipped without failing the connector workflow.
 */
export function skipSyncDueToWorkspaceApiAccess({
  logger,
  error,
  projectId,
  workspaceId,
}: {
  logger: Logger;
  error: APIError;
  projectId: string;
  workspaceId: string;
}): RubyProjectSyncActivityResult {
  logger.warn(
    {
      projectId,
      workspaceId,
      errorType: error.type,
      errorMessage: error.message,
    },
    "Workspace plan does not allow API access, skipping ruby_project sync"
  );
  return { skippedDueToWorkspaceApiAccess: true };
}

/**
 * Parses a Ruby API result, returning a skip marker when the workspace plan
 * disallows API access, or throwing for other errors.
 */
export function parseRubyApiResult<T>({
  result,
  logger,
  projectId,
  workspaceId,
  errorPrefix,
}: {
  result: Result<T, APIError>;
  logger: Logger;
  projectId: string;
  workspaceId: string;
  errorPrefix: string;
}): RubyApiCallResult<T> {
  if (result.isOk()) {
    return { skipped: false, value: result.value };
  }

  if (isWorkspaceCanUseProductRequiredError(result.error)) {
    return {
      skipped: true,
      skipResult: skipSyncDueToWorkspaceApiAccess({
        logger,
        error: result.error,
        projectId,
        workspaceId,
      }),
    };
  }

  throw new Error(`${errorPrefix}: ${result.error.message}`);
}
