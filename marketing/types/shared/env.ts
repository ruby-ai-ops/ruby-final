import type { LightWorkspaceType } from "../user";

export function isDevelopment() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.IS_DEVELOPMENT === "true"
  );
}
export function isTest() {
  return process.env.NODE_ENV === "test";
}
export function isRubyWorkspace(w: LightWorkspaceType) {
  return w.sId === process.env.PRODUCTION_RUBY_WORKSPACE_ID;
}
