import type { CreditType } from "@app/types/credits";

export type AdminCreditType = {
  id: number;
  createdAt: string;
  type: CreditType;
  initialAmountMicroUsd: number;
  consumedAmountMicroUsd: number;
  remainingAmountMicroUsd: number;
  startDate: string | null;
  expirationDate: string | null;
  discount: number | null;
  invoiceOrLineItemId: string | null;
  metronomeCreditId: string | null;
};

export type AdminListCreditsResponseBody = {
  rows: AdminCreditType[];
  excessCreditsLast30DaysMicroUsd: number;
};
