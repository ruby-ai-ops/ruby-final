import { WithRubyMistralCodestralConfig } from "@app/lib/llms/providers/mistral/models/codestral";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MistralCodestralEuropeMistralStream } from "@app/lib/model_constructors/stream/endpoints/mistral_codestral_eu_mistral";

export class RubyMistralCodestralEuropeMistralStream extends WithRubyMistralCodestralConfig(
  MistralCodestralEuropeMistralStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMistralCodestralEuropeMistralStream);
