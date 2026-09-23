import { WithRubyZAiGlm53Config } from "@app/lib/llms/providers/fireworks/models/glm_five_dot_three";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { ZAiGlmFiveDotThreeGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/z_ai_glm_five_dot_three_global_fireworks";

export class RubyZAiGlmFiveDotThreeGlobalFireworksStream extends WithRubyZAiGlm53Config(
  ZAiGlmFiveDotThreeGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyZAiGlmFiveDotThreeGlobalFireworksStream);
