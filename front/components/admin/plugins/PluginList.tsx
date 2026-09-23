import { PluginRunsList } from "@app/components/admin/plugins/PluginRunsList";
import { RunPluginDialog } from "@app/components/admin/plugins/RunPluginDialog";
import {
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
} from "@app/components/admin/shadcn/ui/card";
import type { PluginListItem } from "@app/lib/api/admin/types";
import { useAdminListPluginForResourceType } from "@app/admin-app/swr/plugins";
import type { PluginResourceTarget } from "@app/types/admin/plugins";
import { Button, cn, Input, Tooltip } from "@ruby-ai/ui";
// biome-ignore lint/correctness/noUnusedImports: ignored using `--suppress`
import React, { useMemo, useState } from "react";

interface PluginCardProps {
  onClick: () => void;
  plugin: PluginListItem;
}

function PluginCard({ onClick, plugin }: PluginCardProps) {
  return (
    <AdminCard
      className="flex h-16 w-full cursor-pointer items-center hover:bg-muted-background"
      onClick={onClick}
    >
      <AdminCardHeader className="flex overflow-hidden p-2 text-left">
        <AdminCardTitle className="text-sm font-medium">
          {plugin.name}
        </AdminCardTitle>
      </AdminCardHeader>
    </AdminCard>
  );
}

interface PluginListProps {
  pluginResourceTarget: PluginResourceTarget;
}

export function PluginList({ pluginResourceTarget }: PluginListProps) {
  const { plugins } = useAdminListPluginForResourceType({
    pluginResourceTarget,
  });
  const [selectedPlugin, setSelectedPlugin] = useState<PluginListItem | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showRuns, setShowRuns] = useState(false);

  const handlePluginSelect = (plugin: PluginListItem) => {
    setSelectedPlugin(plugin);
  };

  const handleDialogClose = () => {
    setSelectedPlugin(null);
  };

  const filteredPlugins = useMemo(() => {
    if (!searchQuery.trim()) {
      return plugins;
    }

    const query = searchQuery.toLowerCase().trim();
    return plugins.filter(
      (plugin) =>
        // Search by name or description.
        plugin.name.toLowerCase().includes(query) ||
        plugin.description.toLowerCase().includes(query)
    );
  }, [plugins, searchQuery]);

  return (
    <div className="flex flex-col rounded-lg border bg-background @container">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-t-lg border-b border-separator bg-background p-4 @xs:grid-cols-[minmax(0,1fr)_minmax(0,13rem)_auto]">
        <h2 className="text-md font-bold">Plugins</h2>
        <div className="col-span-2 row-start-2 min-w-0 @xs:col-span-1 @xs:col-start-2 @xs:row-start-1">
          <Input
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("w-full bg-background", showRuns && "invisible")}
          />
        </div>
        <div className="col-start-2 row-start-1 @xs:col-start-3">
          <Button
            label={showRuns ? "Show Available" : "Show History"}
            variant={showRuns ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowRuns(!showRuns)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {!showRuns ? (
          <div className="flex flex-1 flex-col">
            {filteredPlugins.length === 0 ? (
              <div className="flex min-h-32 flex-1 items-center justify-center px-4 py-8 text-center text-sm text-muted-foreground">
                {searchQuery.trim() ? (
                  <p>No plugins match your search.</p>
                ) : (
                  <p>No plugins available.</p>
                )}
              </div>
            ) : (
              <div
                className="grid w-full gap-3 p-4"
                // 11rem is the minimum card width.
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(11rem, 1fr))",
                }}
              >
                {filteredPlugins
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((plugin) => (
                    <Tooltip
                      key={plugin.id}
                      trigger={
                        <PluginCard
                          key={plugin.id}
                          plugin={plugin}
                          onClick={() => handlePluginSelect(plugin)}
                        />
                      }
                      label={plugin.description}
                    />
                  ))}
              </div>
            )}
          </div>
        ) : (
          <PluginRunsList pluginResourceTarget={pluginResourceTarget} />
        )}
      </div>
      {selectedPlugin && (
        <RunPluginDialog
          onClose={handleDialogClose}
          plugin={selectedPlugin}
          pluginResourceTarget={pluginResourceTarget}
        />
      )}
    </div>
  );
}
