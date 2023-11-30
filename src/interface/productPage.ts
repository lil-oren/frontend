export interface IProduct {
  name: string;
  description: string;
}

export interface ISeller {
  id: number;
  name: string;
  profile_picture_url: string;
  location: string;
}

export interface IProductVariant {
  id: number;
  price: number;
  discounted_price: number;
  stock: number;
  discount: number;
  variant_type1_id: number;
  variant_type2_id: number;
}
export interface IProductMedia {
  media_url: string;
  media_type: 'image' | 'video';
}

export interface IVariantType {
  type_id: number;
  type_name: string;
}

export interface IVariantGroup {
  group_name: string;
  variant_types: IVariantType[];
}

export interface IProductPage {
  product: IProduct;
  shop: ISeller;
  rating: number;
  product_variant: IProductVariant[];
  product_media: IProductMedia[];
  variant_group1: IVariantGroup;
  variant_group2: IVariantGroup;
  high_price: number;
  low_price: number;
  is_variant: boolean;
  is_in_wishlist: boolean;
  total_sold: number;
  rating_count: number;
}

export interface IAddToCart {
  product_variant_id: number;
  seller_id: number;
  quantity: number;
}

export interface IProductReview {
  rating: number;
  comment?: string;
  account_id: number;
  username: string;
  image_urls?: string[];
  created_at: string;
}

export interface IProductReviewResponse {
  user_reviews: IProductReview[];
  total_review: number;
  total_page: number;
  current_page: number;
}
