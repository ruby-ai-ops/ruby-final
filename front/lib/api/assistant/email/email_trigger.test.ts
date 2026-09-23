import type { AgentLoopBlockedToolExecution } from "@app/lib/actions/mcp";
import type { InboundEmail } from "@app/lib/api/assistant/email/email_trigger";
import {
  ASSISTANT_EMAIL_SUBDOMAIN,
  buildEmailUserMessage,
  buildReplyThreadingHeaders,
  getThreadingLookupMessageIds,
  parseEmailReplyContext,
  sendToolValidationEmail,
  splitThreadContent,
} from "@app/lib/api/assistant/email/email_trigger";
import { sendEmail } from "@app/lib/api/email";
import type { LightAgentConfigurationType } from "@app/types/assistant/agent";
import type { LightWorkspaceType } from "@app/types/user";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetAppUrl,
  mockGetCurrentCell,
  mockGetEmailValidationSecret,
  mockSendEmail,
  mockSendEmailToRecipients,
} = vi.hoisted(() => ({
  mockGetAppUrl: vi.fn(),
  mockGetCurrentCell: vi.fn(),
  mockGetEmailValidationSecret: vi.fn(),
  mockSendEmail: vi.fn(),
  mockSendEmailToRecipients: vi.fn(),
}));

vi.mock("@app/lib/api/config", () => ({
  default: {
    getAppUrl: mockGetAppUrl,
    getEmailValidationSecret: mockGetEmailValidationSecret,
  },
}));

vi.mock("@app/lib/api/email", () => ({
  sendEmail: mockSendEmail,
  sendEmailToRecipients: mockSendEmailToRecipients,
}));

vi.mock("@app/lib/api/cells/config", () => ({
  config: {
    getCurrentCell: mockGetCurrentCell,
  },
}));

const TEST_EMAIL_AUTH = { SPF: "pass", dkim: [], dkimRaw: "" };

beforeEach(() => {
  vi.clearAllMocks();

  mockGetAppUrl.mockReturnValue("https://ruby.ad");
  mockGetCurrentCell.mockReturnValue({
    name: "cell-00001",
    region: "europe-west1",
    url: "https://app.ruby.ad",
  });
  mockGetEmailValidationSecret.mockReturnValue("test-email-validation-secret");
  mockSendEmail.mockResolvedValue(undefined);
});

describe("buildEmailUserMessage", () => {
  it("keeps thread context but replies only to the sender", () => {
    const message = buildEmailUserMessage({
      email: {
        subject: "Test",
        text: "Hello",
        auth: TEST_EMAIL_AUTH,
        threadingHeaders: {
          messageId: null,
          inReplyTo: null,
          references: null,
        },
        sender: {
          email: "sender@ruby.ad",
          full: "Sender <sender@ruby.ad>",
        },
        envelope: {
          from: "bounce@mailer.ruby.ad",
          to: [`agent@${ASSISTANT_EMAIL_SUBDOMAIN}`, "teammate@ruby.ad"],
          cc: [`other-agent@${ASSISTANT_EMAIL_SUBDOMAIN}`, "observer@ruby.ad"],
          bcc: ["hidden@ruby.ad"],
        },
        attachments: [],
      },
      userMessage: "Can you summarize this thread?",
      hasThreadHistory: false,
      attachmentCount: 0,
    });

    expect(message).toContain(
      `<email_to>agent@${ASSISTANT_EMAIL_SUBDOMAIN}, teammate@ruby.ad</email_to>`
    );
    expect(message).toContain(
      `<email_cc>other-agent@${ASSISTANT_EMAIL_SUBDOMAIN}, observer@ruby.ad</email_cc>`
    );
    expect(message).toContain(
      `<ruby_agent_recipients>agent@${ASSISTANT_EMAIL_SUBDOMAIN}, other-agent@${ASSISTANT_EMAIL_SUBDOMAIN}</ruby_agent_recipients>`
    );
    expect(message).toContain(
      "<email_response_to>sender@ruby.ad</email_response_to>"
    );
    expect(message).not.toContain("<email_response_cc>");
    expect(message).toContain("only to me, the sender above.");
  });
});

describe("parseEmailReplyContext", () => {
  it("accepts legacy Redis payloads that still contain reply-all fields", () => {
    const parsed = parseEmailReplyContext(
      JSON.stringify({
        subject: "Test",
        originalText: "Hello",
        fromEmail: "sender@ruby.ad",
        fromFull: "Sender <sender@ruby.ad>",
        replyTo: ["sender@ruby.ad", "observer@ruby.ad"],
        replyCc: ["security@ruby.ad"],
        threadingMessageId: "<incoming-message-id@ruby.ad>",
        threadingInReplyTo: null,
        threadingReferences: null,
        agentConfigurationId: "agent-config-1",
        workspaceId: "workspace-1",
        conversationId: "conversation-1",
      }),
      "agent-message-1",
      "email-reply-context:workspace-1:agent-message-1"
    );

    expect(parsed).toMatchObject({
      fromEmail: "sender@ruby.ad",
      agentConfigurationId: "agent-config-1",
      workspaceId: "workspace-1",
      conversationId: "conversation-1",
    });
    expect(parsed).not.toHaveProperty("replyTo");
    expect(parsed).not.toHaveProperty("replyCc");
  });
});

describe("buildReplyThreadingHeaders", () => {
  it("uses the inbound message-id for in-reply-to and references", () => {
    const threadingHeaders = buildReplyThreadingHeaders({
      subject: "Test",
      text: "Hello",
      auth: TEST_EMAIL_AUTH,
      threadingHeaders: {
        messageId: "<incoming-message-id@ruby.ad>",
        inReplyTo: null,
        references: null,
      },
      sender: {
        email: "sender@ruby.ad",
        full: "Sender <sender@ruby.ad>",
      },
      envelope: {
        from: "bounce@mailer.ruby.ad",
        to: [],
        cc: [],
        bcc: [],
      },
      attachments: [],
    });

    expect(threadingHeaders).toEqual({
      inReplyTo: "<incoming-message-id@ruby.ad>",
      references: "<incoming-message-id@ruby.ad>",
    });
  });

  it("appends in-reply-to to references when missing", () => {
    const threadingHeaders = buildReplyThreadingHeaders({
      subject: "Test",
      text: "Hello",
      auth: TEST_EMAIL_AUTH,
      threadingHeaders: {
        messageId: "<incoming-message-id@ruby.ad>",
        inReplyTo: null,
        references: "<older-message-id@ruby.ad>",
      },
      sender: {
        email: "sender@ruby.ad",
        full: "Sender <sender@ruby.ad>",
      },
      envelope: {
        from: "bounce@mailer.ruby.ad",
        to: [],
        cc: [],
        bcc: [],
      },
      attachments: [],
    });

    expect(threadingHeaders).toEqual({
      inReplyTo: "<incoming-message-id@ruby.ad>",
      references: "<older-message-id@ruby.ad> <incoming-message-id@ruby.ad>",
    });
  });

  it("does not duplicate in-reply-to in references", () => {
    const threadingHeaders = buildReplyThreadingHeaders({
      subject: "Test",
      text: "Hello",
      auth: TEST_EMAIL_AUTH,
      threadingHeaders: {
        messageId: "<incoming-message-id@ruby.ad>",
        inReplyTo: null,
        references: "<older-message-id@ruby.ad> <incoming-message-id@ruby.ad>",
      },
      sender: {
        email: "sender@ruby.ad",
        full: "Sender <sender@ruby.ad>",
      },
      envelope: {
        from: "bounce@mailer.ruby.ad",
        to: [],
        cc: [],
        bcc: [],
      },
      attachments: [],
    });

    expect(threadingHeaders).toEqual({
      inReplyTo: "<incoming-message-id@ruby.ad>",
      references: "<older-message-id@ruby.ad> <incoming-message-id@ruby.ad>",
    });
  });
});

describe("splitThreadContent", () => {
  it("splits the fresh reply from the quoted thread", async () => {
    const { userMessage, restOfThread } = await splitThreadContent(
      "Can you go deeper on point 2?\n" +
        "\n" +
        "On Mon, Jun 8, 2026 at 10:12 AM agent (Ruby agent)\n" +
        "<agent@ruby.team> wrote:\n" +
        "> Here is my answer.\n"
    );

    expect(userMessage).toBe("Can you go deeper on point 2?");
    expect(restOfThread).toContain("Here is my answer.");
  });
});

describe("getThreadingLookupMessageIds", () => {
  it("orders message-ids most recent first: in-reply-to, then references reversed", () => {
    const messageIds = getThreadingLookupMessageIds({
      messageId: "<reply@mail.gmail.com>",
      inReplyTo: "<agent-reply@sendgrid.net>",
      references: "<original@mail.gmail.com> <agent-reply@sendgrid.net>",
    });

    expect(messageIds).toEqual([
      "agent-reply@sendgrid.net",
      "original@mail.gmail.com",
    ]);
  });

  it("normalizes brackets and whitespace and deduplicates", () => {
    const messageIds = getThreadingLookupMessageIds({
      messageId: null,
      inReplyTo: " <a@x.com> ",
      references: "<a@x.com>   b@x.com\n <c@x.com>",
    });

    expect(messageIds).toEqual(["a@x.com", "c@x.com", "b@x.com"]);
  });

  it("caps the number of lookup candidates", () => {
    const references = Array.from(
      { length: 20 },
      (_, i) => `<ref-${i}@x.com>`
    ).join(" ");
    const messageIds = getThreadingLookupMessageIds({
      messageId: null,
      inReplyTo: null,
      references,
    });

    expect(messageIds).toHaveLength(10);
    expect(messageIds[0]).toBe("ref-19@x.com");
  });

  it("returns an empty array when no threading headers are set", () => {
    const messageIds = getThreadingLookupMessageIds({
      messageId: null,
      inReplyTo: null,
      references: null,
    });

    expect(messageIds).toEqual([]);
  });
});

describe("sendToolValidationEmail", () => {
  it("adds cell metadata to approval links", async () => {
    await sendToolValidationEmail({
      email: makeInboundEmail(),
      agentConfiguration: {
        name: "approvals",
      } as LightAgentConfigurationType,
      blockedActions: [makeBlockedAction()],
      conversation: { sId: "conversation-1" },
      workspace: { sId: "workspace-1" } as LightWorkspaceType,
    });

    expect(sendEmail).toHaveBeenCalledOnce();

    const [[recipient, message]] = mockSendEmail.mock.calls;
    expect(recipient).toBe("sender@ruby.ad");
    expect(message).toMatchObject({ html: expect.any(String) });

    const validationUrls = [...message.html.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => href.includes("/email/validation"));

    expect(validationUrls).toHaveLength(2);
    const approvalStates = validationUrls.map((href) => {
      const url = new URL(href);
      expect(url.origin + url.pathname).toBe(
        "https://ruby.ad/email/validation"
      );
      expect(url.searchParams.get("cell")).toBe("cell-00001");
      expect(url.searchParams.has("region")).toBe(false);

      const token = url.searchParams.get("token");
      if (!token) {
        throw new Error("Expected validation token");
      }
      const [payload] = token.split(".");
      return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
        .approvalState;
    });

    expect(approvalStates).toEqual(["approved", "rejected"]);
  });
});

function makeInboundEmail(): InboundEmail {
  return {
    subject: "Approve this tool",
    text: "Please approve the pending tool.",
    auth: TEST_EMAIL_AUTH,
    threadingHeaders: {
      messageId: "<incoming-message-id@ruby.ad>",
      inReplyTo: null,
      references: null,
    },
    sender: {
      email: "sender@ruby.ad",
      full: "Sender <sender@ruby.ad>",
    },
    envelope: {
      from: "bounce@mailer.ruby.ad",
      to: [`approvals@${ASSISTANT_EMAIL_SUBDOMAIN}`],
      cc: [],
      bcc: [],
    },
    attachments: [],
  };
}

function makeBlockedAction(): AgentLoopBlockedToolExecution {
  const blockedAction: AgentLoopBlockedToolExecution = {
    conversationId: "conversation-1",
    messageId: "message-1",
    actionId: "action-1",
    configurationId: "agent-config-1",
    created: Date.now(),
    metadata: {
      toolName: "write_report",
      mcpServerName: "project_tools",
      agentName: "agent",
    },
    inputs: {
      title: "Q2 report",
    },
    status: "blocked_validation_required",
    authorizationInfo: null,
  };

  return blockedAction;
}
