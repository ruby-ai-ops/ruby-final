import { WithRubyGptFiveDotFourNanoConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_four_nano";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_four_nano_global_openai_responses";

export class RubyOpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream extends WithRubyGptFiveDotFourNanoConfig(
  OpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyOpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream
);
