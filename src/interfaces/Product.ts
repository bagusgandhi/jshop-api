export interface Product {
  id: string,
  title: string,
  sku: string,
  description?: string,
  price: number,
  image: string,
  stock: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductDummy {
  id: string,
  title: string,
  sku: string,
  description?: string,
  price: number,
  thumbnail: string,
}