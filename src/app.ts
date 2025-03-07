import { FastifyInstance } from 'fastify';
import { routes } from './routes';

export default async function app(fastify: FastifyInstance) {
  fastify.register(routes);
}