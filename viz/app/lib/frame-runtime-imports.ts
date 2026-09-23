export const FRAME_RUNTIME_IMPORT_NAMES = [
  "papaparse",
  "react",
  "recharts",
  "shadcn",
  "utils",
  "@viz/lib/utils",
  "lucide-react",
  "motion/react",
  "@ruby-ai/slideshow/v1",
  "@ruby-ai/slideshow/v2",
  "@ruby-ai/react-hooks",
] as const;

export type FrameRuntimeImportName =
  (typeof FRAME_RUNTIME_IMPORT_NAMES)[number];
