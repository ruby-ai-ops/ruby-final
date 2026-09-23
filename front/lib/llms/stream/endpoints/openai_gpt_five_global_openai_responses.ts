import { WithRubyGptFiveConfig } from "@app/lib/llms/providers/openai/models/gpt_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_global_openai_responses";

export class RubyOpenAIGptFiveGlobalOpenAIResponsesStream extends WithRubyGptFiveConfig(
  OpenAIGptFiveGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveGlobalOpenAIResponsesStream);
