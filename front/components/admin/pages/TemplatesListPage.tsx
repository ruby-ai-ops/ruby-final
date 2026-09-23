import { TemplatesDataTable } from "@app/components/admin/templates/TemplatesDataTable";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";

export function TemplatesListPage() {
  useAdminPageMetadata({ name: "Templates" });

  return (
    <div className="mx-auto h-full w-full max-w-7xl flex-grow flex-col items-center justify-center p-8 pt-8">
      <TemplatesDataTable />
    </div>
  );
}
