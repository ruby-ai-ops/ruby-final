import { DataSourceViewResource } from "@app/lib/resources/data_source_view_resource";
import type { SpaceResource } from "@app/lib/resources/space_resource";
import type { UserResource } from "@app/lib/resources/user_resource";
import type { ConnectorProvider } from "@app/types/data_source";
import type { WorkspaceType } from "@app/types/user";
import { faker } from "@faker-js/faker";

export class DataSourceViewFactory {
  static async folder(
    workspace: WorkspaceType,
    space: SpaceResource,
    editedByUser?: UserResource | null,
    overrides?: { rubyAPIProjectId?: string }
  ) {
    return DataSourceViewResource.createDataSourceAndDefaultView(
      {
        name: "datasource " + faker.string.alphanumeric(8),
        assistantDefaultSelected: false,
        rubyAPIProjectId:
          overrides?.rubyAPIProjectId ??
          "ruby-project-id" + faker.string.alphanumeric(8),
        rubyAPIDataSourceId:
          "ruby-datasource-id" + faker.string.alphanumeric(8),
        workspaceId: workspace.id,
      },
      space,
      editedByUser
    );
  }

  static async fromConnector(
    workspace: WorkspaceType,
    space: SpaceResource,
    connectorProvider: ConnectorProvider,
    editedByUser?: UserResource | null
  ) {
    return DataSourceViewResource.createDataSourceAndDefaultView(
      {
        name: "datasource " + faker.string.alphanumeric(8),
        assistantDefaultSelected: false,
        rubyAPIProjectId: "ruby-project-id" + faker.string.alphanumeric(8),
        rubyAPIDataSourceId:
          "ruby-datasource-id" + faker.string.alphanumeric(8),
        workspaceId: workspace.id,
        connectorProvider: connectorProvider,
      },
      space,
      editedByUser
    );
  }
}
