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
import type { AsyncEnumValues, EnumValues } from "@app/types/admin/plugins";
import {
  ChevronDown,
  cn,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@ruby-ai/ui";
import { CheckCircle, Circle } from "lucide-react";
import React from "react";

interface EnumSelectProps {
  label?: string;
  onValuesChange: (values: string[]) => void;
  options: AsyncEnumValues | EnumValues;
  placeholder?: string;
  values?: string[];
  multiple: boolean;
}

export function EnumSelect({
  label,
  onValuesChange,
  options,
  placeholder = "Select value",
  values,
  multiple,
}: EnumSelectProps) {
  const [open, setOpen] = React.useState(false);

  const optionLabelByValue = React.useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options]
  );

  let title = values?.length
    ? values
        .map((value) => optionLabelByValue.get(value) ?? value)
        .sort()
        .join(", ")
    : placeholder;

  if (title.length > 80) {
    title = `${values?.length} items selected`;
  }

  return (
    <PopoverRoot modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AdminFormControl>
          <AdminButton
            variant="outline"
            role="combobox"
            className={cn(
              "w-auto justify-between border-border-dark bg-background " + "",
              !values?.length && "text-muted-foreground"
            )}
          >
            {title}
            <ChevronDown className="opacity-50" />
          </AdminButton>
        </AdminFormControl>
      </PopoverTrigger>
      <PopoverContent
        className="z-[100] w-[var(--radix-popover-trigger-width)]"
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
        <AdminCommand className="gap-2 py-3">
          <AdminCommandInput
            placeholder={label}
            className="h-9 p-2"
            onKeyDown={(e) => e.stopPropagation()}
          />
          <AdminCommandList>
            <AdminCommandEmpty>No values found.</AdminCommandEmpty>
            <AdminCommandGroup>
              {options.map((option) => {
                const isSelected = values?.includes(option.value);
                return (
                  <AdminCommandItem
                    value={option.label}
                    keywords={[option.value.replaceAll("_", " ")]}
                    key={option.value}
                    disabled={option.disabled}
                    onSelect={() => {
                      onValuesChange([option.value]);
                      if (!multiple) {
                        setOpen(false);
                      } else {
                        if (isSelected) {
                          onValuesChange(
                            values?.filter((value) => value !== option.value) ??
                              []
                          );
                        } else {
                          onValuesChange([...(values ?? []), option.value]);
                        }
                      }
                    }}
                  >
                    <div className="flex w-full items-center gap-2">
                      {multiple ? (
                        isSelected ? (
                          <CheckCircle className="h-4 w-4 text-success-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-primary-400" />
                        )
                      ) : null}
                      <span
                        className={cn(
                          option.checked && "font-medium",
                          "text-primary-900"
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                  </AdminCommandItem>
                );
              })}
            </AdminCommandGroup>
          </AdminCommandList>
        </AdminCommand>
      </PopoverContent>
    </PopoverRoot>
  );
}
