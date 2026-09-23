import { IconButton } from "@ruby-ai/ui";
import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import type { Column } from "@tanstack/react-table";

interface AdminColumnSortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  label: string;
}

export function AdminColumnSortableHeader<TData>({
  column,
  label,
}: AdminColumnSortableHeaderProps<TData>) {
  const sorted = column.getIsSorted();
  const nextDirection = sorted === "asc" ? "descending" : "ascending";

  return (
    <div className="flex items-center space-x-2">
      <p>{label}</p>
      <IconButton
        aria-label={`Sort ${label} ${nextDirection}`}
        variant="outline"
        icon={ArrowsUpDownIcon}
        onClick={() => column.toggleSorting(sorted === "asc")}
      />
    </div>
  );
}
