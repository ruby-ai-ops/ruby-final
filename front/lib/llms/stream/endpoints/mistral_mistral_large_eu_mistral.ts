import { WithRubyMistralLargeConfig } from "@app/lib/llms/providers/mistral/models/mistral_large";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MistralMistralLargeEuropeMistralStream } from "@app/lib/model_constructors/stream/endpoints/mistral_mistral_large_eu_mistral";

export class RubyMistralMistralLargeEuropeMistralStream extends WithRubyMistralLargeConfig(
  MistralMistralLargeEuropeMistralStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMistralMistralLargeEuropeMistralStream);
