import { RateLimiterStateChip } from "@app/components/admin/credits/RateLimiterStateChip";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { ApiKeyUsageType } from "@app/lib/api/credits/api_keys_usage";
import { formatCredits, formatCreditsPrecise } from "@app/lib/client/credits";
import { useAdminApiKeysUsage } from "@app/admin-app/swr/credits";
import type { WorkspaceType } from "@app/types/user";
import {
  AlertCircle,
  Chip,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ContentMessage,
} from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface AdminApiKeysUsageTableProps {
  owner: WorkspaceType;
}

function makeColumns(): ColumnDef<ApiKeyUsageType>[] {
  return [
    {
      accessorKey: "name",
      header: "API key",
      cell: ({ row }) => {
        const { name, isActive } = row.original;
        return (
          <span className="inline-flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {!isActive && <Chip size="xs" color="warning" label="revoked" />}
          </span>
        );
      },
    },
    {
      accessorKey: "consumedAwuCredits",
      // ES = Elasticsearch, RL = Redis rate-limiter counter, MT = Metronome.
      // The three should agree; divergence points at a counter/metric issue.
      // ES and MT are aggregated on `api_key_name` (like the cap itself), so
      // keys sharing a name show the same figure; RL is per key.
      header: "Consumed (ES / RL / MT)",
      cell: ({ row }) => {
        const {
          consumedAwuCredits,
          rateLimiterSpendAwuCredits,
          metronomeConsumedAwuCredits,
        } = row.original;
        return (
          <div className="flex flex-col text-xs">
            <span>ES {formatCreditsPrecise(consumedAwuCredits)}</span>
            <span className="text-muted-foreground">
              RL{" "}
              {rateLimiterSpendAwuCredits !== null
                ? formatCreditsPrecise(rateLimiterSpendAwuCredits)
                : "-"}
            </span>
            <span className="text-muted-foreground">
              MT{" "}
              {metronomeConsumedAwuCredits !== null
                ? formatCreditsPrecise(metronomeConsumedAwuCredits)
                : "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "monthlyCapAwuCredits",
      header: "Key cap",
      cell: ({ row }) => {
        const { monthlyCapAwuCredits } = row.original;
        return (
          <span>
            {monthlyCapAwuCredits !== null
              ? formatCredits(monthlyCapAwuCredits)
              : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "rateLimiterState",
      header: "Rate limiter state",
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <RateLimiterStateChip
            rateLimiterState={row.original.rateLimiterState}
          />
        );
      },
    },
  ];
}

interface AdminApiKeysUsageTableContentProps {
  isOpen: boolean;
  owner: WorkspaceType;
}

function AdminApiKeysUsageTableContent({
  isOpen,
  owner,
}: AdminApiKeysUsageTableContentProps) {
  const { apiKeys, isApiKeysUsageLoading, isApiKeysUsageError } =
    useAdminApiKeysUsage({ owner, disabled: !isOpen });

  const columns = useMemo(() => makeColumns(), []);

  if (isApiKeysUsageError) {
    return (
      <ContentMessage
        title="Failed to load API keys usage"
        icon={AlertCircle}
        variant="warning"
      >
        Could not load per-API-key consumption and cap data for this workspace.
      </ContentMessage>
    );
  }

  return (
    <AdminDataTable
      columns={columns}
      data={apiKeys}
      defaultFilterColumn="name"
      isLoading={isApiKeysUsageLoading}
    />
  );
}

// Collapsed by default: each expansion fans out to Elasticsearch, Metronome and
// one Redis read per key, which is wasted work on a workspace with many keys
// nobody is looking at. The hook is disabled until the section is opened.
export function AdminApiKeysUsageTable({ owner }: AdminApiKeysUsageTableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <Collapsible defaultOpen={false} onOpenChange={setIsOpen}>
        <CollapsibleTrigger label="API keys credit states" />
        <CollapsibleContent>
          <AdminApiKeysUsageTableContent isOpen={isOpen} owner={owner} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
