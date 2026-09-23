import type { AdminListPluginsForScopeResponseBody } from "@app/lib/api/admin/plugins/list";
import type { AdminRunPluginResponseBody } from "@app/lib/api/admin/plugins/run";
import { clientFetch } from "@app/lib/egress/client";
import {
  emptyArray,
  getErrorFromResponse,
  useFetcher,
  useSWRWithDefaults,
} from "@app/lib/swr/swr";
import { fetchAdminFromAllCells } from "@app/admin-app/swr/cells";
import type { AdminListPluginRunsResponseBody } from "@app/types/api/admin/plugin_manager";
import type { AdminGetPluginAsyncArgsResponseBody } from "@app/types/api/admin/plugins/async_args";
import type { AdminGetPluginDetailsResponseBody } from "@app/types/api/admin/plugins/manifest";
import type { CellInfo } from "@app/types/cell";
import type { PluginResourceTarget } from "@app/types/admin/plugins";
import type { Result } from "@app/types/shared/result";
import { Err, Ok } from "@app/types/shared/result";
import { normalizeError } from "@app/types/shared/utils/error_utils";
import type { Fetcher } from "swr";

export function useAdminListPluginForResourceType({
  disabled,
  pluginResourceTarget,
}: {
  disabled?: boolean;
  pluginResourceTarget: PluginResourceTarget;
}) {
  const { fetcher } = useFetcher();
  const workspacesFetcher: Fetcher<AdminListPluginsForScopeResponseBody> =
    fetcher;

  const urlSearchParams = new URLSearchParams({
    resourceType: pluginResourceTarget.resourceType,
  });

  if ("resourceId" in pluginResourceTarget) {
    urlSearchParams.append("resourceId", pluginResourceTarget.resourceId);
    urlSearchParams.append("workspaceId", pluginResourceTarget.workspace.sId);
  }

  const { data, error } = useSWRWithDefaults(
    `/api/admin/plugins?${urlSearchParams.toString()}`,
    workspacesFetcher,
    {
      disabled,
    }
  );

  return {
    plugins: data?.plugins ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
  };
}

export function useAdminPluginManifest({
  disabled,
  pluginId,
}: {
  disabled?: boolean;
  pluginId: string;
}) {
  const { fetcher } = useFetcher();
  const pluginManifestFetcher: Fetcher<AdminGetPluginDetailsResponseBody> =
    fetcher;

  const { data, error } = useSWRWithDefaults(
    `/api/admin/plugins/${pluginId}/manifest`,
    pluginManifestFetcher,
    {
      disabled,
    }
  );

  return {
    manifest: data ? data.manifest : null,
    isLoading: !error && !data && !disabled,
    isError: error,
  };
}

export function useAdminPluginAsyncArgs({
  disabled,
  pluginId,
  pluginResourceTarget,
}: {
  disabled?: boolean;
  pluginId: string;
  pluginResourceTarget: PluginResourceTarget;
}) {
  const { fetcher } = useFetcher();
  const pluginAsyncArgsFetcher: Fetcher<AdminGetPluginAsyncArgsResponseBody> =
    fetcher;

  const urlSearchParams = new URLSearchParams({
    resourceType: pluginResourceTarget.resourceType,
  });

  if ("resourceId" in pluginResourceTarget) {
    urlSearchParams.append("resourceId", pluginResourceTarget.resourceId);
    urlSearchParams.append("workspaceId", pluginResourceTarget.workspace.sId);
  }

  const { data, error } = useSWRWithDefaults(
    `/api/admin/plugins/${pluginId}/async-args?${urlSearchParams.toString()}`,
    pluginAsyncArgsFetcher,
    {
      disabled,
    }
  );

  return {
    asyncArgs: data ? data.asyncArgs : null,
    isLoading: !error && !data && !disabled,
    isError: error,
  };
}

export interface CellPluginRunResult {
  cell: CellInfo;
  result: Result<AdminRunPluginResponseBody["result"], string>;
}

export function useRunAdminPlugin({
  pluginId,
  pluginResourceTarget,
}: {
  pluginId: string;
  pluginResourceTarget: PluginResourceTarget;
}) {
  const urlSearchParams = new URLSearchParams({});

  urlSearchParams.append(
    "resourceType",
    pluginResourceTarget.resourceType ?? "global"
  );

  if ("resourceId" in pluginResourceTarget) {
    urlSearchParams.append("resourceId", pluginResourceTarget.resourceId);
    urlSearchParams.append("workspaceId", pluginResourceTarget.workspace.sId);
  }

  // Args carrying a File must go over FormData; otherwise JSON keeps the
  // request body typed for the API route.
  const buildRunRequestInit = (args: object): RequestInit => {
    const hasFiles = Object.values(args).some((arg) => arg instanceof File);
    if (hasFiles) {
      const formData = new FormData();
      Object.entries(args).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return { method: "POST", credentials: "include", body: formData };
    }

    return {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    };
  };

  const runPath = `/api/admin/plugins/${pluginId}/run?${urlSearchParams.toString()}`;

  const runPlugin = async (
    args: object
  ): Promise<Result<AdminRunPluginResponseBody["result"], string>> => {
    const res = await clientFetch(runPath, buildRunRequestInit(args));

    if (res.ok) {
      const response: AdminRunPluginResponseBody = await res.json();

      return new Ok(response.result);
    } else {
      const errorData = await getErrorFromResponse(res);

      return new Err(errorData.message);
    }
  };

  const doRunPlugin = (args: object) => runPlugin(args);

  const doRunPluginOnCells = async (
    args: object,
    cells: CellInfo[]
  ): Promise<CellPluginRunResult[]> => {
    // Each cell's own URL is prefixed onto runPath by fetchAdminFromAllCells,
    // which is how the run gets targeted at that cell.
    const results = await fetchAdminFromAllCells<AdminRunPluginResponseBody>({
      cells,
      path: runPath,
      init: buildRunRequestInit(args),
    });

    return results.map((result) =>
      result.ok
        ? { cell: result.cell, result: new Ok(result.data.result) }
        : {
            cell: result.cell,
            result: new Err(normalizeError(result.error).message),
          }
    );
  };

  return { doRunPlugin, doRunPluginOnCells };
}

interface AdminPluginRunsFetchProps {
  disabled?: boolean;
  owner?: { sId: string }; // Optional for global plugins
  resourceType?: string;
  resourceId?: string;
}

export function useAdminPluginRuns({
  disabled,
  owner,
  resourceType,
  resourceId,
}: AdminPluginRunsFetchProps) {
  const { fetcher } = useFetcher();
  const pluginRunsFetcher: Fetcher<AdminListPluginRunsResponseBody> = fetcher;

  const urlParams = new URLSearchParams();

  // Add workspaceId only if owner is provided (workspace/resource level)
  if (owner) {
    urlParams.append("workspaceId", owner.sId);
  }

  if (resourceType) {
    urlParams.append("resourceType", resourceType);
  }
  if (resourceId) {
    urlParams.append("resourceId", resourceId);
  }

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/plugins/runs?${urlParams.toString()}`,
    pluginRunsFetcher,
    {
      disabled,
    }
  );

  return {
    data: data?.pluginRuns ?? emptyArray(),
    isError: error,
    isLoading: !error && !data && !disabled,
    mutate,
  };
}
