// Contract types for the admin cache endpoint (GET/DELETE /api/admin/cache).
// Used by the admin cache API route.

export interface RedisCacheResult {
  value: unknown | null;
  ttlSeconds: number;
}

export type RedisInstance = "cache" | "stream";

export type GetAdminCacheResponseBody = {
  key: string;
  cacheRedis: RedisCacheResult;
  streamRedis: RedisCacheResult;
};

export type DeleteAdminCacheResponseBody = {
  key: string;
  redisInstance: RedisInstance;
  deleted: true;
};

export type DeleteAllAdminCacheResponseBody = {
  pattern: string;
  deletedCount: number;
};

export type AdminCacheResourceDescriptor = {
  id: string;
  label: string;
  params: Array<{
    key: string;
    label: string;
    type: "string" | "number";
    placeholder: string;
  }>;
  keyPattern: string | null;
};

export type GetAdminCacheCatalogResponseBody = {
  resources: AdminCacheResourceDescriptor[];
};
