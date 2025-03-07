import fastify, { FastifyInstance, RawServerDefault, FastifyPluginOptions } from 'fastify';

const app = fastify({
  logger: true,
});

export default async function name(
  instance: FastifyInstance<RawServerDefault>, 
  opts: FastifyPluginOptions, 
  done: (err?: Error | undefined) => void
) {
  return app;
}