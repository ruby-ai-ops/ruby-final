import { RubyProjectConfigurationModel } from "@connectors/lib/models/ruby_project";
import type {
  ConnectorProviderConfigurationType,
  ConnectorProviderModelResourceMapping,
  ConnectorProviderStrategy,
  WithCreationAttributes,
} from "@connectors/resources/connector/strategy";
import type { ConnectorResource } from "@connectors/resources/connector_resource";
import { RubyProjectConfigurationResource } from "@connectors/resources/ruby_project_configuration_resource";
import { RubyProjectConversationResource } from "@connectors/resources/ruby_project_conversation_resource";
import { RubyProjectMountFileResource } from "@connectors/resources/ruby_project_mount_file_resource";
import type { ModelId } from "@connectors/types";
import type { Transaction } from "sequelize";

export class RubyProjectConnectorStrategy
  implements ConnectorProviderStrategy<"ruby_project">
{
  async makeNew(
    connectorId: ModelId,
    blob: WithCreationAttributes<RubyProjectConfigurationModel>,
    transaction: Transaction
  ): Promise<ConnectorProviderModelResourceMapping["ruby_project"] | null> {
    return RubyProjectConfigurationResource.makeNew({
      connectorId,
      projectId: blob.projectId,
      transaction,
    });
  }

  async delete(
    connector: ConnectorResource,
    transaction: Transaction
  ): Promise<void> {
    await RubyProjectMountFileResource.deleteByConnector(
      connector,
      transaction
    );
    await RubyProjectConversationResource.deleteByConnector(
      connector,
      transaction
    );
    await RubyProjectConfigurationModel.destroy({
      where: { connectorId: connector.id },
      transaction,
    });
  }

  async fetchConfigurationsbyConnectorIds(): Promise<
    Record<ModelId, ConnectorProviderModelResourceMapping["ruby_project"]>
  > {
    return {};
  }

  configurationJSON(): ConnectorProviderConfigurationType {
    return null;
  }
}
