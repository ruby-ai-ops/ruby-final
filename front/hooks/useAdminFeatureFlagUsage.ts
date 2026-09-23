import type {
  GetAdminFeatureFlagsResponseBody,
  AdminFeatureFlagUsage,
} from "@app/lib/api/admin/feature_flags";
import { useCellContext } from "@app/lib/auth/CellContext";
import { emptyArray } from "@app/lib/swr/swr";
import { fetchAdminFromAllCells } from "@app/admin-app/swr/cells";
import type { CellType } from "@app/types/cell";
import type { RegionType } from "@app/types/region";
import type { FeatureFlagStage } from "@app/types/shared/feature_flags";
import { useCallback, useEffect, useState } from "react";

export interface AdminFeatureFlagCellStats {
  cell: CellType;
  region: RegionType;
  workspaceCount: number;
  globalRolloutPercentage: number | null;
}

export interface AdminFeatureFlagUsageAllCells {
  name: string;
  description: string | null;
  stage: FeatureFlagStage | null;
  byCell: AdminFeatureFlagCellStats[];
  totalWorkspaceCount: number;
}

function mergeFeatureFlagUsage(
  results: {
    cell: CellType;
    region: RegionType;
    featureFlags: AdminFeatureFlagUsage[];
  }[]
): AdminFeatureFlagUsageAllCells[] {
  const byName = new Map<string, AdminFeatureFlagUsageAllCells>();

  for (const { cell, region, featureFlags } of results) {
    for (const flag of featureFlags) {
      const existing = byName.get(flag.name);
      const cellStats: AdminFeatureFlagCellStats = {
        cell,
        region,
        workspaceCount: flag.workspaceCount,
        globalRolloutPercentage: flag.globalRolloutPercentage,
      };

      if (!existing) {
        byName.set(flag.name, {
          name: flag.name,
          description: flag.description,
          stage: flag.stage,
          byCell: [cellStats],
          totalWorkspaceCount: flag.workspaceCount,
        });
        continue;
      }

      existing.byCell.push(cellStats);
      existing.totalWorkspaceCount += flag.workspaceCount;
      // Prefer configured metadata over legacy nulls when cells disagree.
      if (existing.description === null && flag.description !== null) {
        existing.description = flag.description;
      }
      if (existing.stage === null && flag.stage !== null) {
        existing.stage = flag.stage;
      }
    }
  }

  return [...byName.values()];
}

export function useAdminFeatureFlagUsageAllCells() {
  const { cells } = useCellContext();
  const [featureFlags, setFeatureFlags] = useState<
    AdminFeatureFlagUsageAllCells[]
  >(emptyArray());
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
        await fetchAdminFromAllCells<GetAdminFeatureFlagsResponseBody>({
          cells,
          path: "/api/admin/feature-flags",
        });

      const okResults = settled.flatMap((result) =>
        result.ok
          ? [
              {
                cell: result.cell.name,
                region: result.cell.region,
                featureFlags: result.data.featureFlags,
              },
            ]
          : []
      );
      const hasErrors = settled.some((result) => !result.ok);

      if (!cancelled) {
        setFeatureFlags(mergeFeatureFlagUsage(okResults));
        setIsError(hasErrors);
        setIsLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [cells, refreshKey]);

  return {
    featureFlags,
    mutate,
    isLoading,
    isError,
  };
}
