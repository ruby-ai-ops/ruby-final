// Contract types for the Admin workspace feature-flag endpoints.
import type { WhitelistableFeature } from "@app/types/shared/feature_flags";

export type GetAdminFeaturesResponseBody = {
  features: {
    name: WhitelistableFeature;
    createdAt: string;
  }[];
};
