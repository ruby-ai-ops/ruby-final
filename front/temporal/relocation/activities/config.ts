import { EnvironmentConfig } from "@app/types/shared/utils/config";

const config = {
  getGcsRelocationBucket: (): string => {
    return EnvironmentConfig.getEnvVariable("RUBY_RELOCATION_BUCKET");
  },
  // The project that runs the Storage Transfer jobs, ruby-infra. One transfer agent
  // that every cell grants on its buckets, instead of every cell granting every other.
  getGcsTransferProjectId: (): string => {
    return EnvironmentConfig.getEnvVariable(
      "RUBY_RELOCATION_TRANSFER_PROJECT_ID"
    );
  },
};

export default config;
