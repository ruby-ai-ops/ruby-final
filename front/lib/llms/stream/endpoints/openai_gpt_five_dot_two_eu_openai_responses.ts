import { WithRubyGptFiveDotTwoConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_two";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotTwoEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_two_eu_openai_responses";

export class RubyOpenAIGptFiveDotTwoEuropeOpenAIResponsesStream extends WithRubyGptFiveDotTwoConfig(
  OpenAIGptFiveDotTwoEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotTwoEuropeOpenAIResponsesStream);
