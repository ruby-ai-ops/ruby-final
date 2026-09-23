import { WithRubyGptFiveDotFourConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_four";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFourEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_four_eu_openai_responses";

export class RubyOpenAIGptFiveDotFourEuropeOpenAIResponsesStream extends WithRubyGptFiveDotFourConfig(
  OpenAIGptFiveDotFourEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotFourEuropeOpenAIResponsesStream);
