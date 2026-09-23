import type { RubyStreamEndpointConstructor } from "@app/lib/llms/stream/ruby_stream_endpoint";
import { RubyAnthropicClaudeFableFiveDotOneGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_fable_five_dot_one_global_anthropic";
import { RubyAnthropicClaudeFableFiveGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_fable_five_global_anthropic";
import { RubyAnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_haiku_four_dot_five_eu_agent_platform";
import { RubyAnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_haiku_four_dot_five_global_anthropic";
import { RubyAnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_five_dot_five_eu_agent_platform";
import { RubyAnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_five_dot_five_global_anthropic";
import { RubyAnthropicClaudeOpusFiveEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_five_eu_agent_platform";
import { RubyAnthropicClaudeOpusFiveGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_five_global_anthropic";
import { RubyAnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_eight_eu_agent_platform";
import { RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_eight_global_anthropic";
import { RubyAnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_seven_eu_agent_platform";
import { RubyAnthropicClaudeOpusFourDotSevenGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_seven_global_anthropic";
import { RubyAnthropicClaudeOpusFourDotSixEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_six_eu_agent_platform";
import { RubyAnthropicClaudeOpusFourDotSixGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_opus_four_dot_six_global_anthropic";
import { RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_sonnet_five_eu_agent_platform";
import { RubyAnthropicClaudeSonnetFiveGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_sonnet_five_global_anthropic";
import { RubyAnthropicClaudeSonnetFourDotSixEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_sonnet_four_dot_six_eu_agent_platform";
import { RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicStream } from "@app/lib/llms/stream/endpoints/anthropic_claude_sonnet_four_dot_six_global_anthropic";
import { RubyDeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream } from "@app/lib/llms/stream/endpoints/deepseek_deepseek_v_four_dot_one_flash_global_fireworks";
import { RubyDeepSeekDeepSeekV4ProGlobalFireworksStream } from "@app/lib/llms/stream/endpoints/deepseek_deepseek_v4_pro_global_fireworks";
import { RubyGoogleGeminiThreeDotOneFlashLiteGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_1_flash_lite_global_agent_platform";
import { RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_1_flash_lite_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotOneProGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_1_pro_global_agent_platform";
import { RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_1_pro_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_5_flash_global_agent_platform";
import { RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_5_flash_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_5_flash_lite_global_agent_platform";
import { RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_5_flash_lite_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotSixFlashEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_6_flash_eu_agent_platform";
import { RubyGoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_6_flash_global_agent_platform";
import { RubyGoogleGeminiThreeDotSixFlashGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_6_flash_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotSevenFlashEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_7_flash_eu_agent_platform";
import { RubyGoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_7_flash_global_agent_platform";
import { RubyGoogleGeminiThreeDotSevenFlashGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_7_flash_global_google_ai_studio";
import { RubyGoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_8_flash_eu_agent_platform";
import { RubyGoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_8_flash_global_agent_platform";
import { RubyGoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream } from "@app/lib/llms/stream/endpoints/google_gemini_3_8_flash_global_google_ai_studio";
import { RubyMistralCodestralEuropeMistralStream } from "@app/lib/llms/stream/endpoints/mistral_codestral_eu_mistral";
import { RubyMistralMistralLargeEuropeMistralStream } from "@app/lib/llms/stream/endpoints/mistral_mistral_large_eu_mistral";
import { RubyMistralMistralMedium35EuropeMistralStream } from "@app/lib/llms/stream/endpoints/mistral_mistral_medium_3_5_eu_mistral";
import { RubyMistralMistralSmallEuropeMistralStream } from "@app/lib/llms/stream/endpoints/mistral_mistral_small_eu_mistral";
import { RubyMoonshotAiKimiK3GlobalFireworksStream } from "@app/lib/llms/stream/endpoints/moonshot_ai_kimi_k3_global_fireworks";
import { RubyNoopNoopGlobalNoopStream } from "@app/lib/llms/stream/endpoints/noop_noop_global_noop";
import { RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_five_eu_openai_responses";
import { RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_five_global_openai_responses";
import { RubyOpenAIGptFiveDotFourEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_eu_openai_responses";
import { RubyOpenAIGptFiveDotFourGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_global_openai_responses";
import { RubyOpenAIGptFiveDotFourMiniEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_mini_eu_openai_responses";
import { RubyOpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_mini_global_openai_responses";
import { RubyOpenAIGptFiveDotFourNanoEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_nano_eu_openai_responses";
import { RubyOpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_four_nano_global_openai_responses";
import { RubyOpenAIGptFiveDotOneEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_one_eu_openai_responses";
import { RubyOpenAIGptFiveDotOneGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_one_global_openai_responses";
import { RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_luna_eu_openai_responses";
import { RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_luna_global_openai_responses";
import { RubyOpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_sol_eu_openai_responses";
import { RubyOpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_sol_global_openai_responses";
import { RubyOpenAIGptFiveDotSixTerraEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_terra_eu_openai_responses";
import { RubyOpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_terra_global_openai_responses";
import { RubyOpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_terra_long_context_eu_openai_responses";
import { RubyOpenAIGptFiveDotSixTerraLongContextGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_six_terra_long_context_global_openai_responses";
import { RubyOpenAIGptFiveDotTwoEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_two_eu_openai_responses";
import { RubyOpenAIGptFiveDotTwoGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_dot_two_global_openai_responses";
import { RubyOpenAIGptFiveEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_eu_openai_responses";
import { RubyOpenAIGptFiveGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_global_openai_responses";
import { RubyOpenAIGptFiveMiniEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_mini_eu_openai_responses";
import { RubyOpenAIGptFiveMiniGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_mini_global_openai_responses";
import { RubyOpenAIGptFiveNanoEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_nano_eu_openai_responses";
import { RubyOpenAIGptFiveNanoGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_five_nano_global_openai_responses";
import { RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_astra_eu_openai_responses";
import { RubyOpenAIGptSixAstraGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_astra_global_openai_responses";
import { RubyOpenAIGptSixLunaEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_luna_eu_openai_responses";
import { RubyOpenAIGptSixLunaGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_luna_global_openai_responses";
import { RubyOpenAIGptSixSolEuropeOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_sol_eu_openai_responses";
import { RubyOpenAIGptSixSolGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_gpt_six_sol_global_openai_responses";
import { RubyOpenAISimulatedFailureModelGlobalOpenAIResponsesStream } from "@app/lib/llms/stream/endpoints/openai_simulated_failure_model_global_openai_responses";
import { RubyThinkingMachinesInklingGlobalFireworksStream } from "@app/lib/llms/stream/endpoints/thinking_machines_inkling_global_fireworks";
import { RubyXaiGrokFourDotFiveGlobalXaiStream } from "@app/lib/llms/stream/endpoints/xai_grok_four_dot_five_global_xai";
import { RubyXaiGrokFourDotSevenGlobalXaiStream } from "@app/lib/llms/stream/endpoints/xai_grok_four_dot_seven_global_xai";
import { RubyXaiGrokFourDotSixGlobalXaiStream } from "@app/lib/llms/stream/endpoints/xai_grok_four_dot_six_global_xai";
import { RubyZAiGlmFiveDotThreeFlashGlobalFireworksStream } from "@app/lib/llms/stream/endpoints/z_ai_glm_five_dot_three_flash_global_fireworks";
import { RubyZAiGlmFiveDotThreeGlobalFireworksStream } from "@app/lib/llms/stream/endpoints/z_ai_glm_five_dot_three_global_fireworks";
import { isEndpointAvailable } from "@app/lib/llms/stream/utils/is_endpoint_available";
import type {
  EndpointConfig,
  Where,
  WorkspaceConfig,
} from "@app/lib/llms/types/filter";
import type { StreamEndpointId } from "@app/lib/model_constructors/stream";

export const RUBY_STREAM_ENDPOINTS = {
  [RubyAnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeHaikuFourDotFiveEuropeAgentPlatformStream,
  [RubyAnthropicClaudeOpusFiveEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeOpusFiveEuropeAgentPlatformStream,
  [RubyAnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeOpusFiveDotFiveEuropeAgentPlatformStream,
  [RubyAnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeOpusFourDotEightEuropeAgentPlatformStream,
  [RubyAnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeOpusFourDotSevenEuropeAgentPlatformStream,
  [RubyAnthropicClaudeOpusFourDotSixEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeOpusFourDotSixEuropeAgentPlatformStream,
  [RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeSonnetFiveEuropeAgentPlatformStream,
  [RubyAnthropicClaudeSonnetFourDotSixEuropeAgentPlatformStream.id]:
    RubyAnthropicClaudeSonnetFourDotSixEuropeAgentPlatformStream,
  [RubyGoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotFiveFlashGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotSixFlashEuropeAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotSixFlashEuropeAgentPlatformStream,
  [RubyGoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotSixFlashGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotSevenFlashEuropeAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotSevenFlashEuropeAgentPlatformStream,
  [RubyGoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotSevenFlashGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotEightFlashEuropeAgentPlatformStream,
  [RubyGoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotEightFlashGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotOneFlashLiteGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotOneFlashLiteGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotFiveFlashLiteGlobalAgentPlatformStream,
  [RubyGoogleGeminiThreeDotOneProGlobalAgentPlatformStream.id]:
    RubyGoogleGeminiThreeDotOneProGlobalAgentPlatformStream,
  [RubyAnthropicClaudeFableFiveGlobalAnthropicStream.id]:
    RubyAnthropicClaudeFableFiveGlobalAnthropicStream,
  [RubyAnthropicClaudeFableFiveDotOneGlobalAnthropicStream.id]:
    RubyAnthropicClaudeFableFiveDotOneGlobalAnthropicStream,
  [RubyAnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream.id]:
    RubyAnthropicClaudeHaikuFourDotFiveGlobalAnthropicStream,
  [RubyAnthropicClaudeOpusFiveGlobalAnthropicStream.id]:
    RubyAnthropicClaudeOpusFiveGlobalAnthropicStream,
  [RubyAnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream.id]:
    RubyAnthropicClaudeOpusFiveDotFiveGlobalAnthropicStream,
  [RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream.id]:
    RubyAnthropicClaudeOpusFourDotEightGlobalAnthropicStream,
  [RubyAnthropicClaudeOpusFourDotSevenGlobalAnthropicStream.id]:
    RubyAnthropicClaudeOpusFourDotSevenGlobalAnthropicStream,
  [RubyAnthropicClaudeOpusFourDotSixGlobalAnthropicStream.id]:
    RubyAnthropicClaudeOpusFourDotSixGlobalAnthropicStream,
  [RubyAnthropicClaudeSonnetFiveGlobalAnthropicStream.id]:
    RubyAnthropicClaudeSonnetFiveGlobalAnthropicStream,
  [RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicStream.id]:
    RubyAnthropicClaudeSonnetFourDotSixGlobalAnthropicStream,

  [RubyDeepSeekDeepSeekV4ProGlobalFireworksStream.id]:
    RubyDeepSeekDeepSeekV4ProGlobalFireworksStream,

  [RubyDeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream.id]:
    RubyDeepSeekDeepSeekVFourDotOneFlashGlobalFireworksStream,

  [RubyZAiGlmFiveDotThreeGlobalFireworksStream.id]:
    RubyZAiGlmFiveDotThreeGlobalFireworksStream,
  [RubyZAiGlmFiveDotThreeFlashGlobalFireworksStream.id]:
    RubyZAiGlmFiveDotThreeFlashGlobalFireworksStream,

  [RubyMoonshotAiKimiK3GlobalFireworksStream.id]:
    RubyMoonshotAiKimiK3GlobalFireworksStream,

  [RubyThinkingMachinesInklingGlobalFireworksStream.id]:
    RubyThinkingMachinesInklingGlobalFireworksStream,

  [RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotOneFlashLiteGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotFiveFlashLiteGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotOneProGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotFiveFlashGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotSixFlashGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotSixFlashGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotSevenFlashGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotSevenFlashGlobalGoogleAiStudioStream,
  [RubyGoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream.id]:
    RubyGoogleGeminiThreeDotEightFlashGlobalGoogleAiStudioStream,

  [RubyMistralCodestralEuropeMistralStream.id]:
    RubyMistralCodestralEuropeMistralStream,
  [RubyMistralMistralLargeEuropeMistralStream.id]:
    RubyMistralMistralLargeEuropeMistralStream,
  [RubyMistralMistralMedium35EuropeMistralStream.id]:
    RubyMistralMistralMedium35EuropeMistralStream,
  [RubyMistralMistralSmallEuropeMistralStream.id]:
    RubyMistralMistralSmallEuropeMistralStream,

  [RubyNoopNoopGlobalNoopStream.id]: RubyNoopNoopGlobalNoopStream,
  [RubyOpenAISimulatedFailureModelGlobalOpenAIResponsesStream.id]:
    RubyOpenAISimulatedFailureModelGlobalOpenAIResponsesStream,

  [RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFiveEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourMiniEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourMiniEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourNanoEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourNanoEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotOneEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotOneEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixLunaEuropeOpenAIResponsesStream,
  [RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptSixAstraEuropeOpenAIResponsesStream,
  [RubyOpenAIGptSixLunaEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptSixLunaEuropeOpenAIResponsesStream,
  [RubyOpenAIGptSixSolEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptSixSolEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixSolEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixTerraEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixTerraEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixTerraLongContextEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotTwoEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotTwoEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveMiniEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveMiniEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveNanoEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveNanoEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveEuropeOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveEuropeOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourMiniGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourNanoGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotFourGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotFourGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotOneGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotOneGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixLunaGlobalOpenAIResponsesStream,
  [RubyOpenAIGptSixAstraGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptSixAstraGlobalOpenAIResponsesStream,
  [RubyOpenAIGptSixLunaGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptSixLunaGlobalOpenAIResponsesStream,
  [RubyOpenAIGptSixSolGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptSixSolGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixSolGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixTerraGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotSixTerraLongContextGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotSixTerraLongContextGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveDotTwoGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveDotTwoGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveMiniGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveMiniGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveNanoGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveNanoGlobalOpenAIResponsesStream,
  [RubyOpenAIGptFiveGlobalOpenAIResponsesStream.id]:
    RubyOpenAIGptFiveGlobalOpenAIResponsesStream,
  [RubyXaiGrokFourDotFiveGlobalXaiStream.id]:
    RubyXaiGrokFourDotFiveGlobalXaiStream,
  [RubyXaiGrokFourDotSixGlobalXaiStream.id]:
    RubyXaiGrokFourDotSixGlobalXaiStream,
  [RubyXaiGrokFourDotSevenGlobalXaiStream.id]:
    RubyXaiGrokFourDotSevenGlobalXaiStream,
} as const satisfies Record<StreamEndpointId, RubyStreamEndpointConstructor>;

export function getStreamEndpoints(
  workspaceConfiguration: WorkspaceConfig,
  inputCondition: Where<EndpointConfig>
) {
  return Object.values(RUBY_STREAM_ENDPOINTS).filter((constructor) =>
    isEndpointAvailable(constructor, workspaceConfiguration, inputCondition)
  );
}
