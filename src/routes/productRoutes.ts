import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', request => {
    return { hello: 'world' };
  });
};