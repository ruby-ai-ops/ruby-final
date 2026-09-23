import { WithRubyGoogleGeminiThreeDotSevenFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_7_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_7_flash_global_agent_platform";

export class RubyGoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotSevenFlashConfig(
  GoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream
);
