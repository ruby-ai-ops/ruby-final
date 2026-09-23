import { WithRubyGptSixLunaConfig } from "@app/lib/llms/providers/openai/models/gpt_six_luna";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptSixLunaGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_six_luna_global_openai_responses";

export class RubyOpenAIGptSixLunaGlobalOpenAIResponsesStream extends WithRubyGptSixLunaConfig(
  OpenAIGptSixLunaGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptSixLunaGlobalOpenAIResponsesStream);
