export interface IAddress {
  id: number;
  receiver_name: string;
  address: string;
  postal_code: number;
}

export interface ICouriers {
  label: string;
  value: number;
}

export interface ICheckoutItem {
  name: string;
  image_url: string;
  quantity: number;
  total_weight: number;
  price: number;
}

export interface IPromotionCheckout {
  is_applicable: boolean;
  minimum_spend: number;
  price_cut?: number;
  percentage?: number;
  promotion_id: number;
}

export interface ICheckout {
  shop_id: number;
  shop_name: string;
  shop_city: string;
  items: ICheckoutItem[];
  courier_dropdown: ICouriers[];
  promotion_dropdown: IPromotionCheckout[];
}

export interface IOrderSummary {
  shop_id: number;
  shop_name: string;
  sub_total_product: number;
  sub_total_promotion: number;
  delivery_cost: number;
  subtotal: number;
}

export interface ICheckoutSummary {
  orders: IOrderSummary[];
  total_shop_price: number;
  total_product: number;
  total_delivery_cost: number;
  service_price: number;
  summary_price: number;
}

export interface IRequestOrderSummary {
  shop_id: number;
  shop_courier_id: number | undefined;
  promotion_id: number | undefined;
}

export interface IRequestSummary {
  order_deliveries: IRequestOrderSummary[];
  buyer_address_id: number;
}

export interface IResponseCheckouts {
  checkouts: ICheckout[];
  total_price: number;
}

export interface ICheckoutWallet {
  is_active: boolean;
  balance: number;
}
