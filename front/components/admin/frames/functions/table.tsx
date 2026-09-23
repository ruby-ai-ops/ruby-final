import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { AdminFrameFunction } from "@app/lib/api/admin/frames";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import { useAdminFrameFunctions } from "@app/admin-app/swr/frames";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

function makeColumnsForFrameFunction({
  frameId,
  owner,
}: {
  frameId: string;
  owner: LightWorkspaceType;
}): ColumnDef<AdminFrameFunction>[] {
  return [
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <LinkWrapper
          href={`/admin/${owner.sId}/files/${frameId}/functions/${row.original.sId}`}
          className="text-highlight-500"
        >
          {row.original.slug}
        </LinkWrapper>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Description" />
      ),
      cell: ({ row }) => row.original.description,
    },
    {
      accessorKey: "sId",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
      cell: ({ row }) => row.original.sId,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Updated" />
      ),
      cell: ({ row }) =>
        formatTimestampToFriendlyDate(
          new Date(row.original.updatedAt).getTime()
        ),
    },
  ];
}

interface FrameFunctionDataTableProps {
  frameId: string;
  owner: LightWorkspaceType;
}

export function FrameFunctionDataTable({
  frameId,
  owner,
}: FrameFunctionDataTableProps) {
  const useFunctionsForFrame = (props: AdminConditionalFetchProps) =>
    useAdminFrameFunctions({ ...props, frameId });

  return (
    <AdminDataTableConditionalFetch
      header="Functions"
      loadOnInit
      owner={owner}
      useSWRHook={useFunctionsForFrame}
    >
      {(items) => (
        <AdminDataTable
          columns={makeColumnsForFrameFunction({ frameId, owner })}
          data={items}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
