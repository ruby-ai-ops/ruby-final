import { WithRubyGptSixAstraConfig } from "@app/lib/llms/providers/openai/models/gpt_six_astra";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { PREMIUM_MODEL_ENDPOINT_FILTER } from "@app/lib/llms/utils/endpoint_filters";
import { OpenAIGptSixAstraEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_six_astra_eu_openai_responses";

export class RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream extends WithRubyGptSixAstraConfig(
  OpenAIGptSixAstraEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {
    and: [
      PREMIUM_MODEL_ENDPOINT_FILTER,
      { not: { featureFlags: { contains: "disable_gpt_6_astra" as const } } },
    ],
  };
}

defineRubyStreamEndpoint(RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream);
