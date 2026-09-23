import type { RubyBatchEndpointConfiguration } from "@app/lib/llms/batch/types/configuration";
import { BatchEndpoint } from "@app/lib/model_constructors/batch/endpoint";
import type { Credentials } from "@app/lib/model_constructors/types/credentials";
import type { InputConfig } from "@app/lib/model_constructors/types/input/configuration";

// Generic over raw payload `I`, per-request result `R`, input config `C`.
export abstract class RubyBatchEndpoint<
  I = unknown,
  R = unknown,
  C extends InputConfig = InputConfig,
> extends BatchEndpoint<I, R> {
  declare ["constructor"]: RubyBatchEndpointConfiguration<C>;
}

// Like `BatchEndpointConstructor`, but with `RubyBatchEndpointConfiguration`.
export type RubyBatchEndpointConstructor<
  I = unknown,
  R = unknown,
  C extends InputConfig = InputConfig,
> = (new (
  credentials: Credentials
) => BatchEndpoint<I, R>) &
  RubyBatchEndpointConfiguration<C>;

// Infers `C` from the class's `configSchema` so `defaultReasoningEffort` is
// checked against the endpoint's supported efforts. Returns the class unchanged.
export function defineRubyBatchEndpoint<I, R, C extends InputConfig>(
  endpoint: RubyBatchEndpointConstructor<I, R, C>
): RubyBatchEndpointConstructor<I, R, C> {
  return endpoint;
}
