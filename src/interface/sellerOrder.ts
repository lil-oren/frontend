interface ISellerOrderProduct {
  product_name: string;
  thumbnail_url: string;
  variant_name: string;
  sub_total_price: number;
  quantity: number;
}

export interface IOrderData {
  id: number;
  status: string;
  products: ISellerOrderProduct[];
  receiver_name: string;
  receiver_phone_number: string;
  address_detail: string;
  courier_name: string;
  eta: string;
  total_price: number;
}

export interface ISellerOrder {
  order_data: IOrderData[];
  total_data: number;
  total_page: number;
}
