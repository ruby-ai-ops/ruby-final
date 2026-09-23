import { useMarkdownStyle } from "@ui/components/markdown/MarkdownStyleContext";
import {
  type MarkdownNode,
  sameNodePosition,
} from "@ui/components/markdown/utils";
import React, { memo } from "react";

interface StrongBlockProps {
  children?: React.ReactNode;
  node?: MarkdownNode;
}

/**
 * Renders bold (`**strong**`) text inside Markdown output with semibold
 * weight and the context text color.
 * @summary Strong-text renderer for Markdown.
 */
export const StrongBlock = memo(
  function StrongBlock({ children }: StrongBlockProps) {
    const { textColor } = useMarkdownStyle();
    return <strong className={`font-semibold ${textColor}`}>{children}</strong>;
  },
  (prev, next) => sameNodePosition(prev.node, next.node)
);
