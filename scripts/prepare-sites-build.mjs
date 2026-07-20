import { cp, mkdir, rename } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await cp("worker-entry.js", "dist/server/index.js");
