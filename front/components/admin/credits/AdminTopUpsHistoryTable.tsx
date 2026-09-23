import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { formatCredits } from "@app/lib/client/credits";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import { useAdminTopUpsHistory } from "@app/admin-app/swr/credits";
import type { WorkspaceType } from "@app/types/user";
import { AlertCircle, ContentMessage } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

interface AdminTopUpsHistoryTableProps {
  owner: WorkspaceType;
}

type TopUpRowData = {
  date: string;
  name: string;
  credits: string;
  expiration: string;
};

const COLUMNS: ColumnDef<TopUpRowData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Top-up",
    enableSorting: false,
  },
  {
    accessorKey: "credits",
    header: "Credits",
    enableSorting: false,
  },
  {
    accessorKey: "expiration",
    header: "Expiration",
    enableSorting: false,
  },
];

export function AdminTopUpsHistoryTable({ owner }: AdminTopUpsHistoryTableProps) {
  const { topUps, isTopUpsHistoryLoading, isTopUpsHistoryError } =
    useAdminTopUpsHistory({ owner });

  const rows: TopUpRowData[] = useMemo(() => {
    const nowMs = Date.now();
    return topUps.map((topUp) => ({
      date: formatTimestampToFriendlyDate(topUp.grantedAtMs, "compactWithDay"),
      name: topUp.name,
      credits: formatCredits(topUp.amountCredits),
      expiration:
        topUp.expiresAtMs <= nowMs
          ? `Expired ${formatTimestampToFriendlyDate(topUp.expiresAtMs, "compactWithDay")}`
          : formatTimestampToFriendlyDate(topUp.expiresAtMs, "compactWithDay"),
    }));
  }, [topUps]);

  if (isTopUpsHistoryError) {
    return (
      <ContentMessage
        title="Failed to load top-ups history"
        icon={AlertCircle}
        variant="warning"
      >
        Could not load the top-ups history for this workspace.
      </ContentMessage>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <span className="text-sm font-medium text-foreground">
        Top-ups history
      </span>
      <AdminDataTable
        columns={COLUMNS}
        data={rows}
        isLoading={isTopUpsHistoryLoading}
      />
    </div>
  );
}
