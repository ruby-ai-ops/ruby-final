import { WithRubyGptFiveConfig } from "@app/lib/llms/providers/openai/models/gpt_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_eu_openai_responses";

export class RubyOpenAIGptFiveEuropeOpenAIResponsesStream extends WithRubyGptFiveConfig(
  OpenAIGptFiveEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveEuropeOpenAIResponsesStream);
