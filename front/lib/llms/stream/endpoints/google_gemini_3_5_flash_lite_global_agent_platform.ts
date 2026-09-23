import { WithRubyGoogleGeminiThreeDotFiveFlashLiteConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_5_flash_lite";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_5_flash_lite_global_agent_platform";

export class RubyGoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotFiveFlashLiteConfig(
  GoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream
);
