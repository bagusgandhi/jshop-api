import { FastifyInstance } from "fastify";
import { productRoutes } from "./productRoutes";
import { adjusmentTransactionRoutes } from "./adjusmentTransactionRoutes";

export const routes = async (fastify: FastifyInstance) => {
  fastify.register(productRoutes, { 
    prefix: "/api/products" 
  });
  fastify.register(adjusmentTransactionRoutes, { 
    prefix: "/api/adjustment-transactions" 
  });
};
