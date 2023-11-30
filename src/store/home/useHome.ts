import { HomeClient } from '@/service/home/HomeClient';
import { create } from 'zustand';
import { createZusSelector } from '../useSelector';

export interface ICartHome {
  product_name: string;
  thumbnail_url: string;
  price: number;
  quantity: number;
}

export type IRecommendedProduct = {
  product_code: string;
  image_url: string;
  name: string;
  price: number;
  discounted_price: number;
  discount?: number;
  total_sold: number;
  shop_location: string;
  shop_name: string;
  rating: number;
};

export interface ITopCategory {
  top_category_id: number;
  child_category_id: number;
  category_name: string;
  image_url: string;
}

type State = {
  cart_in_home: ICartHome[];
  loading_fetch_cart_in_home: boolean;
};

type Actions = {
  fetchCartInHome: () => void;
};

const useHomeBase = create<State & Actions>((set) => ({
  cart_in_home: [],
  loading_fetch_cart_in_home: false,
  fetchCartInHome: async () => {
    set(() => ({ loading_fetch_cart_in_home: true }));
    const response = await HomeClient.getCartInHome();
    const data = response?.data as ICartHome[];
    set(() => ({ cart_in_home: data }));
    set(() => ({ loading_fetch_cart_in_home: false }));
  },
}));

export const useHome = createZusSelector(useHomeBase);
