import type { RubyBatchEndpointConstructor } from "@app/lib/llms/batch/ruby_batch_endpoint";
import { RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicBatch } from "@app/lib/llms/batch/endpoints/anthropic_claude_sonnet_four_dot_six_global_anthropic";
import { RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioBatch } from "@app/lib/llms/batch/endpoints/google_gemini_3_1_flash_lite_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioBatch } from "@app/lib/llms/batch/endpoints/google_gemini_3_1_pro_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioBatch } from "@app/lib/llms/batch/endpoints/google_gemini_3_5_flash_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioBatch } from "@app/lib/llms/batch/endpoints/google_gemini_3_5_flash_lite_global_google_ai_studio";
import { RubyMistralMistralMedium35GlobalMistralBatch } from "@app/lib/llms/batch/endpoints/mistral_mistral_medium_3_5_global_mistral";
import { RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_five_dot_five_eu_openai_responses";
import { RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_five_dot_five_global_openai_responses";
import { RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_five_dot_six_luna_eu_openai_responses";
import { RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_five_dot_six_luna_global_openai_responses";
import { RubyOpenAIGptSixLunaEuropeOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_six_luna_eu_openai_responses";
import { RubyOpenAIGptSixLunaGlobalOpenAIResponsesBatch } from "@app/lib/llms/batch/endpoints/openai_gpt_six_luna_global_openai_responses";
import { isEndpointAvailable } from "@app/lib/llms/batch/utils/is_endpoint_available";
import type {
  EndpointConfig,
  Where,
  WorkspaceConfig,
} from "@app/lib/llms/types/filter";
import type { BatchEndpointId } from "@app/lib/model_constructors/batch";

export const RUBY_BATCH_ENDPOINTS = {
  [RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicBatch.id]:
    RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicBatch,
  [RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioBatch.id]:
    RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioBatch,
  [RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioBatch.id]:
    RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioBatch,
  [RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioBatch.id]:
    RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioBatch,
  [RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioBatch.id]:
    RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioBatch,
  [RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch.id]:
    RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch,
  [RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesBatch.id]:
    RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesBatch,
  [RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesBatch.id]:
    RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesBatch,
  [RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesBatch.id]:
    RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesBatch,
  [RubyOpenAIGptSixLunaGlobalOpenAIResponsesBatch.id]:
    RubyOpenAIGptSixLunaGlobalOpenAIResponsesBatch,
  [RubyOpenAIGptSixLunaEuropeOpenAIResponsesBatch.id]:
    RubyOpenAIGptSixLunaEuropeOpenAIResponsesBatch,
  [RubyMistralMistralMedium35GlobalMistralBatch.id]:
    RubyMistralMistralMedium35GlobalMistralBatch,
} as const satisfies Record<BatchEndpointId, RubyBatchEndpointConstructor>;

export function getBatchEndpoints(
  workspaceConfiguration: WorkspaceConfig,
  inputCondition: Where<EndpointConfig>
) {
  return Object.values(RUBY_BATCH_ENDPOINTS).filter((constructor) =>
    isEndpointAvailable(constructor, workspaceConfiguration, inputCondition)
  );
}
