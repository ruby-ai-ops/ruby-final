import { getAdminCacheCatalog } from "@front-api/lib/api/admin/cache_catalog";
import { adminApp } from "@front-api/middlewares/ctx";

const app = adminApp();

/** @ignoreswagger */
app.get("/", (ctx) => {
  return ctx.json({ resources: getAdminCacheCatalog() });
});

export default app;
