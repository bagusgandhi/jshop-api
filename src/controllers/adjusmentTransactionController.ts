import { FastifyReply, FastifyRequest } from "fastify";
import {
  deleteById,
  findAll,
  findById,
  findBySku,
  create,
  updateById,
  count
} from "../models/adjusmentTransaction";
import {
  findBySku as findProductBySku,
} from "../models/product";
import { AdjusmentTransaction as IAdjusmentTransaction } from "../interfaces/AdjusmentTransaction";

export const getAdjusmentTx = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { limit = 10, page = 1 } = request.query as {
      limit?: number;
      page?: number;
    };
    const products = await findAll(limit, page);
    const total = await count();


    return reply.send({ data: products, meta: { limit, page, total: parseInt(total?.count || "0") } });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Something went wrong!" });
  }
};

export const getAdjusmentTxById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const txDetail: IAdjusmentTransaction[] | null = await findById(id);

    if (!txDetail || !txDetail.length) {
      return reply.status(404).send({ message: "Transaction not found" });
    }

    return reply.send({ data: txDetail });
  } catch (err) {
    console.error("Error fetching Transaction:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const getAdjusmentTxBySku = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku } = request.params as { sku: string };

  try {
    const txDetail: IAdjusmentTransaction[] | null = await findBySku(sku);

    if (!txDetail || !txDetail.length) {
      return reply.status(404).send({ message: "Transaction not found" });
    }

    return reply.send({ data: txDetail });
  } catch (err) {
    console.error("Error fetching Transaction:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const deleteAdjusmentTxById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const data: IAdjusmentTransaction[] | null = await findById(id);

    if (!data || !data.length) {
      return reply.status(404).send({ message: "Transaction not found" });
    } else {
      await deleteById(id);
      return reply.send({ message: "Transaction deleted Successfully" });
    }
  } catch (err) {
    console.error("Error fetching Transaction:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const createAdjusmentTx = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku, qty} = request.body as Omit<IAdjusmentTransaction, "id" | "amount">;

  try {
    const product = await findProductBySku(sku)

    if (!product || !product.length) {
      return reply.status(400).send({ message: "Product with this sku not found" });
    } else {
      const result = await create({ sku, qty, product_id: product?.[0]?.id});
      return reply.code(204).send(result);
    }

  } catch (err: any) {
    if (err.code === 'P0001' && err.message.includes('Stock cannot be negative or zero')) {
      reply
        .code(400)
        .send({
          error: "Failed to create Transaction",
          message: "Stock cannot be negative",
        });
    } else {
      reply.code(500).send({ error: "Failed to create product" });
    }
  }
};

export const updateAdjusmentTx = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const { sku, qty, } = request.body as Omit<IAdjusmentTransaction, "id" | "amount" | "product_id">;

  try {
    const result = await updateById(id, { sku, qty });
    reply.code(204).send(result);
  } catch (err: any) {
    if (err.code === 'P0001' && err.message.includes('Stock cannot be negative or zero')) {
      reply
        .code(400)
        .send({
          error: "Failed to create Transaction",
          message: "Stock cannot be negative",
        });
    } else {
      reply.code(500).send({ error: "Failed to create product" });
    }
  }
};