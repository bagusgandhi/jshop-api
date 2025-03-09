import { dbconn } from "../config/db/dbconn";
import { Product as IProduct } from "../interfaces/Product";

export const findAll = async (
  limit: number,
  cursor?: string,
  search?: string
): Promise<IProduct[]> => {
  let query = `
    SELECT 
      p.id,
      p.sku,
      p.title,
      p.price,
      p.image,
      p.created_at,
      COALESCE(ps.stock, 0) AS stock
    FROM product p
    LEFT JOIN product_stock ps ON p.sku = ps.sku
  `;

  const params: Array<number | string> = [limit];
  let paramIndex = 2; // $2 is next after $1 (which is for limit)

  if (search) {
    query += `
      WHERE (p.sku ILIKE $${paramIndex} OR p.title ILIKE $${paramIndex})
    `;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (cursor) {
    query += search ? ` AND p.id < $${paramIndex}` : `WHERE p.id < $${paramIndex}`;
    params.push(cursor);
  }

  query += `
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT $1
  `;

  return dbconn.any(query, params);
};


export const findById = async (id: string): Promise<IProduct[]> => {
  const params = [id];
  return dbconn.any(
    `
    SELECT 
      p.id,
      p.sku,
      p.title,
      p.price,
      p.image,
      p.description,
      COALESCE(ps.stock, 0) AS stock
    FROM product p
    LEFT JOIN product_stock ps ON p.sku = ps.sku
    WHERE p.id = $1
  `,
    params
  );
};

export const findBySku = async (sku: string): Promise<IProduct[]> => {
  const params = [sku];
  return dbconn.any(
    `
    SELECT 
      p.id,
      p.sku,
      p.title,
      p.price,
      p.image,
      p.description,
      COALESCE(ps.stock, 0) AS stock
    FROM product p
    LEFT JOIN product_stock ps ON p.sku = ps.sku
    WHERE p.sku = $1
  `,
    params
  );
};

export const deleteById = async (id: string): Promise<IProduct[]> => {
  const params = [id];
  return dbconn.any(
    `
    DELETE FROM product WHERE id = $1
  `,
    params
  );
};

export const create = async (
  product: Omit<IProduct, "id" | "stock">
): Promise<IProduct> => {
  const { sku, title, price, image, description } = product;

  return dbconn.one(
    `
    INSERT INTO product (sku, title, price, image, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [sku, title, price, image, description]
  );
};


export const updateById = async (
  id: string,
  product: Omit<IProduct, "id" | "stock">
): Promise<IProduct[]> => {
  const { title, price, image, description } = product;

  return dbconn.any(
    `
    UPDATE product
    SET 
      title = $1,
      price = $2,
      image = $3,
      description = $4
    WHERE id = $5
    RETURNING id, title, price, image, description
  `,
    [title, price, image, description, id]
  ).then((products) => {
    const productIds = products.map((p) => p.id);

    if (productIds.length === 0) return [];

    return dbconn.any(
      `
      SELECT       
        p.id,
        p.sku,
        p.title,
        p.price,
        p.image,
        p.created_at,
        COALESCE(ps.stock, 0) AS stock
      FROM product p
      LEFT JOIN product_stock ps ON p.sku = ps.sku
      WHERE p.id = ANY($1::uuid[])
      `,
      [productIds]
    );
  });
};

export const bulkUpsert = async (products: IProduct[]): Promise<IProduct[]> => {
  const columns = ["sku", "title", "price", "image", "description"];
  const values = products.map((product) => [
    product.sku,
    product.title,
    product.price,
    product.image,
    product.description,
  ]);

  const query = `
    INSERT INTO product (${columns.join(", ")})
    VALUES ${values
      .map(
        (_, i) =>
          `($${i * columns.length + 1}, $${i * columns.length + 2}, $${i * columns.length + 3}, $${i * columns.length + 4}, $${i * columns.length + 5})`
      )
      .join(", ")}
    ON CONFLICT (sku) 
    DO UPDATE SET 
      title = EXCLUDED.title,
      price = EXCLUDED.price,
      image = EXCLUDED.image,
      description = EXCLUDED.description
    RETURNING *;
  `;

  console.info("query", query)

  const flatValues = values.flat();
  return dbconn.any(query, flatValues);
};

export const optionsList = async () => {
  return dbconn.any(
    `
    SELECT 
      p.id,
      p.sku,
      p.title,
    FROM product p
  `
  );
};


