import { isDevelopment } from "@app/types/shared/env";

export const ASSISTANT_EMAIL_SUBDOMAIN = isDevelopment()
  ? "dev.ruby.help"
  : "ruby.team";
