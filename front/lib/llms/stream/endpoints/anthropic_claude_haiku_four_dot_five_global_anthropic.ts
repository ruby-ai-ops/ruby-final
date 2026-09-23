import { WithRubyClaudeHaikuFourDotFive } from "@app/lib/llms/providers/anthropic/models/claude_haiku_four_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { AnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream } from "@app/lib/model_constructors/stream/endpoints/anthropic_claude_haiku_four_dot_five_global_anthropic";

export class RubyAnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream extends WithRubyClaudeHaikuFourDotFive(
  AnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyAnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream
);
