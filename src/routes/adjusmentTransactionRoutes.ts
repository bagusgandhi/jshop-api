import { FastifyInstance } from "fastify";
import {
  getAdjusmentTx,
  getAdjusmentTxById,
  getAdjusmentTxBySku,
  createAdjusmentTx,
  updateAdjusmentTx,
  deleteAdjusmentTxById
} from "../controllers/adjusmentTransactionController";
import { Product as IProduct } from "../interfaces/Product";

export const adjusmentTransactionRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Adjustment Transaction"],
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1 },
            page: { type: "integer", minimum: 1 }
          }
        }
      },
      handler: getAdjusmentTx
    }
  );
  fastify.get(
    "/sku/:sku",
    {
      schema: {
        tags: ["Adjustment Transaction"],
        params: {
          type: 'object',
          properties: {
            sku: { type: 'string' },
          },
          required: ['sku'],
        }
      },
      handler: getAdjusmentTxBySku
    }
  );
  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Adjustment Transaction"],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        }
      },
      handler: getAdjusmentTxById
    }
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Adjustment Transaction"],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        }
      },
      handler: deleteAdjusmentTxById
    }
  );
  fastify.post("/", {
    schema: {
      tags: ["Adjustment Transaction"],
      body: {
        type: "object",
        properties: {
          sku: { type: "string", minLength: 1 },
          qty: { type: "number" },
        },
      },
    },
    handler: createAdjusmentTx,
  });
  fastify.patch("/:id", {
    schema: {
      tags: ["Adjustment Transaction"],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: {
        type: "object",
        properties: {
          sku: { type: "string", minLength: 1 },
          qty: { type: "number" },
        },
      },
    },
    handler: updateAdjusmentTx,
  });
};
