import type { ConnectorProvider } from "@app/types/data_source";

export interface ConnectorMetadata {
  description: string;
  guideLink: string | null;
}

export const CONNECTOR_METADATA = {
  confluence: {
    description:
      "Grant tailored access to your organization's Confluence shared spaces.",
    guideLink: "https://docs.ruby.ad/docs/confluence-connection",
  },
  notion: {
    description:
      "Authorize granular access to your company's Notion workspace, by top-level pages.",
    guideLink: "https://docs.ruby.ad/docs/notion-connection",
  },
  google_drive: {
    description:
      "Authorize granular access to your company's Google Drive, by drives and folders. Supported files include GDocs, GSlides, and .txt files. Email us for .pdf indexing.",
    guideLink: "https://docs.ruby.ad/docs/google-drive-connection",
  },
  slack: {
    description:
      "Authorize granular access to your Slack workspace on a channel-by-channel basis.",
    guideLink: "https://docs.ruby.ad/docs/slack-connection",
  },
  github: {
    description:
      "Authorize access to your company's GitHub on a repository-by-repository basis. Ruby can access Issues, Discussions, and Pull Request threads. Code indexing can be controlled on-demand.",
    guideLink: "https://docs.ruby.ad/docs/github-connection",
  },
  intercom: {
    description:
      "Authorize granular access to your Intercom workspace. Access your Conversations at the Team level and Help Center Articles at the main Collection level.",
    guideLink: "https://docs.ruby.ad/docs/intercom-connection",
  },
  microsoft: {
    description:
      "Authorize Ruby to access a Microsoft account and index shared documents stored in SharePoint, OneDrive, and Office365.",
    guideLink: "https://docs.ruby.ad/docs/microsoft-connection",
  },
  webcrawler: {
    description: "Crawl a website.",
    guideLink: "https://docs.ruby.ad/docs/website-connection",
  },
  snowflake: {
    description: "Query a Snowflake database.",
    guideLink: "https://docs.ruby.ad/docs/snowflake-connection",
  },
  zendesk: {
    description:
      "Authorize access to Zendesk for indexing tickets from your support center and articles from your help center.",
    guideLink: "https://docs.ruby.ad/docs/zendesk-connection",
  },
  bigquery: {
    description: "Query a BigQuery database.",
    guideLink: "https://docs.ruby.ad/docs/bigquery",
  },
  salesforce: {
    description:
      "Authorize access to your Salesforce organization, in order to query your Salesforce data from Ruby.",
    guideLink: "https://docs.ruby.ad/docs/salesforce",
  },
  gong: {
    description: "Authorize access to Gong for indexing call transcripts.",
    guideLink: "https://docs.ruby.ad/docs/gong-connection",
  },
} satisfies Partial<Record<ConnectorProvider, ConnectorMetadata>>;

const METADATA_BY_PROVIDER: Partial<
  Record<ConnectorProvider, ConnectorMetadata>
> = CONNECTOR_METADATA;

export function getConnectorMetadata(
  provider: ConnectorProvider
): ConnectorMetadata | undefined {
  return METADATA_BY_PROVIDER[provider];
}
