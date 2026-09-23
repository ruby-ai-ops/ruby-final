import { WithRubyGoogleGeminiThreeDotEightFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_8_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_8_flash_global_agent_platform";

export class RubyGoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotEightFlashConfig(
  GoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream
);
