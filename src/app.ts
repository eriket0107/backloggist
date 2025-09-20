
import Fastify from "fastify";
import { registerAllPlugins } from "./plugins";
// import { routes } from "./routes";

export const app = Fastify({
  logger: {
    level: "info",
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: { colorize: true },
        },
        {
          target: "pino/file",
        },
      ],
    },
  },
});

registerAllPlugins(app);

app.ready(() => {
  console.info("🚀 Application started successfully");
});

