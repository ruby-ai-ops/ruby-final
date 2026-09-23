import { makeColumnsForFrames } from "@app/components/admin/frames/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminFrames } from "@app/admin-app/swr/frames";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { LightWorkspaceType } from "@app/types/user";
import { CheckboxWithText } from "@ruby-ai/ui";
import type { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

const PAGE_SIZE = 20;

interface FramesDataTableProps {
  loadOnInit?: boolean;
  owner: LightWorkspaceType;
}

export function FramesDataTable({ loadOnInit, owner }: FramesDataTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [hasSandbox, setHasSandbox] = useState(true);
  const useFramesPage = (props: AdminConditionalFetchProps) =>
    useAdminFrames({
      ...props,
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      hasSandbox,
    });

  return (
    <AdminDataTableConditionalFetch
      header="Frames"
      loadOnInit={loadOnInit}
      owner={owner}
      useSWRHook={useFramesPage}
      globalActions={
        <CheckboxWithText
          text="Only with a sandbox"
          checked={hasSandbox}
          onCheckedChange={(checked) => {
            setHasSandbox(checked === true);
            // A different filter makes the current page number meaningless.
            setPagination((current) => ({ ...current, pageIndex: 0 }));
          }}
        />
      }
    >
      {({ items, totalCount, isValidating }) => (
        <AdminDataTable
          columns={makeColumnsForFrames({ owner })}
          data={items}
          isValidating={isValidating}
          serverSideRowCount={totalCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
