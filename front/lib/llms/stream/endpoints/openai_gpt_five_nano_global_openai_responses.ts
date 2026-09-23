import { WithRubyGptFiveNanoConfig } from "@app/lib/llms/providers/openai/models/gpt_five_nano";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { OpenAIGptFiveNanoGlobalOpenAIResponsesStream } from "@app/lib/model_constructors/stream/endpoints/openai_gpt_five_nano_global_openai_responses";

export class RubyOpenAIGptFiveNanoGlobalOpenAIResponsesStream extends WithRubyGptFiveNanoConfig(
  OpenAIGptFiveNanoGlobalOpenAIResponsesStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyOpenAIGptFiveNanoGlobalOpenAIResponsesStream);
