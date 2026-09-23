import { WithRubyGptFiveDotFiveConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotFiveGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_five_global_openai_responses";

export class RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesStream extends WithRubyGptFiveDotFiveConfig(
  OpenAIGptFiveDotFiveGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesStream);
