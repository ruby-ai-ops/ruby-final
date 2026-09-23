import { FrameDatabaseDataTable } from "@app/components/admin/frames/databases/table";
import { FrameFunctionDataTable } from "@app/components/admin/frames/functions/table";
import { FramePublicationSection } from "@app/components/admin/frames/publication";
import { FrameSharingSection } from "@app/components/admin/frames/sharing";
import { FrameStorageTable } from "@app/components/admin/frames/storage";
import { ViewFrameTable } from "@app/components/admin/frames/view";
import { PluginList } from "@app/components/admin/plugins/PluginList";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useAdminFrameDetails } from "@app/admin-app/swr/frames";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

interface FrameV2PageProps {
  frameId: string;
}

export function FrameV2Page({ frameId }: FrameV2PageProps) {
  const owner = useWorkspace();
  const { details, isLoading, isError } = useAdminFrameDetails({
    frameId,
    owner,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <div className="text-lg font-medium text-warning">
          Failed to load Frame details
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h3 className="text-xl font-bold">
        Frame {details.frame.name ?? details.frame.fileName} within workspace{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>

      <ViewFrameTable details={details} owner={owner} />
      <PluginList
        pluginResourceTarget={{
          resourceId: details.frame.sId,
          resourceType: "files",
          workspace: owner,
        }}
      />
      <FrameSharingSection
        sharing={details.sharing}
        sharingGrants={details.sharingGrants}
      />
      <FrameStorageTable storage={details.storage} />
      <FramePublicationSection
        publication={details.publication}
        publicationError={details.publicationError}
      />
      <FrameFunctionDataTable frameId={frameId} owner={owner} />
      <FrameDatabaseDataTable frameId={frameId} owner={owner} />
    </div>
  );
}
