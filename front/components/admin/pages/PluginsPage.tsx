import { PluginList } from "@app/components/admin/plugins/PluginList";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";

export function PluginsPage() {
  useAdminPageMetadata({ name: "Plugins" });

  return (
    <div className="h-full flex-grow flex-col items-center justify-center p-8 pt-8">
      <PluginList
        pluginResourceTarget={{
          resourceType: "global",
        }}
      />
    </div>
  );
}
