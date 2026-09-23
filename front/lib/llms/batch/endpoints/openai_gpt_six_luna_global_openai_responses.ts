import { defineRubyBatchEndpoint } from "@app/lib/llms/batch/ruby_batch_endpoint";
import { OpenAIGptSixLunaGlobalOpenAIResponsesBatch } from "@app/lib/model_constructors/batch/endpoints/openai_gpt_six_luna_global_openai_responses";
import { GPT_6_LUNA_MODEL_CONFIG } from "@app/types/assistant/models/openai";

export class RubyOpenAIGptSixLunaGlobalOpenAIResponsesBatch extends OpenAIGptSixLunaGlobalOpenAIResponsesBatch {
  static readonly endpointFilter = {};
  static readonly modelConfig = GPT_6_LUNA_MODEL_CONFIG;
}

defineRubyBatchEndpoint(RubyOpenAIGptSixLunaGlobalOpenAIResponsesBatch);
