import { getBillingCurrencyForCountry } from "@marketing/lib/plans/billing_currency";
import { useGeolocation } from "@marketing/lib/swr/geo";
import type { SupportedCurrency } from "@marketing/types/currency";
import { useEffect, useState } from "react";

export const PRO_PLAN_COST_MONTHLY = 29;
export const PRO_PLAN_COST_YEARLY = 27;
export const BUSINESS_PLAN_COST_MONTHLY = 45;

export const CP_PRO_SEAT_COST_MONTHLY = 20;
export const CP_PRO_SEAT_COST_YEARLY = 16;
export const CP_MAX_SEAT_COST_MONTHLY = 40;
export const CP_MAX_SEAT_COST_YEARLY = 32;

export function formatPriceWithCurrency(
  price: number,
  currency: SupportedCurrency
): string {
  return currency === "usd" ? `$${price}` : `${price}€`;
}

/**
 * Hook that resolves the user's billing currency from IP geolocation.
 *
 * Marketing always treats Metronome billing as enabled:
 *   EU/EEA/CH → EUR, rest of world → USD.
 *
 * Falls back to EUR while loading or on error.
 */
export function useUserBillingCurrency(): SupportedCurrency {
  const { geoData } = useGeolocation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Match the server's currency on the first render, before using cached geo data.
  if (isMounted && geoData?.countryCode) {
    return getBillingCurrencyForCountry(geoData.countryCode, true);
  }
  return "eur";
}

export function usePriceWithCurrency(price: number): string {
  const currency = useUserBillingCurrency();
  return formatPriceWithCurrency(price, currency);
}
