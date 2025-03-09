export interface AdjusmentTransaction {
  id: string,
  product_id: string,
  sku: string,
  qty: number,
  amount: number,
  created_at?: Date;
  updated_at?: Date;
}