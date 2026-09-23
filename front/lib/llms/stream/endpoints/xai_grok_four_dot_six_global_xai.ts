import { WithRubyGrok46Config } from "@app/lib/llms/providers/xai/models/grok_four_dot_six";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { XaiGrokFourDotSixGlobalXaiStream } from "@app/lib/model_constructors/stream/endpoints/xai_grok_four_dot_six_global_xai";

export class RubyXaiGrokFourDotSixGlobalXaiStream extends WithRubyGrok46Config(
  XaiGrokFourDotSixGlobalXaiStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyXaiGrokFourDotSixGlobalXaiStream);
