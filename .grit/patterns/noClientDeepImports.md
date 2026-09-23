---
tags: [lint, imports]
level: error
---

# No deep imports from @ruby-ai/client

Forbids deep imports from `@ruby-ai/client/*` subpaths in `front/` code.
Only the package root `@ruby-ai/client` should be imported.

```grit
language js

client_deep_import() => `"CLIENT_DEEP_IMPORT_FORBIDDEN"`
```

## Should flag import from client/src

```typescript
// @filename: app/front/lib/utils.ts
import { Foo } from "@ruby-ai/client/src";
```

```typescript
// @filename: app/front/lib/utils.ts
import { Foo } from "CLIENT_DEEP_IMPORT_FORBIDDEN";
```

## Should flag import from client/src/toto.ts

```typescript
// @filename: app/front/lib/utils.ts
import { Bar } from "@ruby-ai/client/src/toto";
```

```typescript
// @filename: app/front/lib/utils.ts
import { Bar } from "CLIENT_DEEP_IMPORT_FORBIDDEN";
```

## Should not flag import from client root

```typescript
// @filename: app/front/lib/utils.ts
import { Foo } from "@ruby-ai/client";
```

## Should not flag deep import outside front

```typescript
// @filename: app/connectors/lib/utils.ts
import { Foo } from "@ruby-ai/client/src";
```
