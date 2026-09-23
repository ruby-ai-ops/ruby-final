import type { LLMTrace } from "@app/lib/api/llm/traces/types";
import type { AdminFetchAssistantTemplateResponse } from "@app/lib/api/admin/templates";
import { clientFetch } from "@app/lib/egress/client";
import type { FetchAssistantTemplatesResponse } from "@app/lib/resources/template_resource";
import { emptyArray, useFetcher } from "@app/lib/swr/swr";
import type {
  GetDocumentsResponseBody,
  GetTablesResponseBody,
} from "@app/types/api/admin/data_sources";
import type { PullTemplatesResponseBody } from "@app/types/api/admin/templates";
import { useCallback, useMemo, useState } from "react";
import type { Fetcher } from "swr";
import useSWR from "swr";

interface AdminAssistantTemplatesResponse
  extends FetchAssistantTemplatesResponse {
  rubyRegionSyncEnabled: boolean;
}

import type { ConversationType } from "@app/types/assistant/conversation";
import type { DataSourceType } from "@app/types/data_source";
import type { LightWorkspaceType } from "@app/types/user";

export function useAdminPullTemplates() {
  const { mutateAssistantTemplates } = useAdminAssistantTemplates();
  const [isPulling, setIsPulling] = useState(false);

  const doPull = useCallback(async () => {
    setIsPulling(true);
    const response = await clientFetch("/api/admin/templates/pull", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to pull templates");
    }

    const data = (await response.json()) as PullTemplatesResponseBody;
    setIsPulling(false);
    if (data.success && data.count > 0) {
      void mutateAssistantTemplates();
      return data;
    }
    return data;
  }, [mutateAssistantTemplates]);

  return {
    doPull,
    isPulling,
  };
}

export function useAdminAssistantTemplates() {
  const { fetcher } = useFetcher();
  const assistantTemplatesFetcher: Fetcher<AdminAssistantTemplatesResponse> =
    fetcher;

  // Templates are shared across workspaces, not specific to a single one.
  const { data, error, mutate } = useSWR(
    "/api/admin/templates",
    assistantTemplatesFetcher
  );

  return {
    assistantTemplates: data?.templates ?? emptyArray(),
    rubyRegionSyncEnabled: data?.rubyRegionSyncEnabled ?? false,
    isAssistantTemplatesLoading: !error && !data,
    isAssistantTemplatesError: error,
    mutateAssistantTemplates: mutate,
  };
}

export function useAdminAssistantTemplate({
  templateId,
}: {
  templateId: string | null;
}) {
  const { fetcher } = useFetcher();
  const assistantTemplateFetcher: Fetcher<AdminFetchAssistantTemplateResponse> =
    fetcher;

  const { data, error, mutate } = useSWR(
    templateId !== null ? `/api/admin/templates/${templateId}` : null,
    assistantTemplateFetcher
  );

  return {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    assistantTemplate: useMemo(() => (data ? data : null), [data]),
    isAssistantTemplateLoading: !error && !data,
    isAssistantTemplateError: error,
    mutateAssistantTemplate: mutate,
  };
}

export function useAdminConversation({
  workspaceId,
  conversationId,
}: {
  workspaceId: string;
  conversationId: string | null;
}) {
  const { fetcher } = useFetcher();
  const conversationFetcher: Fetcher<{ conversation: ConversationType }> =
    fetcher;

  const { data, error, mutate } = useSWR(
    conversationId
      ? `/api/admin/workspaces/${workspaceId}/conversations/${conversationId}`
      : null,
    conversationFetcher
  );

  return {
    conversation: data ? data.conversation : null,
    isConversationLoading: !error && !data,
    isConversationError: error,
    mutateConversation: mutate,
  };
}

export function useAdminLLMTrace({
  workspace,
  runId,
  disabled,
}: {
  workspace: LightWorkspaceType;
  runId: string | null;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const llmTraceFetcher: Fetcher<{ trace: LLMTrace | null }> = fetcher;

  const { data, error, mutate } = useSWR(
    runId && !disabled
      ? `/api/admin/workspaces/${workspace.sId}/llm-traces/${runId}`
      : null,
    llmTraceFetcher
  );

  return {
    trace: data ? data.trace : null,
    isLLMTraceLoading: !error && !data && !disabled,
    isLLMTraceError: error,
    mutateLLMTrace: mutate,
  };
}

export function useAdminDocuments(
  owner: LightWorkspaceType,
  dataSource: DataSourceType,
  limit: number,
  offset: number
) {
  const { fetcher } = useFetcher();
  const documentsFetcher: Fetcher<GetDocumentsResponseBody> = fetcher;
  const { data, error, mutate } = useSWR(
    `/api/admin/workspaces/${owner.sId}/data_sources/${dataSource.sId}/documents?limit=${limit}&offset=${offset}`,
    documentsFetcher
  );

  return {
    documents: data?.documents ?? emptyArray(),
    total: data ? data.total : 0,
    isDocumentsLoading: !error && !data,
    isDocumentsError: error,
    mutateDocuments: mutate,
  };
}

export function useAdminTables(
  owner: LightWorkspaceType,
  dataSource: DataSourceType,
  limit: number,
  offset: number
) {
  const { fetcher } = useFetcher();
  const tablesFetcher: Fetcher<GetTablesResponseBody> = fetcher;
  const { data, error, mutate } = useSWR(
    `/api/admin/workspaces/${owner.sId}/data_sources/${dataSource.sId}/tables?limit=${limit}&offset=${offset}`,
    tablesFetcher
  );

  return {
    tables: data?.tables ?? emptyArray(),
    total: data ? data.total : 0,
    isTablesLoading: !error && !data,
    isTablesError: error,
    mutateTables: mutate,
  };
}
