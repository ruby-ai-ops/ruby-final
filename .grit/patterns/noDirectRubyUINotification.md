---
tags: [lint, imports]
level: error
---

# No direct ui notification import

Discourages direct import of `useSendNotification` from `@ruby-ai/ui`.
Use `@app/hooks/useNotification` instead.

```grit
language js

direct_ui_notification() => `DIRECT_RUBY_UI_NOTIFICATION_FORBIDDEN`
```

## Should flag direct ui notification import

```typescript
import { useSendNotification } from "@ruby-ai/ui";
```

```typescript
DIRECT_RUBY_UI_NOTIFICATION_FORBIDDEN
```

## Should not flag app hooks import

```typescript
import { useSendNotification } from "@app/hooks/useNotification";
```

## Should not flag other ui imports

```typescript
import { Button } from "@ruby-ai/ui";
```
