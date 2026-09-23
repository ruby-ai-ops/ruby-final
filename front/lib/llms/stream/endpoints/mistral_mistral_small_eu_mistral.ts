import { WithRubyMistralSmallConfig } from "@app/lib/llms/providers/mistral/models/mistral_small";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MistralMistralSmallEuropeMistralStream } from "@app/lib/model_constructors/stream/endpoints/mistral_mistral_small_eu_mistral";

export class RubyMistralMistralSmallEuropeMistralStream extends WithRubyMistralSmallConfig(
  MistralMistralSmallEuropeMistralStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMistralMistralSmallEuropeMistralStream);
