import { WithRubyClaudeOpusFiveDotFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_opus_five_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import {
  EU_AGENT_PLATFORM_ENDPOINT_FILTER,
  PREMIUM_MODEL_ENDPOINT_FILTER,
} from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_opus_five_dot_five_eu_agent_platform";

export class RubyAnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream extends WithRubyClaudeOpusFiveDotFiveConfig(
  AnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream
) {
  static readonly endpointFilter = {
    and: [EU_AGENT_PLATFORM_ENDPOINT_FILTER, PREMIUM_MODEL_ENDPOINT_FILTER],
  };
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream
);
