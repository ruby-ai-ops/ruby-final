import type {
  WebhookSourceAdminDetails,
  WebhookSourceWithCounts,
} from "@app/lib/api/webhook_source";

export type AdminListWebhookSources = {
  webhookSources: WebhookSourceWithCounts[];
};

export type AdminGetWebhookSourceDetails = WebhookSourceAdminDetails;
