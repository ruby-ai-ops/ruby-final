import { WithRubyDeepSeekDeepSeekV41FlashConfig } from "@app/lib/llms/providers/fireworks/models/deepseek_v_four_dot_one_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { DeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/deepseek_deepseek_v_four_dot_one_flash_global_fireworks";

export class RubyDeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream extends WithRubyDeepSeekDeepSeekV41FlashConfig(
  DeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyDeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream
);
