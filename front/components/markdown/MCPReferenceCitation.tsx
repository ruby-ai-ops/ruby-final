import type { AllSupportedWithRubySpecificFileContentType } from "@app/types/files";

// TODO(interactive_content 2025-08-27): Use proper and distinct types for Interactive Content.
export interface MCPReferenceCitation {
  provider?: string;
  description?: string;
  href?: string;
  title: string;
  contentType: AllSupportedWithRubySpecificFileContentType;
  fileId?: string;
  ref?: string;
}
