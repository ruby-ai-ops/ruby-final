import { WithRubyGptFiveDotSixTerraConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_six_terra";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_six_terra_global_openai_responses";

export class RubyOpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream extends WithRubyGptFiveDotSixTerraConfig(
  OpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream
);
