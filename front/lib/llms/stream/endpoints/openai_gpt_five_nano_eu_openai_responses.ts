import { WithRubyGptFiveNanoConfig } from "@app/lib/llms/providers/openai/models/gpt_five_nano";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveNanoEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_nano_eu_openai_responses";

export class RubyOpenAIGptFiveNanoEuropeOpenAIResponsesStream extends WithRubyGptFiveNanoConfig(
  OpenAIGptFiveNanoEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveNanoEuropeOpenAIResponsesStream);
