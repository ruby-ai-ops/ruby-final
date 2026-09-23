import { WithRubyClaudeSonnetFourDotSixConfig } from "@app/lib/llms/providers/anthropic/models/claude_sonnet_four_dot_six";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeSonnetFourDotSixGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_sonnet_four_dot_six_global_anthropic";

export class RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicStream extends WithRubyClaudeSonnetFourDotSixConfig(
  AnthropicClaudeSonnetFourDotSixGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicStream
);
