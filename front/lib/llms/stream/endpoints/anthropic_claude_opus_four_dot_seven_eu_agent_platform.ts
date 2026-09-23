import { WithRubyClaudeOpusFourDotSevenConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_four_dot_seven";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import {
  EU_AGENT_PLATFORM_ENDPOINT_FILTER,
  PREMIUM_MODEL_ENDPOINT_FILTER,
} from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_four_dot_seven_eu_agent_platform";

export class RubyAnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream extends WithRubyClaudeOpusFourDotSevenConfig(
  AnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream
) {
  static readonly endpointFilter = {
    and: [EU_AGENT_PLATFORM_ENDPOINT_FILTER, PREMIUM_MODEL_ENDPOINT_FILTER],
  };
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream
);
