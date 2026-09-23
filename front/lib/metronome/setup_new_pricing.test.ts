import { SEAT_PRODUCT_YEARLY_SUFFIX } from "@app/lib/metronome/constants";
import {
  FREE_SEAT_PRODUCT_NAME,
  MAX_SEAT_PRODUCT_NAME,
  PRO_SEAT_PRODUCT_NAME,
  WORKSPACE_SEAT_PRODUCT_NAME,
} from "@app/lib/metronome/setup_common";
import { getNewPackages } from "@app/lib/metronome/setup_new_pricing";
import { describe, expect, it } from "vitest";

const packages = getNewPackages();

function packageNamed(name: string) {
  const definition = packages.find((item) => item.name === name);
  if (!definition) {
    throw new Error(`${name} package does not exist`);
  }
  return definition;
}

function priceFor(packageName: string, productName: string) {
  return packageNamed(packageName).overrides?.find(
    (item) => item.product_name === productName
  )?.price;
}

describe("new pricing packages", () => {
  it.each([
    ["Business USD", 2_000, 19_200, 4_000, 38_400],
    ["Business EUR", 20, 192, 40, 384],
    ["Business GBP", 20, 192, 40, 384],
  ])("prices %s Pro and Max seats", (name, proMonthlyFiatUnits, proYearlyFiatUnits, maxMonthlyFiatUnits, maxYearlyFiatUnits) => {
    expect(priceFor(name, PRO_SEAT_PRODUCT_NAME)).toBe(proMonthlyFiatUnits);
    expect(
      priceFor(name, PRO_SEAT_PRODUCT_NAME + SEAT_PRODUCT_YEARLY_SUFFIX)
    ).toBe(proYearlyFiatUnits);
    expect(priceFor(name, MAX_SEAT_PRODUCT_NAME)).toBe(maxMonthlyFiatUnits);
    expect(
      priceFor(name, MAX_SEAT_PRODUCT_NAME + SEAT_PRODUCT_YEARLY_SUFFIX)
    ).toBe(maxYearlyFiatUnits);
    expect(priceFor(name, FREE_SEAT_PRODUCT_NAME)).toBe(0);
  });

  it.each([
    "Business USD",
    "Business EUR",
    "Business GBP",
    "Enterprise Seat-based USD",
    "Enterprise Seat-based EUR",
  ])("grants 500 Pro and 2,500 Max credits monthly in %s", (name) => {
    const credits = packageNamed(name).recurring_credits ?? [];
    for (const productName of [PRO_SEAT_PRODUCT_NAME, MAX_SEAT_PRODUCT_NAME]) {
      const expected = productName === PRO_SEAT_PRODUCT_NAME ? 500 : 2_500;
      const matching = credits.filter((credit) =>
        credit.name?.startsWith(productName)
      );
      expect(matching).toHaveLength(2);
      expect(matching.map((credit) => credit.access_amount.unit_price)).toEqual(
        [expected, expected]
      );
    }
  });

  it.each([
    ["Enterprise Seat-based USD", 52_800, 168_000],
    ["Enterprise Seat-based EUR", 528, 1_680],
  ])("preserves %s annual seat prices", (name, proYearlyFiatUnits, maxYearlyFiatUnits) => {
    expect(
      priceFor(name, PRO_SEAT_PRODUCT_NAME + SEAT_PRODUCT_YEARLY_SUFFIX)
    ).toBe(proYearlyFiatUnits);
    expect(
      priceFor(name, MAX_SEAT_PRODUCT_NAME + SEAT_PRODUCT_YEARLY_SUFFIX)
    ).toBe(maxYearlyFiatUnits);
  });

  it.each([
    ["Enterprise Pooled USD", 24_000],
    ["Enterprise Pooled EUR", 240],
  ])("preserves %s pooled-seat price", (name, priceInFiatUnits) => {
    expect(
      priceFor(name, WORKSPACE_SEAT_PRODUCT_NAME + SEAT_PRODUCT_YEARLY_SUFFIX)
    ).toBe(priceInFiatUnits);
  });

  it.each([
    "Partner Demo Enterprise USD",
    "Partner Demo Enterprise EUR",
  ])("keeps %s platform seats free with no Pro/Max recurring credits", (name) => {
    expect(priceFor(name, WORKSPACE_SEAT_PRODUCT_NAME)).toBe(0);
    expect(packageNamed(name).recurring_credits).toHaveLength(1);
  });
});
