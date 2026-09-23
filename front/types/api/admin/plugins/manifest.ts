import type {
  PluginArgs,
  PluginManifest,
  SupportedResourceType,
} from "@app/types/admin/plugins";

export interface AdminGetPluginDetailsResponseBody {
  manifest: PluginManifest<PluginArgs, SupportedResourceType>;
}
