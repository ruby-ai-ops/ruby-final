import { WithRubyGrok47Config } from "@app/lib/llms/providers/xai/models/grok_four_dot_seven";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { XaiGrokFourDotSevenGlobalXaiStream } from "@app/lib/model_constructors/stream/endpoints/xai_grok_four_dot_seven_global_xai";

export class RubyXaiGrokFourDotSevenGlobalXaiStream extends WithRubyGrok47Config(
  XaiGrokFourDotSevenGlobalXaiStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(RubyXaiGrokFourDotSevenGlobalXaiStream);
