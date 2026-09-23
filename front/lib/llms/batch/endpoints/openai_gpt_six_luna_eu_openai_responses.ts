import { defineRubyBatchEndpoint } from "@app/lib/llms/batch/ruby_batch_endpoint";
import { OpenAIGptSixLunaEuropeOpenAIResponsesBatch } from "@app/lib/model_constructors/batch/endpoints/openai_gpt_six_luna_eu_openai_responses";
import { GPT_6_LUNA_MODEL_CONFIG } from "@app/types/assistant/models/openai";

export class RubyOpenAIGptSixLunaEuropeOpenAIResponsesBatch extends OpenAIGptSixLunaEuropeOpenAIResponsesBatch {
  static readonly endpointFilter = {};
  static readonly modelConfig = GPT_6_LUNA_MODEL_CONFIG;
}

defineRubyBatchEndpoint(RubyOpenAIGptSixLunaEuropeOpenAIResponsesBatch);
