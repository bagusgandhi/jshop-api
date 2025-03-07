import { FastifyInstance } from "fastify";
import { productRoutes } from "./productRoutes";

export const routes = async (fastify: FastifyInstance) => {
  fastify.register(productRoutes, { prefix: "/api/products" });
};
