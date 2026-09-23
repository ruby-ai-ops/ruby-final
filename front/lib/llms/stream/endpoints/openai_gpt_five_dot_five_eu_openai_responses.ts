import { WithRubyGptFiveDotFiveConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFiveEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_five_eu_openai_responses";

export class RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesStream extends WithRubyGptFiveDotFiveConfig(
  OpenAIGptFiveDotFiveEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesStream);
