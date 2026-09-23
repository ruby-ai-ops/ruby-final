import { EnvironmentConfig } from "@app/types/shared/utils/config";

const config = {
  getUpsertQueueBucket: (): string => {
    return EnvironmentConfig.getEnvVariable("RUBY_UPSERT_QUEUE_BUCKET");
  },
  getServiceAccount: (): string | undefined => {
    return EnvironmentConfig.getOptionalEnvVariable("SERVICE_ACCOUNT");
  },
};

export default config;
