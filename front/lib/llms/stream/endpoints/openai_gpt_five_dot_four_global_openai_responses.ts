import { WithRubyGptFiveDotFourConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_four";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFourGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_four_global_openai_responses";

export class RubyOpenAIGptFiveDotFourGlobalOpenAIResponsesStream extends WithRubyGptFiveDotFourConfig(
  OpenAIGptFiveDotFourGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotFourGlobalOpenAIResponsesStream);
