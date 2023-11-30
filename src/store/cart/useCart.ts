import { create } from 'zustand';
import { ICart, ICartPrice } from '@/pages/user/cart';
import { ICartCheckedRequest, ICartRequest } from '@/service/cart/CartService';
import { createZusSelector } from '../useSelector';
import { CartClient } from '@/service/cart/CartClient';
import { Utils } from '@/utils';

export interface ICheckedCart {
  cart_id: number;
  is_checked: boolean;
}

type State = {
  totalCartPrice: number;
  cartItems: ICart;
  is_checked_carts: ICheckedCart[];
  prices: ICartPrice;
  all_checked: boolean;
  loading_fetch_cart: boolean;
  loading_put_quantity: boolean;
  loading_check_cart: boolean;
};

type Actions = {
  fetchCart: () => void;
  setCartItems: (cartItems: ICart) => void;
  setCheckedCart: (data: ICheckedCart[]) => void;
  setAllCheck: (isCheck: boolean) => void;
  putIsCheckedCart: (data: ICartCheckedRequest) => void;
  putQuantityCart: (cart_id: number, data: ICartRequest) => void;
};

const useCartBase = create<State & Actions>((set) => ({
  totalCartPrice: 0,
  cartItems: {
    items: [],
    prices: {
      total_base_price: 0,
      total_discount_price: 0,
      total_price: 0,
    },
  },
  is_checked_carts: [],
  prices: {
    total_base_price: 0,
    total_discount_price: 0,
    total_price: 0,
  },
  all_checked: false,
  loading_fetch_cart: false,
  loading_put_quantity: false,
  loading_check_cart: false,
  fetchCart: async () => {
    set(() => ({ loading_fetch_cart: true }));
    const response = await CartClient.getListofCartItem();
    const data: ICart = response.data;
    const checked_cart_data: ICheckedCart[] = [];
    data.items.forEach((cart_per_seller) => {
      cart_per_seller.products.forEach((cart) => {
        const data: ICheckedCart = {
          cart_id: cart.cart_id!,
          is_checked: cart.is_checked!,
        };
        checked_cart_data.push(data);
      });
    });
    const check = checked_cart_data.every((cart) => cart.is_checked === true);
    set(() => ({ is_checked_carts: checked_cart_data }));
    set(() => ({ all_checked: check }));
    set(() => ({
      cartItems: data,
    }));
    set(() => ({
      prices: data.prices,
    }));
    set(() => ({ loading_fetch_cart: false }));
  },
  setCartItems: (cartItems: ICart) => {
    set(() => ({
      cartItems: cartItems,
    }));
  },
  setCheckedCart: (data: ICheckedCart[]) => {
    set(() => ({
      is_checked_carts: data,
    }));
  },
  setAllCheck: (isCheck: boolean) => {
    set(() => ({ all_checked: isCheck }));
  },
  putIsCheckedCart: async (data: ICartCheckedRequest) => {
    set(() => ({ loading_check_cart: true }));
    const response = await CartClient.updateIsChecked(data);
    set(() => ({ prices: response.data }));
    set(() => ({ loading_check_cart: true }));
  },
  putQuantityCart: async (cart_id: number, payload: ICartRequest) => {
    const response = await CartClient.updateQuantityInCart(cart_id, payload);
    set(() => ({ prices: response.data }));
  },
}));

export const useCart = createZusSelector(useCartBase);
