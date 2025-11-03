import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
const token = process.env.UPLOADTHING_TOKEN ?? process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Apply an (optional) custom config:
  config: token
    ? { token }
    : undefined,
});
