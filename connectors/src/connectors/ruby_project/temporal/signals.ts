import { defineSignal } from "@temporalio/workflow";

export const rubyProjectSyncSignal = defineSignal<[void]>(
  "ruby_project_sync_signal"
);
