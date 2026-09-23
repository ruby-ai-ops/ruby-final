import { AdminDataTableFacetedFilter } from "@app/components/admin/shadcn/ui/data_table_faceted_filter";
import { AdminDataTablePagination } from "@app/components/admin/shadcn/ui/pagination";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { Checkbox, Input } from "@ruby-ai/ui";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface Facet {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  selectedValues?: string[];
  onSelectedValuesChange?: (selectedValues: string[]) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultFilterColumn?: string;
  isLoading?: boolean;
  isValidating?: boolean;
  facets?: Facet[];
  pageSize?: number;
  // Server-side (manual) mode. When `serverSideRowCount` is provided,
  // pagination and sorting are controlled by the caller and applied
  // server-side (the `data` prop is the current page only). Otherwise the
  // table paginates/sorts/filters the full `data` set client-side as before.
  serverSideRowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // When provided, the filter box drives server-side search (controlled by the
  // caller) instead of the built-in client-side global filter.
  search?: string;
  onSearchChange?: (search: string) => void;
  onRowClick?: (row: TData) => void;
  // When true, a leading checkbox column is added and rows become selectable.
  // The header checkbox selects/deselects all rows matching the current
  // filters (across pages), not just the current page.
  enableRowSelection?: boolean;
  // Stable row identity, so a selection survives filtering/pagination. Defaults
  // to the row index when omitted.
  getRowId?: (row: TData) => string;
  // Rendered above the table whenever at least one row is selected. Receives
  // the rows matching the current filters that are selected, plus a callback to
  // clear the selection.
  renderBulkActions?: (args: {
    selectedRows: TData[];
    resetSelection: () => void;
  }) => React.ReactNode;
  // Optional per-row CSS classes, computed from the row data (e.g. to mute
  // revoked members).
  getRowClassName?: (row: TData) => string | undefined;
}

export function AdminDataTable<TData, TValue>({
  data,
  columns,
  defaultFilterColumn,
  facets,
  isLoading,
  isValidating,
  pageSize = 10,
  serverSideRowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  search,
  onSearchChange,
  onRowClick,
  enableRowSelection,
  getRowId,
  renderBulkActions,
  getRowClassName,
}: DataTableProps<TData, TValue>) {
  const isServerSide = serverSideRowCount !== undefined;
  const isServerSearch = onSearchChange !== undefined;

  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const resolvedSorting = isServerSide ? (sorting ?? []) : internalSorting;

  const selectionColumn: ColumnDef<TData, TValue> = {
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "partial"
              : false
        }
        onCheckedChange={(checked) =>
          table.toggleAllRowsSelected(checked === true)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      />
    ),
  };

  const resolvedColumns = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getRowId,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: "includesString", // built-in filter function
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    ...(isServerSide
      ? { rowCount: serverSideRowCount }
      : { getSortedRowModel: getSortedRowModel() }),
    onSortingChange: isServerSide
      ? (updater: Updater<SortingState>) => {
          const next =
            typeof updater === "function" ? updater(resolvedSorting) : updater;
          onSortingChange?.(next);
        }
      : setInternalSorting,
    ...(isServerSide
      ? {
          onPaginationChange: (updater: Updater<PaginationState>) => {
            const current = pagination ?? { pageIndex: 0, pageSize };
            const next =
              typeof updater === "function" ? updater(current) : updater;
            onPaginationChange?.(next);
          },
        }
      : {}),
    state: {
      columnFilters,
      sorting: resolvedSorting,
      rowSelection,
      ...(isServerSide && pagination ? { pagination } : {}),
    },
    initialState: {
      globalFilter: "",
      ...(isServerSide ? {} : { pagination: { pageSize } }),
    },
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="w-full space-y-2" aria-busy={isValidating || undefined}>
      <div className="flex items-center gap-4">
        {isServerSearch ? (
          <Input
            name="search"
            placeholder="Search ..."
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="max-w-sm"
          />
        ) : (
          <Input
            name="filter"
            placeholder="Filter ..."
            value={
              defaultFilterColumn
                ? (table
                    .getColumn(defaultFilterColumn)
                    ?.getFilterValue() as string)
                : table.getState().globalFilter
            }
            onChange={(e) =>
              defaultFilterColumn
                ? table
                    .getColumn(defaultFilterColumn)
                    ?.setFilterValue(e.target.value)
                : table.setGlobalFilter(e.target.value)
            }
            className="max-w-sm"
          />
        )}
        {facets &&
          facets.map((facet) => (
            <AdminDataTableFacetedFilter
              key={facet.columnId}
              column={table.getColumn(facet.columnId)}
              title={facet.title}
              options={facet.options}
              selectedValues={facet.selectedValues}
              onSelectedValuesChange={facet.onSelectedValuesChange}
            />
          ))}
        {isValidating !== undefined && (
          <div
            className="ml-auto flex h-8 min-w-16 items-center justify-end text-xs text-muted-foreground"
            role="status"
          >
            {isValidating ? "Updating…" : null}
          </div>
        )}
      </div>
      {renderBulkActions &&
        (() => {
          const selectedRows = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original);
          if (selectedRows.length === 0) {
            return null;
          }
          return (
            <div className="flex items-center gap-3 rounded-md border bg-muted-background p-2">
              <span className="text-sm font-medium">
                {selectedRows.length} selected
              </span>
              {renderBulkActions({
                selectedRows,
                resetSelection: () => table.resetRowSelection(),
              })}
            </div>
          );
        })()}
      <div className="rounded-md border">
        <AdminTable>
          <AdminTableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <AdminTableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <AdminTableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </AdminTableHead>
                  );
                })}
              </AdminTableRow>
            ))}
          </AdminTableHeader>
          <AdminTableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <AdminTableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    [
                      onRowClick ? "cursor-pointer" : "",
                      getRowClassName?.(row.original) ?? "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <AdminTableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </AdminTableCell>
                  ))}
                </AdminTableRow>
              ))
            ) : (
              <AdminTableRow>
                <AdminTableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </AdminTableCell>
              </AdminTableRow>
            )}
          </AdminTableBody>
        </AdminTable>
        {table.getPageCount() > 0 && <AdminDataTablePagination table={table} />}
      </div>
    </div>
  );
}
