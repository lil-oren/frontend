import React, { Dispatch, SetStateAction } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/store/wishlist/useWishlist';
import { ToastContent } from 'react-toastify';
import { Utils } from '@/utils';
import { WishlistClient } from '@/service/wishlist/wishlistClient';

interface HeartWishlistButtonProps {
  product_code: string;
  is_in_wishlist: boolean;
  wishlist_id: number;
  current_page?: number;
  is_in_product_detail: boolean;
  setIsInWishlist?: Dispatch<SetStateAction<boolean>>;
}

const HeartWishlistButton = ({
  product_code,
  is_in_wishlist,
  wishlist_id,
  current_page,
  is_in_product_detail,
  setIsInWishlist,
}: HeartWishlistButtonProps) => {
  const fetchUserWishlist = useWishlist.use.fetchUserWishlist();
  const handleRemoveFromWishlist = async () => {
    if (setIsInWishlist) {
      setIsInWishlist(false);
    }
    const response = await WishlistClient.removeFromWishlist({
      product_code: product_code,
    });
    if (response?.error) {
      Utils.notify(response?.message as ToastContent, 'error', 'light');
    } else {
      Utils.notify(response?.message as ToastContent, 'success', 'light');
    }
    if (current_page) {
      fetchUserWishlist({ page: current_page });
    }
  };

  const handleAddToWishlist = async () => {
    if (setIsInWishlist) {
      setIsInWishlist(true);
    }
    const response = await WishlistClient.addToWishlist({
      product_code: product_code,
    });
    if (response?.error) {
      Utils.notify(response?.message as ToastContent, 'error', 'light');
    } else {
      Utils.notify(
        'success add to wishlist' as ToastContent,
        'success',
        'colored',
      );
    }
    if (current_page) {
      fetchUserWishlist({ page: current_page });
    }
  };

  return is_in_wishlist ? (
    <Button
      onClick={() => handleRemoveFromWishlist()}
      variant={'secondary'}
      className={`${
        !is_in_product_detail && 'absolute'
      }  bg-white rounded-full top-1 right-1 border-[1px] border-accent ${
        !is_in_product_detail ? 'p-2' : 'p-3 h-[50px]'
      }  hover:bg-accent`}
    >
      <Heart color="#ff006f" fill="#ff006f" />
    </Button>
  ) : (
    <Button
      onClick={() => handleAddToWishlist()}
      variant={'secondary'}
      className={`${
        !is_in_product_detail && 'absolute'
      }  bg-white rounded-full top-1 right-1 border-[1px] border-accent ${
        !is_in_product_detail ? 'p-2' : 'p-3 h-[50px]'
      } hover:bg-accent`}
    >
      <Heart color="gray" fill="gray" />
    </Button>
  );
};

export default HeartWishlistButton;
