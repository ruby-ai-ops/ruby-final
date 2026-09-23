import { WithRubyMistralMedium35Config } from "@app/lib/llms/providers/mistral/models/mistral_medium_3_5";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MistralMistralMedium35EuropeMistralStream } from "@app/lib/model_constructors/stream/endpoints/mistral_mistral_medium_3_5_eu_mistral";

export class RubyMistralMistralMedium35EuropeMistralStream extends WithRubyMistralMedium35Config(
  MistralMistralMedium35EuropeMistralStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMistralMistralMedium35EuropeMistralStream);
