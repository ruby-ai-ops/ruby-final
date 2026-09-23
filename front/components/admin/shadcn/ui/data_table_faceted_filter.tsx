import { cn } from "@app/components/admin/shadcn/lib/utils";
import { AdminBadge } from "@app/components/admin/shadcn/ui/badge";
import { AdminButton } from "@app/components/admin/shadcn/ui/button";
import {
  AdminCommand,
  AdminCommandGroup,
  AdminCommandItem,
  AdminCommandList,
  AdminCommandSeparator,
} from "@app/components/admin/shadcn/ui/command";
import { isString } from "@app/types/shared/utils/general";
import {
  Check,
  PlusCircle,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@ruby-ai/ui";
import { Separator } from "@radix-ui/react-select";
import type { Column } from "@tanstack/react-table";
import type * as React from "react";

interface AdminDataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  selectedValues?: string[];
  onSelectedValuesChange?: (selectedValues: string[]) => void;
}

export function AdminDataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  selectedValues,
  onSelectedValuesChange,
}: AdminDataTableFacetedFilterProps<TData, TValue>) {
  const columnFilterValue = column?.getFilterValue();
  const columnSelectedValues = Array.isArray(columnFilterValue)
    ? columnFilterValue.filter(isString)
    : [];
  const selectedValueSet = new Set(selectedValues ?? columnSelectedValues);
  const facets = onSelectedValuesChange
    ? undefined
    : column?.getFacetedUniqueValues();

  const setSelectedValues = (values: string[]) => {
    if (onSelectedValuesChange) {
      onSelectedValuesChange(values);
    } else {
      column?.setFilterValue(values.length > 0 ? values : undefined);
    }
  };

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <AdminButton variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValueSet.size > 0 && (
            <>
              <Separator className="mx-2 h-4" />
              <AdminBadge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValueSet.size}
              </AdminBadge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValueSet.size > 2 ? (
                  <AdminBadge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValueSet.size} selected
                  </AdminBadge>
                ) : (
                  options
                    .filter((option) => selectedValueSet.has(option.value))
                    .map((option) => (
                      <AdminBadge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </AdminBadge>
                    ))
                )}
              </div>
            </>
          )}
        </AdminButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-primary-100 p-0" align="start">
        <AdminCommand>
          <AdminCommandList>
            <AdminCommandGroup>
              {options.map((option) => {
                const isSelected = selectedValueSet.has(option.value);

                return (
                  <AdminCommandItem
                    key={option.value}
                    onSelect={() => {
                      const nextSelectedValues = new Set(selectedValueSet);
                      if (isSelected) {
                        nextSelectedValues.delete(option.value);
                      } else {
                        nextSelectedValues.add(option.value);
                      }
                      setSelectedValues(Array.from(nextSelectedValues));
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "text-primary-foreground bg-primary"
                          : "[&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    <span className="sr-only">
                      {isSelected ? " selected" : " not selected"}
                    </span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </AdminCommandItem>
                );
              })}
            </AdminCommandGroup>
            {selectedValueSet.size > 0 && (
              <>
                <AdminCommandSeparator />
                <AdminCommandGroup>
                  <AdminCommandItem
                    onSelect={() => setSelectedValues([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </AdminCommandItem>
                </AdminCommandGroup>
              </>
            )}
          </AdminCommandList>
        </AdminCommand>
      </PopoverContent>
    </PopoverRoot>
  );
}
