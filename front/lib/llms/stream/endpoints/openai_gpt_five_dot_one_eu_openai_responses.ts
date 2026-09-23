import { WithRubyGptFiveDotOneConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_one";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotOneEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_one_eu_openai_responses";

export class RubyOpenAIGptFiveDotOneEuropeOpenAIResponsesStream extends WithRubyGptFiveDotOneConfig(
  OpenAIGptFiveDotOneEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotOneEuropeOpenAIResponsesStream);
