import { MODEL_PRICING } from "@app/lib/api/assistant/token_pricing";
import type { TokenPricing } from "@app/lib/model_constructors/types/token_pricing";
import type { ModelConfigurationType } from "@app/types/assistant/models/types";
import { expect, it } from "vitest";

type Limits = {
  contextSize: number;
  maxOutputTokens: number;
};

// A model's size limits and prices are written down in four independent places
// with nothing type-enforcing their agreement:
//
//   - the `model_constructors` endpoint, which carries the REAL provider values
//     and whose `contextSize`/`maxOutputTokens` are deliberately typed as
//     `number` so the Ruby layer can override them;
//   - the `llms` ruby endpoint, which applies the product caps;
//   - the legacy `ModelConfigurationType`, which the UI and prompt builder read;
//   - `MODEL_PRICING`, which bills.
//
// These two cases pin that agreement. Note that no expected prices are passed:
// the point is that the endpoint and billing agree, not what they agree on —
// the authoritative figure is the provider doc URL quoted at each definition.
export function itKeepsLimitsAndPricingConsistent({
  streamEndpoint,
  rubyStreamEndpoint,
  modelConfig,
  native,
  ruby,
}: {
  streamEndpoint: Limits & { tokenPricing: TokenPricing };
  rubyStreamEndpoint: Limits;
  modelConfig: ModelConfigurationType;
  native: Limits;
  ruby: Limits;
}) {
  it("keeps the native limits on the endpoint and the Ruby caps everywhere else", () => {
    expect(streamEndpoint.contextSize).toBe(native.contextSize);
    expect(streamEndpoint.maxOutputTokens).toBe(native.maxOutputTokens);

    expect(rubyStreamEndpoint.contextSize).toBe(ruby.contextSize);
    expect(rubyStreamEndpoint.maxOutputTokens).toBe(ruby.maxOutputTokens);

    expect(modelConfig.contextSize).toBe(ruby.contextSize);
    expect(modelConfig.generationTokensCount).toBe(ruby.maxOutputTokens);

    // A cap may only ever narrow what the provider offers.
    expect(ruby.contextSize).toBeLessThanOrEqual(native.contextSize);
    expect(ruby.maxOutputTokens).toBeLessThanOrEqual(native.maxOutputTokens);
  });

  it("keeps token pricing synchronized between the endpoint and billing", () => {
    const billed = MODEL_PRICING[modelConfig.modelId];
    const { tokenPricing } = streamEndpoint;

    expect(billed.input).toBe(tokenPricing.standardInput);
    expect(billed.output).toBe(tokenPricing.standardOutput);
    expect(billed.cache_read_input_tokens).toBe(tokenPricing.cacheHit);
  });
}
