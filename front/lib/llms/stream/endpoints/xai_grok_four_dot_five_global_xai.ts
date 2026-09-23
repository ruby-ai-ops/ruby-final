import { WithRubyGrok45Config } from "@app/lib/llms/providers/xai/models/grok_four_dot_five";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { XaiGrokFourDotFiveGlobalXaiStream } from "@app/lib/model_constructors/stream/endpoints/xai_grok_four_dot_five_global_xai";

export class RubyXaiGrokFourDotFiveGlobalXaiStream extends WithRubyGrok45Config(
  XaiGrokFourDotFiveGlobalXaiStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyXaiGrokFourDotFiveGlobalXaiStream);
