import type { DatasourceRetrievalData } from "@app/lib/api/assistant/observability/datasource_retrieval";

export type AdminGetDatasourceRetrievalResponse = {
  datasources: DatasourceRetrievalData[];
  total: number;
};
