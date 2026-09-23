import { MCPError } from "@app/lib/actions/mcp_errors";
import type { ToolHandlers } from "@app/lib/actions/mcp_internal_actions/tool_definition";
import type { ADMIN_TOOLS_METADATA } from "@app/lib/api/actions/servers/admin/metadata";
import { LIST_GLOBAL_AGENT_FEEDBACKS_TOOL_NAME } from "@app/lib/api/actions/servers/admin/metadata";
import {
  enforceAdminSecurityGates,
  jsonResponse,
} from "@app/lib/api/actions/servers/admin/tools/utils";
import config from "@app/lib/api/config";
import { listGlobalAgentFeedbacks } from "@app/lib/api/admin/global_agent_feedbacks";
import type { Result } from "@app/types/shared/result";
import { Err, Ok } from "@app/types/shared/result";

type FeedbackHandlers = Pick<
  ToolHandlers<typeof ADMIN_TOOLS_METADATA>,
  typeof LIST_GLOBAL_AGENT_FEEDBACKS_TOOL_NAME
>;

const DEFAULT_LIMIT = 100;

function parseDate(value: string, field: string): Result<Date, MCPError> {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return new Err(
      new MCPError(
        `Invalid ${field}: "${value}" is not a valid ISO 8601 date.`,
        { tracked: false }
      )
    );
  }
  return new Ok(date);
}

export const feedbackHandlers: FeedbackHandlers = {
  [LIST_GLOBAL_AGENT_FEEDBACKS_TOOL_NAME]: async (
    {
      since,
      until,
      agent_id,
      direction,
      include_empty,
      limit,
      next_page_cursor,
    },
    extra
  ) => {
    const gateResult = await enforceAdminSecurityGates(
      extra,
      LIST_GLOBAL_AGENT_FEEDBACKS_TOOL_NAME,
      // No specific target workspace: feedback is aggregated across all of them.
      "(all workspaces)"
    );
    if (gateResult.isErr()) {
      return gateResult;
    }

    let sinceDate: Date | undefined;
    if (since !== undefined) {
      const parsed = parseDate(since, "since");
      if (parsed.isErr()) {
        return parsed;
      }
      sinceDate = parsed.value;
    }

    let untilDate: Date | undefined;
    if (until !== undefined) {
      const parsed = parseDate(until, "until");
      if (parsed.isErr()) {
        return parsed;
      }
      untilDate = parsed.value;
    }

    // The cursor is the id of the last row of the previous page, kept opaque
    // to the agent.
    let lastId: number | undefined;
    if (next_page_cursor !== undefined) {
      lastId = parseInt(next_page_cursor, 10);
      if (isNaN(lastId)) {
        return new Err(
          new MCPError("Invalid next_page_cursor.", { tracked: false })
        );
      }
    }

    const { feedbacks, hasMore, totalCount } = await listGlobalAgentFeedbacks({
      includeEmpty: include_empty ?? false,
      lastId,
      since: sinceDate,
      until: untilDate,
      agentConfigurationId: agent_id,
      thumbDirection: direction,
      limit: limit ?? DEFAULT_LIMIT,
    });

    const adminAppUrl = config.getAdminAppUrl();
    const lastFeedback = feedbacks[feedbacks.length - 1];

    return jsonResponse({
      totalCount,
      feedbacks: feedbacks.map((feedback) => ({
        createdAt: feedback.createdAt,
        agentId: feedback.agentConfigurationId,
        direction: feedback.thumbDirection,
        content: feedback.content,
        workspaceId: feedback.workspaceId,
        workspaceName: feedback.workspaceName,
        conversationId: feedback.conversationId,
        adminLink: feedback.conversationId
          ? `${adminAppUrl}/${feedback.workspaceId}/conversation/${feedback.conversationId}`
          : null,
      })),
      nextPageCursor: hasMore && lastFeedback ? String(lastFeedback.id) : null,
    });
  },
};
