import { WithRubyClaudeFableFiveDotOneConfig } from "@app/lib/llms/providers/anthropic/models/claude_fable_five_dot_one";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeFableFiveDotOneGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_fable_five_dot_one_global_anthropic";

export class RubyAnthropicClaudeFableFiveDotOneGlobalAnthropicStream extends WithRubyClaudeFableFiveDotOneConfig(
  AnthropicClaudeFableFiveDotOneGlobalAnthropicStream
) {
  // Gating is inherited from Fable 5: the family stays behind the same flag.
  static readonly endpointFilter = {
    featureFlags: { contains: "claude_fable_5_feature" as const },
  };
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeFableFiveDotOneGlobalAnthropicStream
);
