import type { FetchAssistantTemplatesResponse } from "@app/lib/resources/template_resource";
import { useAdminAssistantTemplates, useAdminPullTemplates } from "@app/admin-app/swr";
import type {
  TemplateTagCodeType,
  TemplateVisibility,
} from "@app/types/assistant/templates";
import { TEMPLATES_TAGS_CONFIG } from "@app/types/assistant/templates";
import { isDevelopment } from "@app/types/shared/env";
import {
  Button,
  Chip,
  DataTable,
  LinkWrapper,
  SearchInput,
  Spinner,
} from "@ruby-ai/ui";
import type { CellContext } from "@tanstack/react-table";
// biome-ignore lint/correctness/noUnusedImports: ignored using `--suppress`
import React, { useState } from "react";

interface TemplatesDisplayType {
  id: string;
  name: string;
  hasSidekickInstructions: boolean;
  visibility: TemplateVisibility;
  tags: TemplateTagCodeType[];
  onClick?: () => void;
}

type Info = CellContext<TemplatesDisplayType, unknown>;

function prepareTemplatesForDisplay(
  templates: FetchAssistantTemplatesResponse["templates"]
): TemplatesDisplayType[] {
  return templates.map((t) => ({
    id: t.sId,
    name: t.handle,
    hasSidekickInstructions: t.hasSidekickInstructions,
    visibility: t.visibility,
    tags: t.tags,
  }));
}

function makeColumnsForTemplates() {
  return [
    {
      accessorKey: "id",
      cell: (info: Info) => {
        const id: string = info.row.getValue("id");
        return (
          <LinkWrapper
            className="font-bold hover:underline"
            href={`/admin/templates/${id}`}
          >
            {id}
          </LinkWrapper>
        );
      },
    },
    {
      accessorKey: "name",
      cell: (info: Info) => (
        <DataTable.CellContent>{info.row.original.name}</DataTable.CellContent>
      ),
    },
    {
      accessorKey: "visibility",
      cell: (info: Info) => (
        <DataTable.CellContent>
          {info.row.original.visibility}
        </DataTable.CellContent>
      ),
    },
    {
      header: "Sidekick Instructions",
      accessorKey: "hasSidekickInstructions",
      cell: (info: Info) => (
        <DataTable.CellContent>
          {info.row.original.hasSidekickInstructions ? "Yes" : "No"}
        </DataTable.CellContent>
      ),
    },
    {
      accessorKey: "tags",
      cell: (info: Info) => {
        const tags: TemplateTagCodeType[] = info.row.getValue("tags");
        const tagChips = tags.map((t) => (
          <Chip
            label={
              TEMPLATES_TAGS_CONFIG[t] ? TEMPLATES_TAGS_CONFIG[t].label : t
            }
            key={t}
            size="xs"
          />
        ));
        return <div className="flex gap-x-2">{tagChips}</div>;
      },
    },
  ];
}

export function TemplatesDataTable() {
  const {
    assistantTemplates,
    rubyRegionSyncEnabled,
    isAssistantTemplatesLoading,
  } = useAdminAssistantTemplates();
  const { doPull, isPulling } = useAdminPullTemplates();
  const [templateSearch, setTemplateSearch] = useState<string>("");

  const data = prepareTemplatesForDisplay(assistantTemplates);
  const columns = makeColumnsForTemplates();

  return (
    <div className="my-4 flex w-full flex-col gap-2 rounded-lg border p-4">
      <div className="flex w-full items-center justify-between gap-3">
        <h2 className="text-md flex-grow pb-4 font-bold">Templates:</h2>
        {(rubyRegionSyncEnabled || isDevelopment()) && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPulling}
            onClick={async () => {
              await doPull();
            }}
            isLoading={isPulling}
            label={isPulling ? "Pulling..." : "Pull templates"}
          />
        )}
        {(!rubyRegionSyncEnabled || isDevelopment()) && (
          <Button
            aria-label="Create template"
            variant="outline"
            size="sm"
            label="Create template"
            href="/admin/templates/new"
          />
        )}
      </div>
      <SearchInput
        name="search"
        placeholder="Search (Name)"
        value={templateSearch}
        onChange={(s) => {
          setTemplateSearch(s);
        }}
      />
      <div className="mt-2 flex w-full flex-col items-center gap-2">
        {isAssistantTemplatesLoading ? (
          <Spinner />
        ) : (
          <DataTable
            data={data}
            columns={columns}
            filter={templateSearch}
            filterColumn={"name"}
          />
        )}
      </div>
    </div>
  );
}
