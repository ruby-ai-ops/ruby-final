import { DataSourceViewSelector } from "@app/components/data_source_view/DataSourceViewSelector";
import { ViewDataSourceViewTable } from "@app/components/admin/data_source_views/view";
import { PluginList } from "@app/components/admin/plugins/PluginList";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminDataSourceViewDetails } from "@app/admin-app/swr/data_source_view_details";
import { useAdminInfiniteDataSourceViewContentNodes } from "@app/admin-app/swr/data_source_views";
import { defaultSelectionConfiguration } from "@app/types/data_source_view";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

export function SpaceDataSourceViewPage() {
  const owner = useWorkspace();

  const dsvId = useRequiredPathParam("dsvId");
  const {
    data: dataSourceViewDetails,
    isLoading,
    isError,
  } = useAdminDataSourceViewDetails({
    owner,
    dataSourceViewId: dsvId,
    disabled: false,
  });

  useAdminPageMetadata({
    name: dataSourceViewDetails?.dataSourceView.name,
    subtitle: owner.name,
    sId: dsvId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !dataSourceViewDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading data source view details.</p>
      </div>
    );
  }

  const { dataSourceView } = dataSourceViewDetails;

  return (
    <>
      <h3 className="text-xl font-bold">
        {dataSourceView.name} in space{" "}
        <LinkWrapper
          href={`/admin/${owner.sId}/spaces/${dataSourceView.space.sId}`}
          className="text-highlight-500"
        >
          {dataSourceView.space.name}
        </LinkWrapper>{" "}
        within workspace{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>
      <p>
        The data displayed here is fetched from <b>core</b> (
        <i>elasticsearch index</i>).
      </p>
      <div className="flex flex-row gap-x-6">
        <ViewDataSourceViewTable
          dataSourceView={dataSourceView}
          owner={owner}
        />
        <div className="mt-4 flex grow flex-col">
          <PluginList
            pluginResourceTarget={{
              resourceId: dataSourceView.sId,
              resourceType: "data_source_views",
              workspace: owner,
            }}
          />
          <div className="my-4 rounded-lg border p-4">
            <DataSourceViewSelector
              owner={owner}
              readonly
              selectionConfiguration={defaultSelectionConfiguration(
                dataSourceView
              )}
              setSelectionConfigurations={() => {}}
              viewType="all"
              isRootSelectable={true}
              useContentNodes={useAdminInfiniteDataSourceViewContentNodes}
            />
          </div>
        </div>
      </div>
    </>
  );
}
