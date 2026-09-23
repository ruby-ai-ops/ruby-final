import { WithRubyGptSixLunaConfig } from "@app/lib/llms/providers/openai/models/gpt_six_luna";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptSixLunaEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_six_luna_eu_openai_responses";

export class RubyOpenAIGptSixLunaEuropeOpenAIResponsesStream extends WithRubyGptSixLunaConfig(
  OpenAIGptSixLunaEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptSixLunaEuropeOpenAIResponsesStream);
