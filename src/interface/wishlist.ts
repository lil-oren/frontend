export interface IWishlistResponse {
  error: boolean;
  message: string;
  data: IWishlistData | undefined;
}

export interface IWishlistData {
  items: IWishlistItem[];
  current_page: number;
  total_page: number;
  total_data: number;
}

export interface IWishlistItem {
  id: number;
  product_code: string;
  product_name: string;
  thumbnail_url: string;
  base_price: number;
  discount: number;
  discount_price: number;
  shop_name: string;
  district_name: string;
}
