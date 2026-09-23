import { WithRubyClaudeSonnetFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_sonnet_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeSonnetFiveGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_sonnet_five_global_anthropic";

export class RubyAnthropicClaudeSonnetFiveGlobalAnthropicStream extends WithRubyClaudeSonnetFiveConfig(
  AnthropicClaudeSonnetFiveGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyAnthropicClaudeSonnetFiveGlobalAnthropicStream);
