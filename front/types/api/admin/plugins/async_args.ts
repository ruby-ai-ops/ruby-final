import type { AsyncEnumValues, EnumValues } from "@app/types/admin/plugins";

export interface AdminGetPluginAsyncArgsResponseBody {
  asyncArgs: Record<
    string,
    string | number | boolean | AsyncEnumValues | EnumValues
  >;
}
