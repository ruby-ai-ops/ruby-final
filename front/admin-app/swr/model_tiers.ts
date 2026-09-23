import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type {
  GetModelTiersResponseBody,
  GetAdminAllowedModelTiersResponseBody,
  GroupAllowedModelTiersType,
  UserAllowedModelTiersType,
} from "@app/types/api/model_tiers";
import type { Fetcher } from "swr";

// Read-only Admin mirrors of the customer-facing hooks in
// `lib/swr/model_tiers.ts` — Admin's Pool Usage page only displays the models
// tier column, it never edits it, so there are no mutation hooks here.

export function useAdminModelTiers({
  owner,
  disabled,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const modelTiersFetcher: Fetcher<GetModelTiersResponseBody> = fetcher;

  const { data, error } = useSWRWithDefaults(
    disabled ? null : `/api/admin/workspaces/${owner.sId}/model_tiers`,
    modelTiersFetcher
  );

  return {
    tiers: data?.tiers ?? emptyArray(),
    isModelTiersLoading: !error && !data && !disabled,
    isModelTiersError: !!error,
  };
}

export function useAdminAllowedModelTiers({
  owner,
  disabled,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const allowedModelTiersFetcher: Fetcher<GetAdminAllowedModelTiersResponseBody> =
    fetcher;

  const { data, error } = useSWRWithDefaults(
    disabled ? null : `/api/admin/workspaces/${owner.sId}/model_tiers/allowed`,
    allowedModelTiersFetcher
  );

  return {
    users: data?.users ?? emptyArray<UserAllowedModelTiersType>(),
    groups: data?.groups ?? emptyArray<GroupAllowedModelTiersType>(),
    maxTierName: data?.maxTierName ?? null,
    isAllowedModelTiersLoading: !error && !data && !disabled,
    isAllowedModelTiersError: !!error,
  };
}
