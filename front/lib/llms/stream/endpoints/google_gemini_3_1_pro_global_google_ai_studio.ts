import { WithRubyGoogleGeminiThreeDotOneProConfig } from "@app/lib/llms/providers/google_ai_studio/models/gemini_3_1_pro";
import { defineRubyStreamEndpoint } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { GoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream } from "@app/lib/model_constructors/stream/endpoints/google_gemini_3_1_pro_global_google_ai_studio";

export class RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream extends WithRubyGoogleGeminiThreeDotOneProConfig(
  GoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream
) {
  static readonly endpointFilter = {};
}

defineRubyStreamEndpoint(
  RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream
);
