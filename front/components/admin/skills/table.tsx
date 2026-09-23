import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { CreateSkillSuggestionSheet } from "@app/components/admin/skills/CreateSkillSuggestionSheet";
import { makeColumnsForSkills } from "@app/components/admin/skills/columns";
import { useAdminSkills } from "@app/admin-app/swr/skills";
import type { LightWorkspaceType } from "@app/types/user";
import { Button } from "@ruby-ai/ui";
import { useState } from "react";

interface SkillsDataTableProps {
  owner: LightWorkspaceType;
  loadOnInit?: boolean;
}

export function SkillsDataTable({ owner, loadOnInit }: SkillsDataTableProps) {
  const [showCreateSuggestionSheet, setShowCreateSuggestionSheet] =
    useState(false);

  const skillButtons = (
    <div className="flex flex-row gap-2">
      <Button
        aria-label="Create skill suggestion"
        variant="outline"
        size="sm"
        onClick={() => setShowCreateSuggestionSheet(true)}
        label="💡 Create skill suggestion"
      />
    </div>
  );

  return (
    <>
      <CreateSkillSuggestionSheet
        show={showCreateSuggestionSheet}
        onClose={() => setShowCreateSuggestionSheet(false)}
        owner={owner}
      />
      <AdminDataTableConditionalFetch
        header="Skills"
        globalActions={skillButtons}
        owner={owner}
        loadOnInit={loadOnInit}
        useSWRHook={useAdminSkills}
      >
        {(data) => (
          <AdminDataTable columns={makeColumnsForSkills(owner)} data={data} />
        )}
      </AdminDataTableConditionalFetch>
    </>
  );
}
