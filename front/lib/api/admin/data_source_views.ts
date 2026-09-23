import type { DataSourceViewWithUsage } from "@app/lib/api/data_source_view";
import type { DataSourceViewContentNode } from "@app/types/data_source_view";
import type { AdminDataSourceViewType } from "@app/types/admin";

export type { DataSourceViewWithUsage };

export type AdminListDataSourceViews = {
  data_source_views: DataSourceViewWithUsage[];
};

export type AdminGetDataSourceViewDetails = {
  dataSourceView: AdminDataSourceViewType;
};

export type AdminGetDataSourceViewContentNodes = {
  nodes: DataSourceViewContentNode[];
  total: number;
  totalIsAccurate: boolean;
  nextPageCursor: string | null;
};
