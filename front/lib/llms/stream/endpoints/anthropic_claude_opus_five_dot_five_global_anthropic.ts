import { WithRubyClaudeOpusFiveDotFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_five_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { PREMIUM_MODEL_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_five_dot_five_global_anthropic";

export class RubyAnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream extends WithRubyClaudeOpusFiveDotFiveConfig(
  AnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream
) {
  static readonly endpointFilter = PREMIUM_MODEL_ENDPOINT_FILTER;
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream
);
