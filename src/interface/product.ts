export interface IProduct {
  cart_id?: number;
  product_name: string;
  product_id: number;
  image_url: string;
  base_price: number;
  discount_price: number;
  discount?: number;
  quantity?: number;
  remaining_quantity?: number;
  variant1_name?: string;
  variant2_name?: string;
  is_checked?: boolean;
}
