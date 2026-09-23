import { WithRubyGoogleGeminiThreeDotOneProConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_1_pro";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotOneProGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_1_pro_global_agent_platform";

export class RubyGoogleGeminiThreeDotOneProGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotOneProConfig(
  GoogleGeminiThreeDotOneProGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotOneProGlobalAgentPlatformStream
);
