import { WithRubyThinkingMachinesInklingConfig } from "@app/lib/llms/providers/fireworks/models/inkling";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { ThinkingMachinesInklingGlobalFireworksStream } from "@app/lib/model_constructors/stream/endpoints/thinking_machines_inkling_global_fireworks";

export class RubyThinkingMachinesInklingGlobalFireworksStream extends WithRubyThinkingMachinesInklingConfig(
  ThinkingMachinesInklingGlobalFireworksStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyThinkingMachinesInklingGlobalFireworksStream);
