import { blockquoteVariants } from "@ui/components/markdown/BlockquoteBlock";
import {
  codeBlockVariants,
  codeInlineVariants,
} from "@ui/components/markdown/CodeBlock";
import {
  liBlockVariants,
  olBlockVariants,
  ulBlockVariants,
} from "@ui/components/markdown/List";
import { paragraphBlockVariants } from "@ui/components/markdown/ParagraphBlock";
import { preBlockVariants } from "@ui/components/markdown/PreBlock";

// This exports markdown styles for all components.
// It is used in the InputBar component.
export const markdownStyles = {
  blockquote: blockquoteVariants,
  codeInline: codeInlineVariants,
  codeBlock: codeBlockVariants,
  list: liBlockVariants,
  orderedList: olBlockVariants,
  paragraph: paragraphBlockVariants,
  pre: preBlockVariants,
  unorderedList: ulBlockVariants,
};
