import type { ActionSpecification } from "@app/components/agent_builder/types";
import { ShapesPlus } from "@ruby-ai/ui";

export const MCP_SPECIFICATION: ActionSpecification = {
  label: "More...",
  description: "Add additional sets of tools",
  cardIcon: ShapesPlus,
  dropDownIcon: ShapesPlus,
  flag: null,
};
