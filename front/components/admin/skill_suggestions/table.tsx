import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { makeColumnsForSkillSuggestions } from "@app/components/admin/skill_suggestions/columns";
import { useAdminSkillSuggestions } from "@app/admin-app/swr/skill_suggestions";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import { asDisplayName } from "@app/types/shared/utils/string_utils";
import type { SkillSuggestionType } from "@app/types/suggestions/skill_suggestion";
import {
  SKILL_SUGGESTION_KINDS,
  SKILL_SUGGESTION_SOURCES,
  SKILL_SUGGESTION_STATES,
} from "@app/types/suggestions/skill_suggestion";
import type { LightWorkspaceType } from "@app/types/user";

interface SkillSuggestionDataTableProps {
  owner: LightWorkspaceType;
  skillId: string;
}

export function SkillSuggestionDataTable({
  owner,
  skillId,
}: SkillSuggestionDataTableProps) {
  const useSuggestionsWithSkill = (props: AdminConditionalFetchProps) =>
    useAdminSkillSuggestions({ ...props, skillId });

  const facets = [
    {
      columnId: "kind",
      title: "Kind",
      options: SKILL_SUGGESTION_KINDS.map((kind) => ({
        label: asDisplayName(kind),
        value: kind,
      })),
    },
    {
      columnId: "state",
      title: "State",
      options: SKILL_SUGGESTION_STATES.map((state) => ({
        label: asDisplayName(state),
        value: state,
      })),
    },
    {
      columnId: "source",
      title: "Source",
      options: SKILL_SUGGESTION_SOURCES.map((source) => ({
        label: asDisplayName(source),
        value: source,
      })),
    },
  ];

  return (
    <AdminDataTableConditionalFetch
      header="Suggestions"
      owner={owner}
      useSWRHook={useSuggestionsWithSkill}
    >
      {(suggestions, mutate) => {
        const columns = makeColumnsForSkillSuggestions(
          owner,
          skillId,
          async () => {
            await mutate();
          }
        );

        return (
          <AdminDataTable<SkillSuggestionType, unknown>
            columns={columns}
            data={suggestions}
            facets={facets}
          />
        );
      }}
    </AdminDataTableConditionalFetch>
  );
}
