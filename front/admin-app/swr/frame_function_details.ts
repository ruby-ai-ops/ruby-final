import type {
  AdminGetFrameFunction,
  AdminGetFrameFunctionSource,
} from "@app/lib/api/admin/frames";
import type {
  AdminGetSandboxFunctionInvocation,
  AdminGetSandboxFunctionMCPActionOutput,
  AdminListSandboxFunctionInvocations,
  AdminSandboxFunctionInvocation,
} from "@app/lib/api/admin/sandbox_functions";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type {
  SandboxFunctionInvocationOrigin,
  SandboxFunctionInvocationStatus,
} from "@app/types/api/sandbox_functions";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface FrameFunctionScope {
  owner: LightWorkspaceType;
  frameId: string;
  functionId: string;
}

function frameFunctionUrl({ owner, frameId, functionId }: FrameFunctionScope) {
  return `/api/admin/workspaces/${owner.sId}/frames/${frameId}/functions/${functionId}`;
}

export function useAdminFrameFunctionDetails({
  owner,
  frameId,
  functionId,
  disabled,
}: FrameFunctionScope & { disabled?: boolean }) {
  const { fetcher } = useFetcher();
  const frameFunctionFetcher: Fetcher<AdminGetFrameFunction> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    frameFunctionUrl({ owner, frameId, functionId }),
    frameFunctionFetcher,
    { disabled }
  );

  return {
    frameFunction: data?.frameFunction ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminFrameFunctionSource({
  owner,
  frameId,
  functionId,
  disabled,
}: FrameFunctionScope & { disabled?: boolean }) {
  const { fetcher } = useFetcher();
  const sourceFetcher: Fetcher<AdminGetFrameFunctionSource> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `${frameFunctionUrl({ owner, frameId, functionId })}/source`,
    sourceFetcher,
    { disabled }
  );

  return {
    source: data?.source ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminSandboxFunctionInvocations({
  owner,
  frameId,
  functionId,
  limit,
  status,
  origin,
  disabled,
}: FrameFunctionScope & {
  limit: number;
  status?: SandboxFunctionInvocationStatus;
  origin?: SandboxFunctionInvocationOrigin;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const invocationsFetcher: Fetcher<AdminListSandboxFunctionInvocations> =
    fetcher;

  const params = new URLSearchParams({ limit: limit.toString() });
  if (status) {
    params.set("status", status);
  }
  if (origin) {
    params.set("origin", origin);
  }

  const { data, error, mutate } = useSWRWithDefaults(
    `${frameFunctionUrl({ owner, frameId, functionId })}/invocations?${params.toString()}`,
    invocationsFetcher,
    { disabled }
  );

  return {
    invocations: data?.items ?? emptyArray<AdminSandboxFunctionInvocation>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminSandboxFunctionInvocation({
  owner,
  frameId,
  functionId,
  invocationId,
  disabled,
}: FrameFunctionScope & { invocationId: string; disabled?: boolean }) {
  const { fetcher } = useFetcher();
  const invocationFetcher: Fetcher<AdminGetSandboxFunctionInvocation> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `${frameFunctionUrl({ owner, frameId, functionId })}/invocations/${invocationId}`,
    invocationFetcher,
    { disabled }
  );

  return {
    invocation: data?.invocation ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminSandboxFunctionMCPActionOutput({
  owner,
  frameId,
  functionId,
  invocationId,
  actionId,
  disabled,
}: FrameFunctionScope & {
  invocationId: string;
  actionId: string;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const outputFetcher: Fetcher<AdminGetSandboxFunctionMCPActionOutput> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `${frameFunctionUrl({ owner, frameId, functionId })}/invocations/${invocationId}/actions/${actionId}/output`,
    outputFetcher,
    { disabled }
  );

  return {
    output: data?.output ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
