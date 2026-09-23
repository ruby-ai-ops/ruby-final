import type { MetronomePackageSummary } from "@app/lib/metronome/client";

export type GetAdminMetronomePackagesResponseBody = {
  packages: MetronomePackageSummary[];
};
