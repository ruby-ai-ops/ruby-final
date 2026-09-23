import { WithRubyZAiGlm53FlashConfig } from "@app/lib/llms/providers/fireworks/models/glm_five_dot_three_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { ZAiGlmFiveDotThreeFlashGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/z_ai_glm_five_dot_three_flash_global_fireworks";

export class RubyZAiGlmFiveDotThreeFlashGlobalFireworksStream extends WithRubyZAiGlm53FlashConfig(
  ZAiGlmFiveDotThreeFlashGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyZAiGlmFiveDotThreeFlashGlobalFireworksStream);
