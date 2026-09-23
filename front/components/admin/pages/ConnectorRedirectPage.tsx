import { useAppRouter, useRequiredPathParam } from "@app/lib/platform";
import { useFetcher } from "@app/lib/swr/swr";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { Spinner } from "@ruby-ai/ui";
import { useEffect } from "react";
import useSWR from "swr";

export function ConnectorRedirectPage() {
  useAdminPageMetadata({ name: "Connector Redirect" });

  const connectorId = useRequiredPathParam("connectorId");
  const router = useAppRouter();
  const { fetcher } = useFetcher();

  const { data, error } = useSWR<{ redirectUrl: string }>(
    `/api/admin/connectors/${connectorId}/redirect`,
    fetcher
  );

  useEffect(() => {
    if (data?.redirectUrl) {
      void router.replace(data.redirectUrl);
    }
  }, [data, router]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Connector not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner />
    </div>
  );
}
