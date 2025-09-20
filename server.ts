
import { app } from "@/app";
import { writeFile } from "node:fs/promises";
import path, { resolve } from "node:path";
import { env } from "env";

const dirname = path.resolve("./");

const serverLogger = app.logger('server');
app.listen({ port: env.PORT }, (err, port) => {
  if (err) {
    serverLogger.error(`${err}`);
    throw err;
  }

  const spec = app.swagger();
  console.log(`🚀 Server running on port: ${port}. ✅`);

  writeFile(
    resolve(dirname, "swagger.json"),
    JSON.stringify(spec, null, 2),
    "utf-8",
  );
});

