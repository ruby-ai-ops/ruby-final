import type { CursorPaginationParams } from "@app/lib/api/pagination";
import type {
  DataSourceViewWithUsage,
  AdminGetDataSourceViewContentNodes,
  AdminListDataSourceViews,
} from "@app/lib/api/admin/data_source_views";
import { createUseInfiniteContentNodes } from "@app/lib/swr/data_source_views";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { ContentNodesViewType } from "@app/types/connectors/content_nodes";
import type { DataSourceViewType } from "@app/types/data_source_view";
import type { LightWorkspaceType } from "@app/types/user";
import { useMemo } from "react";
import type { Fetcher, KeyedMutator } from "swr";

export function useAdminDataSourceViews({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const dataSourceViewsFetcher: Fetcher<AdminListDataSourceViews> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/data_source_views`,
    dataSourceViewsFetcher,
    { disabled }
  );

  return {
    data: data?.data_source_views ?? emptyArray<DataSourceViewWithUsage>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface DataSourceViewContentNodesProps {
  dataSourceView?: DataSourceViewType;
  disabled?: boolean;
  internalIds?: string[];
  owner: LightWorkspaceType;
  pagination?: CursorPaginationParams;
  parentId?: string;
  viewType?: ContentNodesViewType;
}

export function useAdminDataSourceViewContentNodes({
  dataSourceView,
  disabled = false,
  internalIds,
  owner,
  pagination,
  parentId,
  viewType,
}: DataSourceViewContentNodesProps): {
  isNodesError: boolean;
  isNodesLoading: boolean;
  isNodesValidating: boolean;
  mutate: KeyedMutator<AdminGetDataSourceViewContentNodes>;
  mutateRegardlessOfQueryParams: KeyedMutator<AdminGetDataSourceViewContentNodes>;
  nodes: AdminGetDataSourceViewContentNodes["nodes"];
  totalNodesCount: number;
  totalNodesCountIsAccurate: boolean;
  nextPageCursor: string | null;
} {
  const { fetcherWithBody } = useFetcher();
  const params = new URLSearchParams();
  if (pagination && pagination.cursor) {
    params.set("cursor", pagination.cursor.toString());
  }
  if (pagination && pagination.limit) {
    params.set("limit", pagination.limit.toString());
  }

  const url =
    dataSourceView && viewType
      ? `/api/admin/workspaces/${owner.sId}/spaces/${dataSourceView.spaceId}/data_source_views/${dataSourceView.sId}/content-nodes?${params}`
      : null;

  const body = JSON.stringify({
    internalIds,
    parentId,
    viewType,
  });

  const fetchKey = useMemo(() => {
    return JSON.stringify({
      url,
      body,
    }); // Serialize with body to ensure uniqueness.
  }, [url, body]);

  const { data, error, mutate, isValidating, mutateRegardlessOfQueryParams } =
    useSWRWithDefaults(
      fetchKey,
      async () => {
        if (!url) {
          return undefined;
        }

        return fetcherWithBody([
          url,
          { internalIds, parentId, viewType },
          "POST",
        ]);
      },
      {
        disabled: disabled || !viewType,
      }
    );

  return {
    isNodesError: !!error,
    isNodesLoading: !error && !data && !disabled,
    isNodesValidating: isValidating,
    mutate,
    mutateRegardlessOfQueryParams,
    nodes: data?.nodes ?? emptyArray(),
    totalNodesCount: data ? data.total : 0,
    totalNodesCountIsAccurate: data ? data.totalIsAccurate : true,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    nextPageCursor: data?.nextPageCursor || null,
  };
}

export const useAdminInfiniteDataSourceViewContentNodes =
  createUseInfiniteContentNodes(
    ({ owner, dataSourceView }, searchParams) =>
      `/api/admin/workspaces/${owner.sId}/spaces/${dataSourceView.spaceId}/data_source_views/${dataSourceView.sId}/content-nodes?${searchParams}`
  );
