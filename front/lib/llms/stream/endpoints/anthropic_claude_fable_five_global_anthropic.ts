import { WithRubyClaudeFableFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_fable_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeFableFiveGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_fable_five_global_anthropic";

export class RubyAnthropicClaudeFableFiveGlobalAnthropicStream extends WithRubyClaudeFableFiveConfig(
  AnthropicClaudeFableFiveGlobalAnthropicStream
) {
  static readonly endpointFilter = {
    featureFlags: { contains: "claude_fable_5_feature" as const },
  };
}

defineRubyStreamEndpoint(RubyAnthropicClaudeFableFiveGlobalAnthropicStream);
