import fastify from "fastify";
import app from "./app";
import { config } from "./config";
import swagger from "@fastify/swagger";
import swaggerUI from '@fastify/swagger-ui';

const server = fastify({
  logger: true,
});

server.register(swagger, {
  swagger: {
    info: {
      title: 'JSHOP API',
      description: 'API documentation for managing products & stock',
      version: '1.0.0',
    },
    host:  `localhost:${config.PORT}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

server.register(swaggerUI, {
  routePrefix: '/docs',
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
