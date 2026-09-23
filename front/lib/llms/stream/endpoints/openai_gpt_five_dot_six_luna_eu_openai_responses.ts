import { WithRubyGptFiveDotSixLunaConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_luna";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_luna_eu_openai_responses";

export class RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream extends WithRubyGptFiveDotSixLunaConfig(
  OpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream
);
