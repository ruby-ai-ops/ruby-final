import { WithRubyGoogleGeminiThreeDotSixFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_6_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_6_flash_global_agent_platform";

export class RubyGoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream extends WithRubyGoogleGeminiThreeDotSixFlashConfig(
  GoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream
);
