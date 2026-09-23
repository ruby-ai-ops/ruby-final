import { AdminButton } from "@app/components/admin/shadcn/ui/button";
import {
  AdminCommand,
  AdminCommandEmpty,
  AdminCommandGroup,
  AdminCommandInput,
  AdminCommandItem,
  AdminCommandList,
} from "@app/components/admin/shadcn/ui/command";
import { AdminFormControl } from "@app/components/admin/shadcn/ui/form";
import { useDebounce } from "@app/hooks/useDebounce";
import type { AdminSearchWorkspaceMember } from "@app/lib/api/admin/memberships";
import { useAdminWorkspaceMembersSearch } from "@app/admin-app/swr/memberships";
import type { EnumValue } from "@app/types/admin/plugins";
import {
  ChevronDown,
  cn,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  Spinner,
} from "@ruby-ai/ui";
import { Check } from "lucide-react";
import React from "react";

function formatMemberLabel(member: AdminSearchWorkspaceMember) {
  return member.fullName
    ? `${member.fullName} (${member.email})`
    : `${member.email} (${member.sId})`;
}

interface ServerSideSearchEnumSelectProps {
  label?: string;
  // When true, allows selecting several values; the popover stays open on
  // select and previously selected values are toggled on/off.
  allowMultiple?: boolean;
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  staticOptions?: readonly EnumValue[];
  values?: string[];
  workspaceId: string;
}

export function ServerSideSearchEnumSelect({
  label,
  allowMultiple = false,
  onValuesChange,
  placeholder = "Select value",
  staticOptions = [],
  values,
  workspaceId,
}: ServerSideSearchEnumSelectProps) {
  const [open, setOpen] = React.useState(false);
  const {
    debouncedValue: debouncedSearchQuery,
    inputValue: searchQuery,
    setValue: setSearchQuery,
  } = useDebounce("");
  // Cache of value -> label so selected entries keep their label even once they
  // scroll out of the current search results.
  const [labelCache, setLabelCache] = React.useState<Record<string, string>>(
    {}
  );

  const {
    members: searchResults,
    isLoading,
    isError,
  } = useAdminWorkspaceMembersSearch({
    owner: { sId: workspaceId },
    query: debouncedSearchQuery,
    disabled: !open,
  });

  const selectedValues = React.useMemo(() => values ?? [], [values]);
  const selectedValuesSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues]
  );

  const staticOptionByValue = React.useMemo(
    () => new Map(staticOptions.map((option) => [option.value, option])),
    [staticOptions]
  );

  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open, setSearchQuery]);

  React.useEffect(() => {
    setLabelCache((prev) => {
      const next = { ...prev };
      for (const option of staticOptions) {
        next[option.value] = option.label;
      }
      for (const member of searchResults) {
        next[member.sId] = formatMemberLabel(member);
      }
      return next;
    });
  }, [searchResults, staticOptions]);

  const labelForValue = React.useCallback(
    (value: string) =>
      labelCache[value] ?? staticOptionByValue.get(value)?.label ?? value,
    [labelCache, staticOptionByValue]
  );

  const handleSelect = React.useCallback(
    (value: string) => {
      if (allowMultiple) {
        const next = selectedValuesSet.has(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value];
        onValuesChange(next);
        return;
      }

      onValuesChange([value]);
      setOpen(false);
    },
    [allowMultiple, onValuesChange, selectedValues, selectedValuesSet]
  );

  const title =
    selectedValues.length === 0
      ? placeholder
      : selectedValues.map(labelForValue).join(", ");

  return (
    <PopoverRoot modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AdminFormControl>
          <AdminButton
            variant="outline"
            role="combobox"
            className={cn(
              "w-auto justify-between border-border-dark bg-background " + "",
              selectedValues.length === 0 && "text-muted-foreground"
            )}
          >
            {title}
            <ChevronDown className="opacity-50" />
          </AdminButton>
        </AdminFormControl>
      </PopoverTrigger>
      <PopoverContent
        className="z-[100] w-[var(--radix-popover-trigger-width)] min-w-[320px]"
        mountPortal={false}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onWheelCapture={(e) => {
          e.stopPropagation();
        }}
        onTouchMoveCapture={(e) => {
          e.stopPropagation();
        }}
      >
        <AdminCommand className="gap-2 py-3" shouldFilter={false}>
          <AdminCommandInput
            placeholder={label ?? "Search by name or email"}
            className="h-9 p-2"
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <AdminCommandList>
            {isLoading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Spinner size="xs" />
                Searching members…
              </div>
            ) : isError ? (
              <div className="px-2 py-3 text-sm text-warning-500">
                Failed to search workspace members.
              </div>
            ) : (
              <>
                <AdminCommandEmpty>No members found.</AdminCommandEmpty>
                <AdminCommandGroup>
                  {staticOptions.map((option) => {
                    const isSelected = selectedValuesSet.has(option.value);
                    return (
                      <AdminCommandItem
                        value={option.label}
                        key={`static-${option.value}`}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span
                          className={cn(
                            isSelected && "font-medium",
                            "text-primary-900"
                          )}
                        >
                          {option.label}
                        </span>
                      </AdminCommandItem>
                    );
                  })}
                  {searchResults
                    .filter((member) => !staticOptionByValue.has(member.sId))
                    .map((member) => {
                      const memberLabel = formatMemberLabel(member);
                      const isSelected = selectedValuesSet.has(member.sId);

                      return (
                        <AdminCommandItem
                          value={memberLabel}
                          key={member.sId}
                          onSelect={() => handleSelect(member.sId)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span
                            className={cn(
                              isSelected && "font-medium",
                              "text-primary-900"
                            )}
                          >
                            {memberLabel}
                          </span>
                        </AdminCommandItem>
                      );
                    })}
                </AdminCommandGroup>
              </>
            )}
          </AdminCommandList>
        </AdminCommand>
      </PopoverContent>
    </PopoverRoot>
  );
}
