import { WithRubyGptFiveDotTwoConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_two";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotTwoGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_two_global_openai_responses";

export class RubyOpenAIGptFiveDotTwoGlobalOpenAIResponsesStream extends WithRubyGptFiveDotTwoConfig(
  OpenAIGptFiveDotTwoGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotTwoGlobalOpenAIResponsesStream);
