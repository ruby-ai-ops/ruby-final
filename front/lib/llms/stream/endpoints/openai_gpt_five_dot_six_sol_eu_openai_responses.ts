import { WithRubyGptFiveDotSixSolConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_sol";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { PREMIUM_MODEL_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { OpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_sol_eu_openai_responses";

export class RubyOpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream extends WithRubyGptFiveDotSixSolConfig(
  OpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = PREMIUM_MODEL_ENDPOINT_FILTER;
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream);
