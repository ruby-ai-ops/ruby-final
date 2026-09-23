import {
  getRubyStatusMemoized,
  getProviderStatusMemoized,
} from "@app/lib/api/status";
import { createHono } from "@front-api/lib/hono";

export const appStatusApp = createHono();

appStatusApp.get("/", async (ctx) => {
  const [providersStatus, rubyStatus] = await Promise.all([
    getProviderStatusMemoized(),
    getRubyStatusMemoized(),
  ]);

  ctx.header(
    "Cache-Control",
    "public, max-age=120, stale-while-revalidate=300"
  );
  return ctx.json({ providersStatus, rubyStatus }, 200);
});
