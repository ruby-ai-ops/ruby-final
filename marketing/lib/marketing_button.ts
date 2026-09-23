import type { LegacyButtonVariantType } from "@ruby-ai/ui";

/**
 * Public marketing CTAs use Ruby's charcoal treatment. Keeping this mapping in
 * the marketing package avoids changing buttons in the authenticated product.
 */
export function resolveMarketingButtonVariant(
  variant: LegacyButtonVariantType | null | undefined
): LegacyButtonVariantType | null | undefined {
  return variant === "highlight" ? "primary" : variant;
}
