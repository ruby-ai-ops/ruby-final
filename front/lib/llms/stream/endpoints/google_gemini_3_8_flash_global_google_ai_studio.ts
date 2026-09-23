import { WithRubyGoogleGeminiThreeDotEightFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_8_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_8_flash_global_google_ai_studio";

export class RubyGoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream extends WithRubyGoogleGeminiThreeDotEightFlashConfig(
  GoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream
);
