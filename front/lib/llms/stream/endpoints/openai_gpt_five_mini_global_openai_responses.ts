import { WithRubyGptFiveMiniConfig } from "@app/lib/llms/providers/openai/models/gpt_five_mini";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveMiniGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_mini_global_openai_responses";

export class RubyOpenAIGptFiveMiniGlobalOpenAIResponsesStream extends WithRubyGptFiveMiniConfig(
  OpenAIGptFiveMiniGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveMiniGlobalOpenAIResponsesStream);
