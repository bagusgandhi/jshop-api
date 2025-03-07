import fastify from "fastify";
import app from "./app";
import { config } from "./config";

const server = fastify({
  logger: true,
});

server.register(app);

const start = async () => {
  try {
    await server.listen({ port: config.PORT, host: "0.0.0.0" });
    console.info(
      `Server running on http://localhost:${
        parseInt(process.env.PORT as string) || 3000
      }`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
