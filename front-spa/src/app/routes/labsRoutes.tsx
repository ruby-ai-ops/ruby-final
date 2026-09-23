import { withSuspense } from "@spa/app/routes/withSuspense";
import type { RouteObject } from "react-router-dom";

const LabsPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/workspace/labs/LabsPage"),
  "LabsPage"
);
const TranscriptsPage = withSuspense(
  () =>
    import("@ruby-ai/front/components/pages/workspace/labs/TranscriptsPage"),
  "TranscriptsPage"
);

export const labsRoutes: RouteObject[] = [
  { path: "labs", element: <LabsPage /> },
  { path: "labs/transcripts", element: <TranscriptsPage /> },
];
