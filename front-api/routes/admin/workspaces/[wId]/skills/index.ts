import { SkillResource } from "@app/lib/resources/skill/skill_resource";
import type { GetAdminSkillsResponseBody } from "@app/types/api/admin/skills";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import sId from "./[sId]";
import suggestions from "./suggestions";

// Mounted at /api/admin/workspaces/:wId/skills.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetAdminSkillsResponseBody> => {
  const auth = ctx.get("auth");

  const skills = await SkillResource.listByWorkspace(auth, {
    status: ["active", "archived", "suggested"],
  });

  return ctx.json({ skills: skills.map((skill) => skill.toJSON(auth)) });
});

// Literal segments before param segments.
app.route("/suggestions", suggestions);
app.route("/:sId", sId);

export default app;
