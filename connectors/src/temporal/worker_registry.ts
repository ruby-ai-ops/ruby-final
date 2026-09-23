import { runBigQueryWorker } from "@connectors/connectors/bigquery/temporal/worker";
import { runConfluenceWorker } from "@connectors/connectors/confluence/temporal/worker";
import { runRubyProjectWorker } from "@connectors/connectors/ruby_project/temporal/worker";
import { runGithubWorker } from "@connectors/connectors/github/temporal/worker";
import { runGongWorker } from "@connectors/connectors/gong/temporal/worker";
import { runGoogleWorkers } from "@connectors/connectors/google_drive/temporal/worker";
import { runIntercomWorker } from "@connectors/connectors/intercom/temporal/worker";
import { runMicrosoftWorker } from "@connectors/connectors/microsoft/temporal/worker";
import {
  runNotionGarbageCollectWorker,
  runNotionWorker,
} from "@connectors/connectors/notion/temporal/worker";
import { runSalesforceWorker } from "@connectors/connectors/salesforce/temporal/worker";
import { runSlackWorker } from "@connectors/connectors/slack/temporal/worker";
import { runSnowflakeWorker } from "@connectors/connectors/snowflake/temporal/worker";
import { runWebCrawlerWorker } from "@connectors/connectors/webcrawler/temporal/worker";
import { runZendeskWorkers } from "@connectors/connectors/zendesk/temporal/worker";

export type WorkerName =
  | "bigquery"
  | "confluence"
  | "ruby_project"
  | "github"
  | "gong"
  | "google_drive"
  | "intercom"
  | "microsoft"
  | "notion"
  | "notion_garbage_collector"
  | "salesforce"
  | "slack"
  | "snowflake"
  | "webcrawler"
  | "zendesk";

export const workerFunctions: Record<WorkerName, () => Promise<void>> = {
  bigquery: runBigQueryWorker,
  confluence: runConfluenceWorker,
  ruby_project: runRubyProjectWorker,
  github: runGithubWorker,
  gong: runGongWorker,
  google_drive: runGoogleWorkers,
  intercom: runIntercomWorker,
  microsoft: runMicrosoftWorker,
  notion: runNotionWorker,
  notion_garbage_collector: runNotionGarbageCollectWorker,
  salesforce: runSalesforceWorker,
  slack: runSlackWorker,
  snowflake: runSnowflakeWorker,
  webcrawler: runWebCrawlerWorker,
  zendesk: runZendeskWorkers,
};

export const ALL_WORKERS = Object.keys(workerFunctions);
