import { defineRubyBatchEndpoint } from "@app/lib/llms/batch/ruby_batch_endpoint";
import { OpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch } from "@app/lib/model_constructors/batch/endpoints/openai_gpt_five_dot_five_global_openai_responses";
import { GPT_5_5_MODEL_CONFIG } from "@app/types/assistant/models/openai";

export class RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch extends OpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch {
  static readonly endpointFilter = {};
  static readonly modelConfig = GPT_5_5_MODEL_CONFIG;
}

defineRubyBatchEndpoint(RubyOpenAIGptFiveDotFiveGlobalOpenAIResponsesBatch);
