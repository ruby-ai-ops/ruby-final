import { useSendNotification } from "@app/hooks/useNotification";
import type {
  GetAdminNoWorkspaceAuthContextResponseType,
  GetAdminWorkspaceAuthContextResponseType,
} from "@app/lib/api/admin/auth_context";
import type { GetAdminMetronomePackagesResponseBody } from "@app/lib/api/admin/metronome";
import { useCellContext } from "@app/lib/auth/CellContext";
import { clientFetch } from "@app/lib/egress/client";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { GetDataSourcePermissionsResponseBody } from "@app/types/api/data_sources/managed_permissions";
import type {
  GetAdminCouponRedemptionsResponseBody,
  GetAdminCouponsResponseBody,
} from "@app/types/api/admin/coupons";
import type { GetAdminFeaturesResponseBody } from "@app/types/api/admin/features";
import type { GetAdminPlansResponseBody } from "@app/types/api/admin/plans";
import type { PostAdminStripeCustomerCurrencyResponseBody } from "@app/types/api/admin/stripe_customers";
import type { ConnectorPermission } from "@app/types/connectors/connectors_api";
import type { DataSourceType } from "@app/types/data_source";
import type { APIErrorResponse, RegionRedirectError } from "@app/types/error";
import { isAPIErrorResponse } from "@app/types/error";
import type { LightWorkspaceType } from "@app/types/user";
import { useEffect } from "react";
import type { Fetcher } from "swr";
import { useSWRConfig } from "swr";
import { isCellRedirectError } from "./workspaces";

export function useAdminConnectorPermissions({
  owner,
  dataSource,
  parentId,
  filterPermission,
  disabled,
}: {
  owner: LightWorkspaceType;
  dataSource: DataSourceType;
  parentId: string | null;
  filterPermission: ConnectorPermission | null;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const permissionsFetcher: Fetcher<GetDataSourcePermissionsResponseBody> =
    fetcher;

  let url = `/api/admin/workspaces/${owner.sId}/data_sources/${dataSource.sId}/managed/permissions?viewType=document`;
  if (parentId) {
    url += `&parentId=${parentId}`;
  }
  if (filterPermission) {
    url += `&filterPermission=${filterPermission}`;
  }

  const { data, error } = useSWRWithDefaults(url, permissionsFetcher, {
    disabled,
  });

  return {
    resources: data?.resources ?? emptyArray(),
    isResourcesLoading: !error && !data,
    isResourcesError: error,
    resourcesError: isAPIErrorResponse(error) ? error.error : null,
  };
}

export function useAdminPlans() {
  const { fetcher } = useFetcher();
  const plansFetcher: Fetcher<GetAdminPlansResponseBody> = fetcher;

  const { data, error } = useSWRWithDefaults("/api/admin/plans", plansFetcher);

  return {
    plans: data?.plans ?? emptyArray(),
    isPlansLoading: !error && !data,
    isPlansError: error,
  };
}

export function useAdminCoupons() {
  const { fetcher } = useFetcher();
  const couponsFetcher: Fetcher<GetAdminCouponsResponseBody> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    "/api/admin/coupons",
    couponsFetcher
  );

  return {
    coupons: data?.coupons ?? emptyArray(),
    canCreateCoupon: data?.canCreateCoupon ?? false,
    isCouponsLoading: !error && !data,
    isCouponsError: error,
    mutate,
  };
}

export function useAdminCouponRedemptions({
  couponId,
  disabled,
}: {
  couponId: string;
  disabled: boolean;
}) {
  const { fetcher } = useFetcher();
  const redemptionsFetcher: Fetcher<GetAdminCouponRedemptionsResponseBody> =
    fetcher;

  const { data, error } = useSWRWithDefaults(
    `/api/admin/coupons/${couponId}/redemptions`,
    redemptionsFetcher,
    { disabled }
  );

  return {
    redemptions: data?.redemptions ?? emptyArray(),
    isRedemptionsLoading: !error && !data && !disabled,
    isRedemptionsError: error,
  };
}

export function useAdminArchiveCoupon() {
  const { mutate } = useSWRConfig();
  const sendNotification = useSendNotification();

  return async (couponId: string) => {
    const r = await clientFetch(`/api/admin/coupons/${couponId}/archive`, {
      method: "POST",
    });
    if (!r.ok) {
      sendNotification({
        title: "Error archiving coupon",
        type: "error",
        description: `Something went wrong: ${r.status} ${await r.text()}`,
      });
      return;
    }
    await mutate("/api/admin/coupons");
    sendNotification({ title: "Coupon archived", type: "success" });
  };
}

export function useAdminCancelPendingContract() {
  const sendNotification = useSendNotification();

  return async (owner: LightWorkspaceType): Promise<boolean> => {
    const r = await clientFetch(
      `/api/admin/workspaces/${owner.sId}/cancel_pending_contract`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (!r.ok) {
      sendNotification({
        title: "Error cancelling pending subscription",
        type: "error",
        description: `Something went wrong: ${r.status} ${await r.text()}`,
      });
      return false;
    }
    sendNotification({
      title: "Pending subscription cancelled",
      type: "success",
    });
    return true;
  };
}

export function useAdminMetronomePackages({
  disabled,
}: {
  disabled?: boolean;
} = {}) {
  const { fetcher } = useFetcher();
  const packagesFetcher: Fetcher<GetAdminMetronomePackagesResponseBody> =
    fetcher;

  const { data, error } = useSWRWithDefaults(
    "/api/admin/metronome/packages",
    packagesFetcher,
    { disabled }
  );

  return {
    packages: data?.packages ?? emptyArray(),
    isPackagesLoading: !error && !data && !disabled,
    isPackagesError: error,
    packagesError: isAPIErrorResponse(error) ? error.error : null,
  };
}

export function useAdminStripeCustomerCurrency({
  stripeCustomerId,
  disabled,
}: {
  stripeCustomerId: string | null;
  disabled?: boolean;
}) {
  const { fetcherWithBody } = useFetcher();

  const enabled = !disabled && !!stripeCustomerId;
  const { data, error } = useSWRWithDefaults<
    string | null,
    PostAdminStripeCustomerCurrencyResponseBody
  >(
    enabled
      ? JSON.stringify({
          url: "/api/admin/stripe/customers/currency",
          stripeCustomerId,
        })
      : null,
    async () => {
      if (!stripeCustomerId) {
        throw new Error("stripeCustomerId is required.");
      }

      return fetcherWithBody([
        "/api/admin/stripe/customers/currency",
        { stripeCustomerId },
        "POST",
      ]);
    },
    { disabled: !enabled }
  );

  return {
    currency: data?.currency ?? null,
    isCurrencyLoading: enabled && !error && !data,
    currencyError: isAPIErrorResponse(error) ? error.error : null,
  };
}

export function useAdminFeatureFlags({
  disabled,
  owner,
}: {
  disabled?: boolean;
  owner: LightWorkspaceType;
}) {
  const { fetcher } = useFetcher();
  const featureFlagsFetcher: Fetcher<GetAdminFeaturesResponseBody> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/features`,
    featureFlagsFetcher,
    { disabled }
  );

  return {
    data: data?.features ?? emptyArray(),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAdminWorkOSDSyncStatus({
  disabled,
  owner,
}: {
  disabled?: boolean;
  owner: LightWorkspaceType;
}) {
  const { fetcher } = useFetcher();
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/dsync`,
    fetcher,
    { disabled: disabled || !owner.workOSOrganizationId }
  );

  return {
    dsyncStatus: data,
    error,
    isLoading: !error && !data,
    mutate,
  };
}

interface UseAdminAuthContextResult<T> {
  authContext: T | undefined;
  isAuthenticated: boolean;
  isAuthContextLoading: boolean;
  authContextError: APIErrorResponse | Error | undefined;
}

export function useAdminAuthContext(options?: {
  disabled?: boolean;
}): UseAdminAuthContextResult<GetAdminNoWorkspaceAuthContextResponseType>;

export function useAdminAuthContext(options: {
  workspaceId: string;
  disabled?: boolean;
}): UseAdminAuthContextResult<
  Exclude<GetAdminWorkspaceAuthContextResponseType, RegionRedirectError>
>;

export function useAdminAuthContext(
  options: { workspaceId?: string; disabled?: boolean } = {}
) {
  const { fetcher } = useFetcher();
  const { workspaceId, disabled } = options;
  const { setCellInfo } = useCellContext();

  const url = workspaceId
    ? `/api/admin/workspaces/${workspaceId}/auth-context`
    : `/api/admin/auth-context`;

  const { data, isLoading, error, mutate } = useSWRWithDefaults<
    string,
    | GetAdminNoWorkspaceAuthContextResponseType
    | GetAdminWorkspaceAuthContextResponseType
  >(url, fetcher, { disabled });

  const cellRedirect = isCellRedirectError(error)
    ? error.error.redirect
    : undefined;
  const isAuthenticated = !cellRedirect && !!data?.user && data.isSuperUser;

  // Handle cell redirect.
  useEffect(() => {
    if (cellRedirect) {
      setCellInfo(cellRedirect);
      void mutate();
    }
  }, [cellRedirect, mutate, setCellInfo]);

  return {
    authContext: cellRedirect ? undefined : data,
    isAuthenticated,
    isAuthContextLoading: isLoading || !!cellRedirect,
    authContextError: error,
  };
}
