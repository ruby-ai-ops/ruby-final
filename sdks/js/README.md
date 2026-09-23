<div align="center">
    <h1>Ruby SDK for JavaScript</h1>
    <p>
        <b>A simple and easy to use client for the <a href="https://docs.ruby.ad/reference/developer-platform-overview">Ruby API</a></b>
    </p>
    <br>
</div>

![Build status](https://github.com/ruby-ai-ops/ruby-final/actions/workflows/deploy-front.yml/badge.svg)
[![npm version](https://badge.fury.io/js/%40ruby%2Fclient.svg)](https://www.npmjs.com/package/@ruby-ai/client)

Source code available [here](https://github.com/ruby-ai-ops/ruby-final/tree/main/sdks/js).

## Installation

```js
npm install @ruby-ai/client
```

## Usage

> Use Ruby's [Ruby Development Platform](https://docs.ruby.ad/reference/developer-platform-overview) to start learning about Ruby API.

Import and initialize a client using an **workspace api key** or an OAuth **access token** (for now, requires talking to us).

Note: we use the Result pattern to handle errors ([see more](https://velocidadescape.com/js/result-pattern-try-catch/)).

### Setup

```js
import { RubyAPI } from "@ruby-ai/client";

const rubyAPI = new RubyAPI(
  {
    url: "https://ruby.ad",
  },
  {
    workspaceId: "YOUR_WORKSPACE_ID",
    apiKey: "YOUR_API_KEY_OR_ACCESS_TOKEN",
  },
  console
);
```

### Get all agents

```js
const r = await rubyApi.getAgentConfigurations();

if (r.isErr()) {
  throw new Error(`API Error: ${r.error.message}`);
} else {
  const agents = r.value.filter((agent) => agent.status === "active");
}
```

### Create a conversation

```js
const context = {
  timezone: "UTC",
  username: user.firstName,
  email: user.email,
  fullName: user.fullName,
  profilePictureUrl: user.image,
  origin: "api", // Contact us to add more
};

const question = "Hello! What can you do for me ?";

const r = await rubyApi.createConversation({
  title: null,
  visibility: "unlisted",
  message: {
    content: question,
    mentions: [
      {
        configurationId: agent.sId,
      },
    ],
    context,
  },
});

if (r.isErr()) {
  throw new Error(r.error.message);
} else {
  const { conversation, message } = r.value;

  try {
    const r = await rubyApi.streamAgentAnswerEvents({
      conversation,
      userMessageId: message.sId,
      signal,
    });
    if (r.isErr()) {
      throw new Error(r.error.message);
    } else {
      const { eventStream } = r.value;

      let answer = "";
      let action: AgentActionPublicType | undefined = undefined;
      let chainOfThought = "";

      for await (const event of eventStream) {
        if (!event) {
          continue;
        }
        switch (event.type) {
          case "user_message_error": {
            console.error(
              `User message error: code: ${event.error.code} message: ${event.error.message}`
            );
            return;
          }
          case "agent_error": {
            console.error(
              `Agent message error: code: ${event.error.code} message: ${event.error.message}`
            );
            return;
          }
          case "agent_action_success": {
            action = event.action;
            break;
          }

          case "generation_tokens": {
            if (event.classification === "tokens") {
              answer = (answer + event.text).trim();
            } else if (event.classification === "chain_of_thought") {
              chainOfThought += event.text;
            }
            break;
          }
          case "agent_message_success": {
            answer = event.message.content ?? "";
            break;
          }
          default:
          // Nothing to do on unsupported events
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("AbortError")) {
      // Stream aborted
    } else {
      // Other error
    }
  }
}
```
