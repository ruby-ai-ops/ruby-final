import { AdminConsumptionPreview } from "@app/components/admin/analytics/AdminConsumptionPreview";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { LinkWrapper } from "@ruby-ai/ui";

export function AnalyticsPage() {
  const owner = useWorkspace();
  useAdminPageMetadata({ name: owner.name, subtitle: "Analytics" });

  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="text-2xl font-bold">
        Analytics for workspace{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Admin uses workspace-admin visibility, so resolved labels may differ from
        a customer manager&apos;s view.
      </p>
      <div className="min-w-0 py-6">
        <AdminConsumptionPreview owner={owner} />
      </div>
    </main>
  );
}
