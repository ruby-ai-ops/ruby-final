import { WithRubyGptFiveDotSixTerraLongContextConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_terra_long_context";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_terra_long_context_eu_openai_responses";

export class RubyOpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream extends WithRubyGptFiveDotSixTerraLongContextConfig(
  OpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream
) {
  static readonly endpointFilter = {
    featureFlags: { contains: "gpt_5_6_terra_long_context" as const },
  };
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream
);
