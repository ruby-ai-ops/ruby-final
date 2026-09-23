import { FrameV2Page } from "@app/components/admin/pages/FrameV2Page";
import { InteractiveContentFilePage } from "@app/components/admin/pages/InteractiveContentFilePage";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminFileDetails } from "@app/admin-app/swr/frame_details";
import { isFrameV2ContentType } from "@app/types/files";
import { Spinner } from "@ruby-ai/ui";

/**
 * Both Frames v2 and v1 interactive content are `FileResource`s addressed by file sId, so one admin
 * route serves both and branches on the content type — the same shape as `SpacePage` branching
 * into `ProjectPage` for Pods.
 */
export function FramePage() {
  const owner = useWorkspace();
  const sId = useRequiredPathParam("sId");

  const {
    file,
    content,
    shareInfo,
    sharingGrants,
    isFileLoading,
    isFileError,
  } = useAdminFileDetails({ owner, sId });

  useAdminPageMetadata({
    name: file?.fileName,
    subtitle: owner.name,
    sId,
  });

  if (isFileLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isFileError || !file) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="text-lg font-medium text-warning">
          Failed to load file
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          The file may not exist or there was an error fetching it.
        </div>
      </div>
    );
  }

  if (isFrameV2ContentType(file.contentType)) {
    return <FrameV2Page frameId={sId} />;
  }

  return (
    <InteractiveContentFilePage
      content={content}
      file={file}
      shareInfo={shareInfo}
      sharingGrants={sharingGrants}
    />
  );
}
