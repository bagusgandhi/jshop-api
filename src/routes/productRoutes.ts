import { FastifyInstance } from "fastify";
import {
  getProducts,
  getProductById,
  getProductBySku,
  createProduct,
  deleteProductById,
  updateProduct,
  loadDummyJson,
} from "../controllers/productController";
import { Product as IProduct } from "../interfaces/Product";

export const productRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1 },
            cursor: { type: "string" },
            search: { type: "string" }
          }
        }
      },
      handler: getProducts
    }
  );
  fastify.get(
    "/sku/:sku",
    {
      schema: {
        tags: ["Products"],
        params: {
          type: 'object',
          properties: {
            sku: { type: 'string' },
          },
          required: ['sku'],
        }
      },
      handler: getProductBySku
    }
  );
  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        }
      },
      handler: getProductById
    }
  );
  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        }
      },
      handler: deleteProductById
    }
  );
  fastify.post("/", {
    schema: {
      tags: ["Products"],
      body: {
        type: "object",
        properties: {
          sku: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          price: { type: "number", minimum: 0 },
          image: { type: "string", format: "uri" },
          description: { type: "string", },
        },
      },
    },
    handler: createProduct,
  });
  fastify.patch("/:id", {
    schema: {
      tags: ["Products"],
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
          title: { type: "string", minLength: 1 },
          price: { type: "number", minimum: 0 },
          image: { type: "string", format: "uri" },
          description: { type: "string" },
        },
      },
    },
    handler: updateProduct,
  });
  fastify.get("/load-dummy",  {
    schema: {
      tags: ["Products"],
    },
    handler: loadDummyJson,
  })
};
