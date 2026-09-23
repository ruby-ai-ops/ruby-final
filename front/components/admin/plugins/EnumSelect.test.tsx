import { EnumSelect } from "@app/components/admin/plugins/EnumSelect";
import {
  AdminForm,
  AdminFormField,
  AdminFormItem,
} from "@app/components/admin/shadcn/ui/form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
);
Element.prototype.scrollIntoView = vi.fn();

const OPTIONS = [
  {
    label: "[On demand] workspace_default_agent",
    value: "workspace_default_agent",
  },
  {
    label: "[Ruby only] noop_model_feature",
    value: "noop_model_feature",
  },
] as const;

function TestEnumSelect() {
  const form = useForm({
    defaultValues: { features: [] as string[] },
  });

  return (
    <AdminForm {...form}>
      <AdminFormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <AdminFormItem>
            <EnumSelect
              label="Feature Flags"
              multiple
              onValuesChange={field.onChange}
              options={OPTIONS}
              values={field.value}
            />
          </AdminFormItem>
        )}
      />
    </AdminForm>
  );
}

describe("EnumSelect", () => {
  it("filters feature flags using space-separated terms", async () => {
    const user = userEvent.setup();
    render(<TestEnumSelect />);

    await user.click(screen.getByRole("combobox"));
    await user.type(
      screen.getByPlaceholderText("Feature Flags"),
      "workspace default"
    );

    expect(
      screen.getByText("[On demand] workspace_default_agent")
    ).toBeVisible();
    expect(
      screen.queryByText("[Ruby only] noop_model_feature")
    ).not.toBeInTheDocument();
  });
});
