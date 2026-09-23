import type { RubyStreamEndpointConfiguration } from "@app/lib/llms/stream/types/configuration";
import { StreamEndpoint } from "@app/lib/model_constructors/stream/endpoint";
import type { Credentials } from "@app/lib/model_constructors/types/credentials";
import type { InputConfig } from "@app/lib/model_constructors/types/input/configuration";

// Generic over raw payload `I`, raw stream event `O`, input config `C`.
export abstract class RubyStreamEndpoint<
  I = unknown,
  O = unknown,
  C extends InputConfig = InputConfig,
> extends StreamEndpoint<I, O> {
  declare ["constructor"]: RubyStreamEndpointConfiguration<C>;
}

// Like `StreamEndpointConstructor`, but with `RubyStreamEndpointConfiguration`.
export type RubyStreamEndpointConstructor<
  I = unknown,
  O = unknown,
  C extends InputConfig = InputConfig,
> = (new (
  credentials: Credentials
) => StreamEndpoint<I, O>) &
  RubyStreamEndpointConfiguration<C>;

// Infers `C` from the class's `configSchema` so `defaultReasoningEffort` is
// checked against the endpoint's supported efforts. Returns the class unchanged.
export function defineRubyStreamEndpoint<I, O, C extends InputConfig>(
  endpoint: RubyStreamEndpointConstructor<I, O, C>
): RubyStreamEndpointConstructor<I, O, C> {
  return endpoint;
}
