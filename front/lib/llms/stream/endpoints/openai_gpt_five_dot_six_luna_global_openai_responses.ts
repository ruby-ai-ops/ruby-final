import { WithRubyGptFiveDotSixLunaConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_luna";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_luna_global_openai_responses";

export class RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream extends WithRubyGptFiveDotSixLunaConfig(
  OpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream
);
