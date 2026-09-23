import { WithRubyGoogleGeminiThreeDotFiveFlashConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_5_flash";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_5_flash_global_google_ai_studio";

export class RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream extends WithRubyGoogleGeminiThreeDotFiveFlashConfig(
  GoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream
);
