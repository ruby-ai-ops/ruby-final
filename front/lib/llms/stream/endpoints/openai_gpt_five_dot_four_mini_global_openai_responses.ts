import { WithRubyGptFiveDotFourMiniConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_four_mini";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_four_mini_global_openai_responses";

export class RubyOpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream extends WithRubyGptFiveDotFourMiniConfig(
  OpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream
);
