import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { SkillType } from "@app/types/assistant/skill_configuration";
import type { EnrichedSpaceType } from "@app/types/space";
import type { UserType } from "@app/types/user";
import { Chip } from "@ruby-ai/ui";

interface SkillOverviewTableProps {
  skill: SkillType;
  editedByUser: UserType | null;
  spaces: EnrichedSpaceType[];
}

export function SkillOverviewTable({
  skill,
  editedByUser,
  spaces,
}: SkillOverviewTableProps) {
  return (
    <div className="flex flex-grow flex-col rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-md flex-grow pb-4 font-bold">Overview</h2>
      </div>
      <AdminTable>
        <AdminTableBody>
          <AdminTableRow>
            <AdminTableCell>Name</AdminTableCell>
            <AdminTableCell>{skill.name}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>sId</AdminTableCell>
            <AdminTableCell>{skill.sId}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Status</AdminTableCell>
            <AdminTableCell>
              <span className="capitalize">{skill.status}</span>
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Spaces</AdminTableCell>
            <AdminTableCell className="flex flex-row space-x-2">
              {spaces.map((s) => (
                <Chip
                  key={s.sId}
                  size="sm"
                  color={s.isRestricted ? "warning" : "highlight"}
                >
                  {s.name}
                </Chip>
              ))}
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Availability</AdminTableCell>
            <AdminTableCell>{skill.availability}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Tools count</AdminTableCell>
            <AdminTableCell>{skill.tools.length}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Created at</AdminTableCell>
            <AdminTableCell>
              {skill.createdAt
                ? formatTimestampToFriendlyDate(skill.createdAt)
                : "N/A"}
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Updated at</AdminTableCell>
            <AdminTableCell>
              {skill.updatedAt
                ? formatTimestampToFriendlyDate(skill.updatedAt)
                : "N/A"}
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableCell>Edited by</AdminTableCell>
            <AdminTableCell>
              {editedByUser
                ? `${editedByUser.fullName} (${editedByUser.email})`
                : "N/A"}
            </AdminTableCell>
          </AdminTableRow>
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
