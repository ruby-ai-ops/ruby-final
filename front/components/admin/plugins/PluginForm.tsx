import { EnumSelect } from "@app/components/admin/plugins/EnumSelect";
import { ServerSideSearchEnumSelect } from "@app/components/admin/plugins/ServerSideSearchEnumSelect";
import {
  AdminForm,
  AdminFormControl,
  AdminFormDescription,
  AdminFormField,
  AdminFormInput,
  AdminFormItem,
  AdminFormLabel,
  AdminFormMessage,
  AdminFormTextArea,
  AdminFormUpload,
} from "@app/components/admin/shadcn/ui/form";
import type { AdminGetPluginDetailsResponseBody } from "@app/types/api/admin/plugins/manifest";
import type {
  AsyncEnumValues,
  EnumValues,
  PluginResourceTarget,
} from "@app/types/admin/plugins";
import { createZodSchemaFromArgs } from "@app/types/admin/plugins";
import { Button, Checkbox, SliderToggle } from "@ruby-ai/ui";
import { zodResolver } from "@hookform/resolvers/zod";
// biome-ignore lint/correctness/noUnusedImports: ignored using `--suppress`
import React, { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

type FallbackArgs = Record<string, unknown>;

type FormValues<T> = T extends z.ZodTypeAny ? z.infer<T> : FallbackArgs;

interface PluginFormProps {
  asyncArgs?: Partial<
    Record<string, string | number | boolean | AsyncEnumValues | EnumValues>
  > | null;
  disabled?: boolean;
  // Values to seed the form with, overriding the manifest defaults. Only keys declared by the
  // manifest are applied.
  initialValues?: Record<string, unknown>;
  isRunning?: boolean;
  manifest: AdminGetPluginDetailsResponseBody["manifest"];
  onSubmit: (args: FormValues<any>) => Promise<void>;
  pluginResourceTarget: PluginResourceTarget;
}

export function PluginForm({
  asyncArgs,
  disabled,
  initialValues,
  isRunning = false,
  manifest,
  onSubmit,
  pluginResourceTarget,
}: PluginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const argsSchema = useMemo(() => {
    if (!manifest) {
      return null;
    }

    // Create schema from original manifest - async values are handled in rendering
    return createZodSchemaFromArgs(manifest.args);
  }, [manifest]);

  const defaultValues = useMemo(() => {
    if (!manifest) {
      return {};
    }
    const manifestDefaults = Object.fromEntries(
      Object.entries(manifest.args).map(([key, arg]) => {
        switch (arg.type) {
          case "text":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as string)
                : "",
            ];
          case "string":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as string)
                : "",
            ];
          case "number":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as number)
                : (arg.default ?? 0),
            ];
          case "boolean":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as boolean)
                : (arg.default ?? false),
            ];
          case "enum":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as AsyncEnumValues)
                    .filter((v) => v.checked)
                    .map((v) => v.value)
                : arg.values.filter((v) => v.checked).map((v) => v.value),
            ];
          case "date":
            return [
              key,
              arg.async && asyncArgs?.[key] !== undefined
                ? (asyncArgs[key] as string)
                : "",
            ];
          default:
            return [key, null];
        }
      })
    );

    if (!initialValues) {
      return manifestDefaults;
    }

    return {
      ...manifestDefaults,
      ...Object.fromEntries(
        Object.entries(initialValues).filter(([key]) => key in manifest.args)
      ),
    };
  }, [manifest, asyncArgs, initialValues]);

  const form = useForm({
    resolver: argsSchema ? zodResolver(argsSchema) : undefined,
    defaultValues,
  });

  const dependencyFields = useMemo(() => {
    if (!manifest) {
      return [];
    }
    return [
      ...new Set(
        Object.values(manifest.args)
          .filter((arg) => arg.dependsOn)
          .flatMap((arg) =>
            Array.isArray(arg.dependsOn)
              ? arg.dependsOn.map((c) => c.field)
              : [arg.dependsOn!.field]
          )
      ),
    ];
  }, [manifest]);

  const watchedValuesArray = useWatch({
    control: form.control,
    name: dependencyFields,
  });

  const watchedValues: Record<string, unknown> = {};
  dependencyFields.forEach((field, index) => {
    watchedValues[field] = watchedValuesArray[index];
  });

  async function handleSubmit(values: FormValues<typeof argsSchema>) {
    if (isSubmitting || isRunning || disabled) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!manifest) {
    return null;
  }

  const workspaceId =
    "workspace" in pluginResourceTarget
      ? pluginResourceTarget.workspace.sId
      : null;

  return (
    <AdminForm {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-[600px] space-y-8"
      >
        <div className="max-h-[50vh] space-y-8 overflow-y-auto pr-2">
          {Object.entries(manifest.args).map(([key, arg]) => {
            const conditions = arg.dependsOn
              ? Array.isArray(arg.dependsOn)
                ? arg.dependsOn
                : [arg.dependsOn]
              : [];
            const isDependentFieldHidden = conditions.some((c) => {
              const watched = watchedValues[c.field];
              // Enum fields surface their selection as an array of values, so
              // match by membership; everything else compares by value.
              if (Array.isArray(watched)) {
                return !watched.includes(c.value);
              }
              return watched !== c.value;
            });

            if (isDependentFieldHidden) {
              return null;
            }

            let defaultValue = undefined;
            let options = undefined;

            if (arg.type === "enum") {
              options =
                arg.async && asyncArgs?.[key]
                  ? (asyncArgs[key] as AsyncEnumValues)
                  : arg.values;
              defaultValue = options
                .filter((v) => v.checked)
                .map((v) => v.value);
            }
            const fieldDescription =
              arg.asyncDescription &&
              asyncArgs?.[`${key}_description`] !== undefined
                ? String(asyncArgs[`${key}_description`])
                : arg.description;

            return (
              <AdminFormField
                key={key}
                control={form.control}
                name={key}
                disabled={disabled}
                defaultValue={defaultValue}
                render={({ field }) => (
                  <AdminFormItem>
                    <div
                      className={
                        arg.type === "boolean"
                          ? "flex flex-row items-center gap-x-2"
                          : "flex flex-col gap-y-2"
                      }
                    >
                      <AdminFormLabel>{arg.label}</AdminFormLabel>
                      <AdminFormControl>
                        <>
                          {arg.type === "text" && (
                            <AdminFormTextArea {...field} />
                          )}
                          {arg.type === "string" && (
                            <AdminFormInput {...field} />
                          )}
                          {arg.type === "number" && (
                            <AdminFormInput
                              type={arg.variant === "text" ? "text" : "number"}
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const raw = e.target.value;
                                // Let the field go empty while editing instead of
                                // snapping back to 0, which made it impossible to
                                // clear the value and type a new one.
                                if (raw === "") {
                                  field.onChange(undefined);
                                  return;
                                }
                                const parsed = Number(raw);
                                if (isFinite(parsed)) {
                                  field.onChange(parsed);
                                }
                              }}
                            />
                          )}
                          {arg.type === "boolean" &&
                            arg.variant === "toggle" && (
                              <SliderToggle
                                selected={field.value}
                                onClick={() => field.onChange(!field.value)}
                                disabled={field.disabled}
                              />
                            )}
                          {arg.type === "boolean" &&
                            (arg.variant === "checkbox" ||
                              arg.variant === undefined) && (
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          {arg.type === "enum" &&
                            arg.serverSideSearch &&
                            workspaceId && (
                              <ServerSideSearchEnumSelect
                                label={arg.label}
                                allowMultiple={arg.multiple}
                                onValuesChange={(values) =>
                                  field.onChange(values)
                                }
                                placeholder="Search by name or email"
                                staticOptions={options ?? arg.values}
                                values={field.value}
                                workspaceId={workspaceId}
                              />
                            )}
                          {arg.type === "enum" &&
                            !(arg.serverSideSearch && workspaceId) && (
                              <EnumSelect
                                label={arg.label}
                                onValuesChange={(values) =>
                                  field.onChange(values)
                                }
                                options={options ?? []}
                                placeholder="Select value"
                                values={field.value}
                                multiple={arg.multiple}
                              />
                            )}
                          {arg.type === "file" && (
                            <AdminFormUpload type="file" {...field} />
                          )}
                          {arg.type === "date" && (
                            <AdminFormInput type="date" {...field} />
                          )}
                        </>
                      </AdminFormControl>
                    </div>
                    {fieldDescription && (
                      <AdminFormDescription>
                        {fieldDescription}
                      </AdminFormDescription>
                    )}
                    <AdminFormMessage />
                  </AdminFormItem>
                )}
              />
            );
          })}
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={disabled || isRunning || isSubmitting}
          label={isRunning || isSubmitting ? "Running..." : "Run"}
        />
      </form>
    </AdminForm>
  );
}
