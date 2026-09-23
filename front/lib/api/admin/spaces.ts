import type { AdminSpaceType } from "@app/types/admin";
import type { PodMetadataType } from "@app/types/project_metadata";
import type { EnrichedSpaceType } from "@app/types/space";
import type { UserTypeWithWorkspaces } from "@app/types/user";

export type AdminListSpaces = {
  spaces: EnrichedSpaceType[];
};

export type AdminGetSpaceDetails = {
  members: Record<string, UserTypeWithWorkspaces[]>;
  metadata: PodMetadataType | null;
  space: AdminSpaceType;
};
