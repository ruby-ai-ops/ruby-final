import { getRegisteredImages } from "@app/lib/api/sandbox/image";
import type { SandboxKillImagesResponseBody } from "@app/types/api/sandbox/image";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/sandbox_kill/images.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<SandboxKillImagesResponseBody> => {
  const images = getRegisteredImages()
    .map((image) => image.imageId)
    .filter((id): id is { imageName: string; tag: string } => id !== undefined)
    .map(({ imageName, tag }) => ({ baseImage: imageName, version: tag }));

  return ctx.json({ images });
});

export default app;
