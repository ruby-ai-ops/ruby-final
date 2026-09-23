import { WithRubyGptFiveDotOneConfig } from "@app/lib/llms/providers/openai/models/gpt_five_dot_one";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveDotOneGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_dot_one_global_openai_responses";

export class RubyOpenAIGptFiveDotOneGlobalOpenAIResponsesStream extends WithRubyGptFiveDotOneConfig(
  OpenAIGptFiveDotOneGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveDotOneGlobalOpenAIResponsesStream);
