import { WithRubyClaudeSonnetFiveConfig } from "@app/lib/llms/providers/anthropic/models/claude_sonnet_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { EU_AGENT_PLATFORM_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { AnthropicClaudeSonnetFiveEuropeAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_sonnet_five_eu_agent_platform";

export class RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream extends WithRubyClaudeSonnetFiveConfig(
  AnthropicClaudeSonnetFiveEuropeAgentPlatformStream
) {
  static readonly endpointFilter = EU_AGENT_PLATFORM_ENDPOINT_FILTER;
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream
);
