import { WithRubyGptFiveMiniConfig } from "@app/lib/llms/providers/openai/models/gpt_five_mini";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveMiniEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_mini_eu_openai_responses";

export class RubyOpenAIGptFiveMiniEuropeOpenAIResponsesStream extends WithRubyGptFiveMiniConfig(
  OpenAIGptFiveMiniEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveMiniEuropeOpenAIResponsesStream);
