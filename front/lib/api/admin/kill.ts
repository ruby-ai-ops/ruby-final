import type { KillSwitchType } from "@app/lib/admin/types";
import { z } from "zod";

export type GetKillSwitchesResponseBody = {
  killSwitches: KillSwitchType[];
};

export const KillSwitchTypeSchema = z.object({
  enabled: z.boolean(),
  type: z.string(),
});
