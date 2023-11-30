import { create } from 'zustand';
import { createZusSelector } from '../useSelector';
import { IWishlistData } from '@/interface/wishlist';
import { WishlistClient } from '@/service/wishlist/wishlistClient';

type State = {
  loading_fetch_user_wishlist: boolean;
  user_wishlist: IWishlistData;
};

type Actions = {
  fetchUserWishlist: (params: { page: number }) => void;
};

const useWishlistBase = create<State & Actions>((set) => ({
  loading_fetch_user_wishlist: false,
  user_wishlist: {
    items: [],
    current_page: 0,
    total_page: 0,
    total_data: 0,
  },
  fetchUserWishlist: async (params: { page: number }) => {
    set(() => ({ loading_fetch_user_wishlist: true }));
    const response = await WishlistClient.getWishlist(params);
    if (!response?.error) {
      set(() => ({
        user_wishlist: response?.data,
      }));
    }
    set(() => ({ loading_fetch_user_wishlist: false }));
  },
}));

export const useWishlist = createZusSelector(useWishlistBase);
