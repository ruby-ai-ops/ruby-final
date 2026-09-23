import type { AdminSandboxType } from "@app/types/admin";

// E2B is the only sandbox provider, so its CLI is what operators attach with.
export function makeSandboxConnectCommand(sandbox: AdminSandboxType): string {
  return `e2b sandbox connect ${sandbox.providerId}`;
}
