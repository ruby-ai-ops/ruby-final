import { mapReasoningEffortToLowHighMax } from "@app/lib/llms/stream/types/configuration";
import { FIREWORKS_GLM_5P3_FLASH_MODEL_CONFIG } from "@app/types/assistant/models/fireworks";

export function WithRubyZAiGlm53FlashConfig<
  TBase extends abstract new (
    ...args: any[]
  ) => object,
>(Base: TBase) {
  abstract class RubyZAiGlm53Flash extends Base {
    static readonly displayName = "GLM-5.3 Flash";
    static readonly description =
      "Z.ai's efficient native multimodal model for coding, long-horizon agentic work, and visual understanding (256k context, served via Fireworks).";
    // Ruby caps usable context at 256k; the model itself supports 1,048,576.
    static readonly contextSize = 256_000;
    // Ruby caps output at 64k; the model itself supports 131,072.
    static readonly maxOutputTokens = 64_000;
    static readonly byok = false;

    static readonly modelConfig = FIREWORKS_GLM_5P3_FLASH_MODEL_CONFIG;

    // GLM-5.3 Flash has no `medium`: fold Ruby's light/medium/high ladder onto
    // its native low/high/max efforts.
    static readonly configParsers = [mapReasoningEffortToLowHighMax];
  }

  return RubyZAiGlm53Flash;
}
