import { WithRubyClaudeOpusFourDotSevenConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_seven";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { PREMIUM_MODEL_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeOpusFourDotSevenGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_seven_global_anthropic";

export class RubyAnthropicClaudeOpusFourDotSevenGlobalAnthropicStream extends WithRubyClaudeOpusFourDotSevenConfig(
  AnthropicClaudeOpusFourDotSevenGlobalAnthropicStream
) {
  static readonly endpointFilter = PREMIUM_MODEL_ENDPOINT_FILTER;
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFourDotSevenGlobalAnthropicStream
);
