import config from "@app/lib/api/config";
import { fetchAdminGroupById } from "@app/lib/api/admin/groups";
import {
  findWorkspaceByWorkOSOrganizationId,
  getWorkspaceInfos,
  unsafeGetWorkspacesByModelId,
} from "@app/lib/api/workspace";
import { Authenticator } from "@app/lib/auth";
import { tryParsePhoneNumber } from "@app/lib/plans/trial/phone";
import {
  dataSourceToAdminItem,
  dataSourceViewToAdminItem,
} from "@app/lib/admin/utils";
import { DataSourceResource } from "@app/lib/resources/data_source_resource";
import { DataSourceViewResource } from "@app/lib/resources/data_source_view_resource";
import { FileResource } from "@app/lib/resources/file_resource";
import { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
import { SkillResource } from "@app/lib/resources/skill/skill_resource";
import { SpaceResource } from "@app/lib/resources/space_resource";
import { getResourceNameAndIdFromSId } from "@app/lib/resources/string_ids";
import { SubscriptionResource } from "@app/lib/resources/subscription_resource";
import { WebhookSourceResource } from "@app/lib/resources/webhook_source_resource";
import { WorkspaceResource } from "@app/lib/resources/workspace_resource";
import { WorkspaceVerificationAttemptResource } from "@app/lib/resources/workspace_verification_attempt_resource";
import logger from "@app/logger/logger";
import { ConnectorsAPI } from "@app/types/connectors/connectors_api";
import type { ConnectorType } from "@app/types/data_source";
import type { AdminItemBase } from "@app/types/admin";
import { normalizeError } from "@app/types/shared/utils/error_utils";
import { asDisplayName } from "@app/types/shared/utils/string_utils";
import { validate as validateUuid } from "uuid";

async function searchAdminWorkspaces(
  searchTerm: string
): Promise<AdminItemBase[]> {
  const workspaceInfos = await getWorkspaceInfos(searchTerm);
  if (workspaceInfos) {
    return [
      {
        id: workspaceInfos.id,
        name: workspaceInfos.name,
        link: `${config.getAdminAppUrl()}/${workspaceInfos.sId}`,
        type: "Workspace",
      },
    ];
  }

  const workspaceModelId = parseInt(searchTerm, 10);
  if (!isNaN(workspaceModelId)) {
    const workspaces = await unsafeGetWorkspacesByModelId([workspaceModelId]);
    if (workspaces.length > 0) {
      return workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        link: `${config.getAdminAppUrl()}/${w.sId}`,
        type: "Workspace",
      }));
    }
  }

  if (searchTerm.startsWith("org_")) {
    const workspaceByOrgId =
      await findWorkspaceByWorkOSOrganizationId(searchTerm);
    if (workspaceByOrgId) {
      return [
        {
          id: workspaceByOrgId.id,
          name: workspaceByOrgId.name,
          link: `${config.getAdminAppUrl()}/${workspaceByOrgId.sId}`,
          type: "Workspace",
        },
      ];
    }
  }

  return [];
}

async function searchByStripeSubscriptionId(
  searchTerm: string
): Promise<AdminItemBase[]> {
  if (!searchTerm.startsWith("sub_")) {
    return [];
  }

  const subscription = await SubscriptionResource.fetchByStripeId(searchTerm);
  if (!subscription) {
    return [];
  }

  const workspaces = await unsafeGetWorkspacesByModelId([
    subscription.workspaceId,
  ]);
  if (workspaces.length === 0) {
    return [];
  }

  const workspace = workspaces[0];
  return [
    {
      id: workspace.id,
      name: workspace.name,
      link: `${config.getAdminAppUrl()}/${workspace.sId}`,
      type: "Workspace",
    },
  ];
}

async function searchConnectorModelId(
  searchTerm: string
): Promise<AdminItemBase[] | null> {
  const connectorModelId = parseInt(searchTerm, 10);
  if (!isNaN(connectorModelId)) {
    const connectorsAPI = new ConnectorsAPI(
      config.getConnectorsAPIConfig(),
      logger
    );
    const cRes = await connectorsAPI.getConnector(searchTerm);
    if (cRes.isOk()) {
      const connector: ConnectorType = {
        ...cRes.value,
        connectionId: null,
      };

      const workspace = await WorkspaceResource.fetchById(
        connector.workspaceId
      );
      if (!workspace) {
        return null;
      }

      return [
        {
          id: parseInt(connector.id, 10),
          name: `${workspace.name}'s ${asDisplayName(connector.type)}`,
          link: `${config.getAdminAppUrl()}/${connector.workspaceId}/data_sources/${connector.dataSourceId}`,
          type: "Connector",
        },
      ];
    }
  }
  return null;
}

async function searchAdminConnectors(
  searchTerm: string
): Promise<AdminItemBase[]> {
  const searchResult = await searchConnectorModelId(searchTerm);
  if (searchResult) {
    return searchResult;
  }

  // Support embedded sId in formats like "XXX-YYY-sID" or "XXX-YYY-sID-OTHERSTUFFWITHNUMBERS".
  // useful for logs that are in datadog
  const hyphenParts = searchTerm.split("-");
  if (hyphenParts.length >= 3) {
    const searchResult = await searchConnectorModelId(hyphenParts[2]);
    if (searchResult) {
      return searchResult;
    }
  }

  return [];
}

async function searchAdminFrames(searchTerm: string): Promise<AdminItemBase[]> {
  // Share tokens are UUIDs.
  if (!validateUuid(searchTerm)) {
    return [];
  }

  const res = await FileResource.fetchByShareTokenWithContent(searchTerm);
  if (!res) {
    return [];
  }

  const { file } = res;

  const [workspace] = await WorkspaceResource.fetchByModelIds([
    file.workspaceId,
  ]);
  if (!workspace) {
    return [];
  }

  return [
    {
      id: file.id,
      name: `Frame (token: ${searchTerm.slice(0, 8)}...)`,
      link: `${config.getAdminAppUrl()}/${workspace.sId}/files/${file.sId}`,
      type: "Frame",
    },
  ];
}

// `rubyAPIProjectId` is a numeric string.
const RUBY_API_PROJECT_ID_REGEX = /^\d+$/;

async function searchAdminDataSourcesByRubyAPIProjectId(
  auth: Authenticator,
  searchTerm: string
): Promise<AdminItemBase[]> {
  if (!RUBY_API_PROJECT_ID_REGEX.test(searchTerm)) {
    return [];
  }

  const dataSource = await DataSourceResource.unsafeFetchByRubyAPIProjectId(
    auth,
    searchTerm
  );
  if (!dataSource) {
    return [];
  }

  return [await dataSourceToAdminItem(dataSource)];
}

async function searchByPhoneNumber(
  searchTerm: string
): Promise<AdminItemBase[]> {
  let e164PhoneNumber: string | null;
  try {
    e164PhoneNumber = tryParsePhoneNumber(searchTerm);
  } catch (err) {
    logger.warn(
      { err: normalizeError(err) },
      "Phone number parsing unavailable; skipping phone-search axis"
    );
    return [];
  }
  if (!e164PhoneNumber) {
    return [];
  }

  const workspaceModelId =
    await WorkspaceVerificationAttemptResource.findWorkspaceModelIdFromPhoneNumber(
      e164PhoneNumber
    );
  if (!workspaceModelId) {
    return [];
  }

  const workspaces = await unsafeGetWorkspacesByModelId([workspaceModelId]);
  if (workspaces.length === 0) {
    return [];
  }

  const workspace = workspaces[0];
  return [
    {
      id: workspace.id,
      name: `${workspace.name} (phone trial)`,
      link: `${config.getAdminAppUrl()}/${workspace.sId}`,
      type: "Workspace",
    },
  ];
}

export async function searchAdminResources(
  auth: Authenticator,
  searchTerm: string
): Promise<AdminItemBase[]> {
  const resourceInfo = getResourceNameAndIdFromSId(searchTerm);
  if (resourceInfo) {
    return searchAdminResourcesBySId(resourceInfo);
  }

  return (
    await Promise.all([
      searchAdminWorkspaces(searchTerm),
      searchAdminConnectors(searchTerm),
      searchAdminFrames(searchTerm),
      searchByStripeSubscriptionId(searchTerm),
      searchByPhoneNumber(searchTerm),
      searchAdminDataSourcesByRubyAPIProjectId(auth, searchTerm),
    ])
  ).flat();
}

async function searchAdminResourcesBySId(
  resourceInfo: Exclude<ReturnType<typeof getResourceNameAndIdFromSId>, null>
): Promise<AdminItemBase[]> {
  const { resourceName, sId, workspaceModelId } = resourceInfo;

  // The admin authenticator is not scoped to any workspace while resource
  // fetches are; re-scope to the workspace embedded in the sId.
  const [workspace] = await WorkspaceResource.fetchByModelIds([
    workspaceModelId,
  ]);
  if (!workspace) {
    return [];
  }
  const workspaceAuth = await Authenticator.internalAdminForWorkspace(
    workspace.sId
  );
  const workspaceUrl = `${config.getAdminAppUrl()}/${workspace.sId}`;

  switch (resourceName) {
    case "data_source_view": {
      const dataSourceView = await DataSourceViewResource.fetchById(
        workspaceAuth,
        sId
      );
      if (!dataSourceView) {
        return [];
      }

      return [await dataSourceViewToAdminItem(dataSourceView)];
    }

    case "data_source": {
      const dataSource = await DataSourceResource.fetchByNameOrId(
        workspaceAuth,
        sId
      );
      if (!dataSource) {
        return [];
      }

      return [await dataSourceToAdminItem(dataSource)];
    }

    case "space": {
      const space = await SpaceResource.fetchById(workspaceAuth, sId, {
        includeDeleted: true,
      });
      if (!space) {
        return [];
      }

      return [
        {
          id: space.id,
          name: `${workspace.name}'s ${space.name} space`,
          link: `${workspaceUrl}/spaces/${space.sId}`,
          type: "Space",
        },
      ];
    }

    case "group": {
      const group = await fetchAdminGroupById(workspaceAuth, sId);
      if (!group) {
        return [];
      }

      return [
        {
          id: group.id,
          name: `${workspace.name}'s ${group.name} group`,
          link: `${workspaceUrl}/groups/${group.sId}`,
          type: "Group",
        },
      ];
    }

    case "skill": {
      const skill = await SkillResource.fetchById(workspaceAuth, sId);
      if (!skill) {
        return [];
      }

      return [
        {
          id: skill.id,
          name: `${workspace.name}'s ${skill.name} skill`,
          link: `${workspaceUrl}/skills/${skill.sId}`,
          type: "Skill",
        },
      ];
    }

    case "mcp_server_view": {
      const mcpServerView = await MCPServerViewResource.fetchById(
        workspaceAuth,
        sId
      );
      if (!mcpServerView) {
        return [];
      }

      return [
        {
          id: mcpServerView.id,
          name: `${workspace.name}'s ${mcpServerView.toJSON().server.name} server view`,
          link: `${workspaceUrl}/spaces/${mcpServerView.space.sId}/mcp_server_views/${mcpServerView.sId}`,
          type: "MCP Server View",
        },
      ];
    }

    case "webhook_source": {
      const webhookSource = await WebhookSourceResource.fetchById(
        workspaceAuth,
        sId
      );
      if (!webhookSource) {
        return [];
      }

      return [
        {
          id: webhookSource.id,
          name: `${workspace.name}'s ${webhookSource.name} webhook source`,
          link: `${workspaceUrl}/webhook-sources/${webhookSource.sId}`,
          type: "Webhook Source",
        },
      ];
    }

    case "file": {
      const file = await FileResource.fetchById(workspaceAuth, sId);
      if (!file) {
        return [];
      }

      return [
        {
          id: file.id,
          name: `${workspace.name}'s ${file.fileName}`,
          link: `${workspaceUrl}/files/${file.sId}`,
          type: "File",
        },
      ];
    }

    default:
      return [];
  }
}
