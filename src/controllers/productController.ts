import { FastifyReply, FastifyRequest } from "fastify";
import {
  bulkUpsert,
  create,
  deleteById,
  findAll,
  findById,
  findBySku,
  updateById,
} from "../models/product";
import { Product as IProduct, ProductDummy } from "../interfaces/Product";
import axios from "axios";
import { config } from "../config";

export const getProducts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { limit = 10, cursor, search } = request.query as {
      limit?: number;
      cursor?: string;
      search?: string
    };
    const products = await findAll(limit, cursor, search);

    const nextCursor =
      products.length > 0 ? `${products[products.length - 1]?.id}` : null;

    return reply.send({
      data: products,
      nextCursor,
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Something went wrong!" });
  }
};

export const getProductById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const productDetail: IProduct[] | null = await findById(id);

    if (!productDetail || !productDetail.length) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.send({ data: productDetail });
  } catch (err) {
    console.error("Error fetching product:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const getProductBySku = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku } = request.params as { sku: string };

  try {
    const productDetail: IProduct[] | null = await findBySku(sku);

    if (!productDetail || !productDetail.length) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.send({ data: productDetail });
  } catch (err) {
    console.error("Error fetching product:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const deleteProductById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  try {
    const data: IProduct[] | null = await findById(id);

    if (!data || !data.length) {
      return reply.status(404).send({ message: "Product not found" });
    } else {
      await deleteById(id);
      return reply.send({ message: "Product deleted Successfully" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const createProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { sku, title, price, image, description } = req.body as Omit<
    IProduct,
    "id" | "stock"
  >;

  try {
    const result = await create({ sku, title, price, image, description });
    return reply.code(201).send(result);
  } catch (err: any) {
    console.error(err);
    console.error(err?.code, err?.constraint);

    if (err?.constraint === "product_sku_key") {
      reply
        .code(400)
        .send({
          error: "Failed to create product",
          message: "Product with this sku already exists",
        });
    } else {
      reply.code(500).send({ error: "Failed to create product" });
    }
  }
};

export const updateProduct = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: string };
  const { sku, title, price, image, description } = req.body as Omit<
    IProduct,
    "id" | "stock"
  >;

  try {
    const result = await updateById(id, {
      sku,
      title,
      price,
      image,
      description,
    });

    if (result) {
      reply.code(200).send(result);
    } else {
      reply.code(404).send({ error: "Product not found" });
    }
  } catch (err: any) {
    if (err?.constraint === "product_sku_key") {
      reply
        .code(400)
        .send({
          error: "Failed to create product",
          message: "Product with this sku already exists",
        });
    } else {
      reply.code(500).send({ error: "Failed to create product" });
    }
  }
};

export const loadDummyJson = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const {
      data: { products },
    } = await axios.get(
      `${config.DUMMY_DATA_URL}?limit=100&select=title,description,sku,price,thumbnail`
    );

    const mappedProducts: IProduct[] = products.map((item: ProductDummy) => ({
      title: item?.title,
      description: item?.description,
      sku: item?.sku,
      image: item?.thumbnail,
      price: item?.price,
    }));

    await bulkUpsert(mappedProducts);

    return reply.code(200).send({ message: "succesfully import dummy" });
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Failed to update product" });
  }
};
