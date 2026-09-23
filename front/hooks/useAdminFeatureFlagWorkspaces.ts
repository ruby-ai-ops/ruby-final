import type {
  GetAdminFeatureFlagWorkspacesResponseBody,
  AdminFeatureFlagWorkspace,
} from "@app/lib/api/admin/feature_flags";
import { useCellContext } from "@app/lib/auth/CellContext";
import { emptyArray } from "@app/lib/swr/swr";
import { fetchAdminFromAllCells } from "@app/admin-app/swr/cells";
import type { CellType } from "@app/types/cell";
import type { RegionType } from "@app/types/region";
import { useCallback, useEffect, useState } from "react";

export interface AdminFeatureFlagWorkspaceWithCell
  extends AdminFeatureFlagWorkspace {
  cell: CellType;
  region: RegionType;
}

export interface AdminFeatureFlagCellRollout {
  cell: CellType;
  region: RegionType;
  globalRolloutPercentage: number | null;
  totalCount: number;
}

export function useAdminFeatureFlagWorkspacesAllCells({
  flagName,
}: {
  flagName: string;
}) {
  const { cells } = useCellContext();
  const [workspaces, setWorkspaces] = useState<
    AdminFeatureFlagWorkspaceWithCell[]
  >(emptyArray());
  const [cellRollouts, setCellRollouts] = useState<
    AdminFeatureFlagCellRollout[]
  >(emptyArray());
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const mutate = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey is an intentional refetch trigger via mutate()
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);

    const run = async () => {
      const settled =
        await fetchAdminFromAllCells<GetAdminFeatureFlagWorkspacesResponseBody>({
          cells,
          path: `/api/admin/feature-flags/${encodeURIComponent(flagName)}`,
        });

      const mergedWorkspaces: AdminFeatureFlagWorkspaceWithCell[] = [];
      const rollouts: AdminFeatureFlagCellRollout[] = [];
      let combinedTotal = 0;
      let hasErrors = false;

      for (const result of settled) {
        if (!result.ok) {
          hasErrors = true;
          continue;
        }

        combinedTotal += result.data.totalCount;
        rollouts.push({
          cell: result.cell.name,
          region: result.cell.region,
          globalRolloutPercentage: result.data.globalRolloutPercentage,
          totalCount: result.data.totalCount,
        });
        for (const workspace of result.data.workspaces) {
          mergedWorkspaces.push({
            ...workspace,
            cell: result.cell.name,
            region: result.cell.region,
          });
        }
      }

      mergedWorkspaces.sort(
        (a, b) =>
          new Date(b.enabledAt).getTime() - new Date(a.enabledAt).getTime()
      );

      if (!cancelled) {
        setWorkspaces(mergedWorkspaces);
        setCellRollouts(rollouts);
        setTotalCount(combinedTotal);
        setIsError(hasErrors);
        setIsLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [cells, flagName, refreshKey]);

  return {
    workspaces,
    cellRollouts,
    totalCount,
    mutate,
    isLoading,
    isError,
  };
}
