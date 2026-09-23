import { defineRubyBatchEndpoint } from "@app/lib/llms/batch/ruby_batch_endpoint";
import { MistralMistralMedium35GlobalMistralBatch } from "@app/lib/model_constructors/batch/endpoints/mistral_mistral_medium_3_5_global_mistral";
import { MISTRAL_MEDIUM_3_5_MODEL_CONFIG } from "@app/types/assistant/models/mistral";

export class RubyMistralMistralMedium35GlobalMistralBatch extends MistralMistralMedium35GlobalMistralBatch {
  static readonly endpointFilter = {};
  static readonly modelConfig = MISTRAL_MEDIUM_3_5_MODEL_CONFIG;
}

defineRubyBatchEndpoint(RubyMistralMistralMedium35GlobalMistralBatch);
