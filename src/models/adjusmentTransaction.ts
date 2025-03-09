import { dbconn } from "../config/db/dbconn";
import { AdjusmentTransaction as IAdjusmentTransaction } from "../interfaces/AdjusmentTransaction";

export const findAll = async (
  limit: number = 10,
  page: number = 1
) => {
  const offset = (page - 1) * limit;

  console.info("offset",offset)

  const params = [limit, offset];

  return dbconn.any(
    `
      SELECT 
        at.id,
        at.sku,
        at.qty,
        at.amount
      FROM adjustment_transaction at
      ORDER BY at.created_at DESC
      LIMIT $1 OFFSET $2
    `,
    params
  );
};

export const findById = async (id: string) => {
  const params = [id];

  console.info(params)

  return dbconn.any(
    `
    SELECT 
      at.id,
      at.sku,
      at.qty,
      at.amount
    FROM adjustment_transaction at
    WHERE at.id = $1
  `,
    params
  );
};

export const findBySku = async (sku: string) => {
  const params = [sku];

  return dbconn.any(
    `
    SELECT 
      at.id,
      at.sku,
      at.qty,
      at.amount
    FROM adjustment_transaction at
    WHERE at.sku = $1
  `,
    params
  );
};

export const deleteById = async (id: string): Promise<IAdjusmentTransaction[]> => {
  const params = [id];
  return dbconn.any(
    `
    DELETE FROM adjustment_transaction WHERE id = $1
  `,
    params
  );
};

export const create = async (
  AdjustTxPayload: Omit<IAdjusmentTransaction, "id" | "amount">
): Promise<IAdjusmentTransaction> => {
  const { sku, qty, product_id } = AdjustTxPayload;
  const tx = await dbconn.tx(async t => {
    const result = await t.one(
      'INSERT INTO adjustment_transaction (product_id, sku, qty) VALUES ($3, $1, $2) RETURNING *',
      [sku, qty, product_id]
    );
    return result;
  });
  return tx;
};

export const count = async () => {
  return dbconn.one('SELECT COUNT(at.id) FROM adjustment_transaction at');
};

export const updateById = async (
  id: string,
  AdjustTxPayload: Omit<IAdjusmentTransaction, "id" | "amount" | "product_id">
): Promise<IAdjusmentTransaction> => {
  const { sku, qty } = AdjustTxPayload;
  const tx = await dbconn.tx(async t => {
    console.info("id", id)
    const result = await t.one(
      'UPDATE adjustment_transaction SET sku = $1, qty = $2 WHERE id = $3 RETURNING *',
      [sku, qty, id]
    );
    if (!result) {
      throw new Error('Adjustment transaction not found');
    }
    return result;
  });
  return tx;
};


