import type { MetronomeAlertRef } from "@app/lib/metronome/alerts/types";

// Uniqueness keys for the account-wide "default" alerts created by
// `scripts/metronome_setup.ts` (no `customer_id`, so they apply to every
// customer). Single source of truth shared between the setup script and the
// Admin UI that deep-links them. Changing a value here orphans the existing
// Metronome alert, so treat these as persisted constants.
export const DEFAULT_ALERT_UNIQUENESS_KEYS = {
  poolEmpty: "default-low-contract-credit-and-commit-balance-zero-awu-pooled",
  poolLow: "default-low-contract-credit-and-commit-balance-100-awu-pooled",
  poolCritical: "default-low-contract-credit-and-commit-balance-10-awu-pooled",
  seatEmpty: "default-low-seat-balance-zero-awu",
  seatLowMax: "default-low-seat-balance-500-awu",
  seatLowPro: "default-low-seat-balance-100-awu",
} as const;

type DefaultAlertSlot = keyof typeof DEFAULT_ALERT_UNIQUENESS_KEYS;

export type DefaultMetronomeAlerts = Record<
  DefaultAlertSlot,
  MetronomeAlertRef | null
>;
