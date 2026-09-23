import { WithRubyNoopConfig } from "@app/lib/llms/providers/noop/models/noop";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { NoopNoopGlobalNoopStream } from "@app/lib/model_constructors/stream/endpoints/noop_noop_global_noop";

export class RubyNoopNoopGlobalNoopStream extends WithRubyNoopConfig(
  NoopNoopGlobalNoopStream
) {
  static readonly endpointFilter = {
    featureFlags: { contains: "noop_model_feature" as const },
  };
}

defineRubyStreamEndpoint(RubyNoopNoopGlobalNoopStream);
