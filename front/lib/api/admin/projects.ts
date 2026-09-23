import type { ProjectKnowledgeFromConnectorItem } from "@app/lib/api/projects/context";
import type { ProjectWithAdminMetadata } from "@app/lib/api/projects/list";
import type { PodTaskType } from "@app/types/project_task";

export type AdminProjectType = ProjectWithAdminMetadata;

export type AdminListProjects = {
  projects: AdminProjectType[];
};

export type AdminProjectKnowledgeFromConnectorItem =
  ProjectKnowledgeFromConnectorItem;

export type AdminListProjectKnowledgeFromConnectors = {
  items: AdminProjectKnowledgeFromConnectorItem[];
};

export type AdminListProjectTasks = {
  tasks: PodTaskType[];
};
