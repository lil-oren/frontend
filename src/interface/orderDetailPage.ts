export interface IOrderItem {
  id: number;
  eta: string;
  delivery_cost: number;
  status: string;
  products: IOrderProductItem[];
  receiver_name: string;
  receiver_phone_number: string;
  address_detail: string;
  courier_name: string;
  total_price: number;
  shop_name: string;
}

export interface IOrderProductItem {
  product_name: string;
  thumbnail_url: string;
  variant_name: string;
  sub_total_price: number;
  quantity: number;
  product_code: string;
}
