import { create } from 'zustand';
import { ISellerOrder } from '@/interface/sellerOrder';
import { SellerOrderClient } from '@/service/sellerOrder/SellerOrderClient';
import { createZusSelector } from '../useSelector';

type State = {
  seller_orders: ISellerOrder;
  loading_fetch_seller_orders: boolean;
  seller_current_page: string;
};

type Actions = {
  fetchSellerOrders: (params: string) => void;
  setSellerChangeStatus: (current_page: string) => void;
};

const useSellerBase = create<State & Actions>((set) => ({
  seller_orders: {
    order_data: [],
    total_data: 0,
    total_page: 0,
  },
  loading_fetch_seller_orders: false,
  seller_current_page: '',
  fetchSellerOrders: async (params: string) => {
    set(() => ({ loading_fetch_seller_orders: true }));
    const response = await SellerOrderClient.getSellerOrders(params);
    const data: ISellerOrder = response?.data!;
    set(() => ({
      seller_orders: data,
    }));
    set(() => ({ loading_fetch_seller_orders: false }));
  },
  setSellerChangeStatus: (current_page: string) => {
    set(() => ({
      seller_current_page: current_page,
    }));
  },
}));

export const useSeller = createZusSelector(useSellerBase);
