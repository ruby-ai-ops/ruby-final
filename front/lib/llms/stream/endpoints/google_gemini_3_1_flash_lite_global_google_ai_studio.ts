import { WithRubyGoogleGeminiThreeDotOneFlashLiteConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_1_flash_lite";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_1_flash_lite_global_google_ai_studio";

export class RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream extends WithRubyGoogleGeminiThreeDotOneFlashLiteConfig(
  GoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream
);
