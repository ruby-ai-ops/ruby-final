import { WithRubyDeepSeekDeepSeekV4ProConfig } from "@app/lib/llms/providers/fireworks/models/deepseek_v4_pro";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { DeepSeekDeepSeekV4ProGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/deepseek_deepseek_v4_pro_global_fireworks";

export class RubyDeepSeekDeepSeekV4ProGlobalFireworksStream extends WithRubyDeepSeekDeepSeekV4ProConfig(
  DeepSeekDeepSeekV4ProGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyDeepSeekDeepSeekV4ProGlobalFireworksStream);
