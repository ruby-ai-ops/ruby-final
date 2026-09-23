import { WithRubyClaudeOpusFourDotEightConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_eight";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { PREMIUM_MODEL_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeOpusFourDotEightGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_eight_global_anthropic";

export class RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream extends WithRubyClaudeOpusFourDotEightConfig(
  AnthropicClaudeOpusFourDotEightGlobalAnthropicStream
) {
  static readonly endpointFilter = PREMIUM_MODEL_ENDPOINT_FILTER;
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream
);
