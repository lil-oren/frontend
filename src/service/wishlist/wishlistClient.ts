import CONSTANTS from '@/constants/constants';
import { WishlistServer } from './wishlistServer';

export class WishlistClient {
  static getWishlist = async (params: { page: number }) => {
    const response = await WishlistServer.get(
      `${CONSTANTS.BASEURL}/wishlist`,
      params,
    );
    return response;
  };

  static addToWishlist = async (data: { product_code: string }) => {
    const response = await WishlistServer.post(
      `${CONSTANTS.BASEURL}/wishlist`,
      data,
    );
    return response;
  };

  static removeFromWishlist = async (data: { product_code: string }) => {
    const response = await WishlistServer.delete(
      `${CONSTANTS.BASEURL}/wishlist`,
      data,
    );
    return response;
  };
}
