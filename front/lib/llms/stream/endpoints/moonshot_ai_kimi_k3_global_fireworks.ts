import { WithRubyMoonshotAiKimiK3Config } from "@app/lib/llms/providers/fireworks/models/kimi_k3";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { MoonshotAiKimiK3GlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/moonshot_ai_kimi_k3_global_fireworks";

export class RubyMoonshotAiKimiK3GlobalFireworksStream extends WithRubyMoonshotAiKimiK3Config(
  MoonshotAiKimiK3GlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyMoonshotAiKimiK3GlobalFireworksStream);
