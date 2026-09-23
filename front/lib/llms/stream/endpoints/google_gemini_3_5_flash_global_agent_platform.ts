import { WithRubyGoogleGeminiThreeDotFiveFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_5_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_5_flash_global_agent_platform";

export class RubyGoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotFiveFlashConfig(
  GoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream
);
