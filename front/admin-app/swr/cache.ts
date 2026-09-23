import { useSendNotification } from "@app/hooks/useNotification";
import { clientFetch } from "@app/lib/egress/client";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type {
  DeleteAllAdminCacheResponseBody,
  GetAdminCacheCatalogResponseBody,
  GetAdminCacheResponseBody,
  RedisInstance,
} from "@app/types/api/admin/cache";
import { normalizeError } from "@app/types/shared/utils/error_utils";
import { useState } from "react";
import type { Fetcher } from "swr";

export function useAdminCacheCatalog() {
  const { fetcher } = useFetcher();
  const catalogFetcher: Fetcher<GetAdminCacheCatalogResponseBody> = fetcher;
  const { data, error } = useSWRWithDefaults(
    "/api/admin/cache/catalog",
    catalogFetcher
  );

  return {
    resources: data?.resources ?? [],
    isCatalogLoading: !error && !data,
    isCatalogError: error,
  };
}

interface UseAdminCacheLookupParams {
  rawKey?: string;
  resourceId?: string;
  params?: Record<string, string>;
  disabled?: boolean;
}

export function useAdminCacheLookup({
  rawKey,
  resourceId,
  params,
  disabled,
}: UseAdminCacheLookupParams) {
  const { fetcher } = useFetcher();
  const cacheFetcher: Fetcher<GetAdminCacheResponseBody> = fetcher;

  const queryParams = new URLSearchParams();
  if (rawKey) {
    queryParams.set("rawKey", rawKey);
  }
  if (resourceId) {
    queryParams.set("resourceId", resourceId);
  }
  if (params) {
    queryParams.set("params", JSON.stringify(params));
  }

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/cache?${queryParams.toString()}`,
    cacheFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isCacheLoading: !error && !data && !disabled,
    isCacheError: error,
    mutateCache: mutate,
  };
}

interface UseAdminCacheInvalidateParams {
  rawKey?: string;
  resourceId?: string;
  params?: Record<string, string>;
  redisInstance: RedisInstance;
}

export function useAdminCacheInvalidate() {
  const [isInvalidating, setIsInvalidating] = useState(false);

  const doInvalidate = async ({
    rawKey,
    resourceId,
    params,
    redisInstance,
  }: UseAdminCacheInvalidateParams) => {
    setIsInvalidating(true);
    try {
      const queryParams = new URLSearchParams();
      if (rawKey) {
        queryParams.set("rawKey", rawKey);
      }
      if (resourceId) {
        queryParams.set("resourceId", resourceId);
      }
      if (params) {
        queryParams.set("params", JSON.stringify(params));
      }
      queryParams.set("redisInstance", redisInstance);

      const res = await clientFetch(
        `/api/admin/cache?${queryParams.toString()}`,
        {
          method: "DELETE",
        }
      );

      return res.ok;
    } finally {
      setIsInvalidating(false);
    }
  };

  return { doInvalidate, isInvalidating };
}

export function useAdminCacheDeleteAll() {
  const sendNotification = useSendNotification();
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const doDeleteAll = async ({
    resourceId,
  }: {
    resourceId: string;
  }): Promise<boolean> => {
    setIsDeletingAll(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("resourceId", resourceId);

      const res = await clientFetch(
        `/api/admin/cache/all?${queryParams.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        sendNotification({
          title: "Failed to delete cache entries",
          description: errorData.error?.message ?? "Unknown error",
          type: "error",
        });
        return false;
      }

      const body: DeleteAllAdminCacheResponseBody = await res.json();
      sendNotification({
        title: "Cache entries deleted",
        description: `Deleted ${body.deletedCount} entries matching '${body.pattern}'.`,
        type: "success",
      });
      return true;
    } catch (error) {
      sendNotification({
        title: "Failed to delete cache entries",
        description: normalizeError(error).message,
        type: "error",
      });
      return false;
    } finally {
      setIsDeletingAll(false);
    }
  };

  return { doDeleteAll, isDeletingAll };
}
