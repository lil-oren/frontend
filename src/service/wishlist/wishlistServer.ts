import { IWishlistResponse } from '@/interface/wishlist';
import axiosInstance from '@/lib/axiosInstance';

export class WishlistServer {
  static post = async (url: string, data: { product_code: string }) => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: url,
        data: data,
      });
      if (response.status.toString().startsWith('2')) {
        const responseAPI: IWishlistResponse = {
          error: false,
          message: 'success add to wishlist',
          data: undefined,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: IWishlistResponse = {
        error: true,
        message: 'failed add to wishlist',
        data: undefined,
      };
      return responseAPI;
    }
  };

  static delete = async (url: string, data: { product_code: string }) => {
    try {
      const response = await axiosInstance({
        method: 'DELETE',
        url: url,
        data: data,
      });
      if (response.status === 200) {
        const responseAPI: IWishlistResponse = {
          error: false,
          message: 'success removed from wishlist',
          data: undefined,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: IWishlistResponse = {
        error: true,
        message: 'failed removed from wishlist',
        data: undefined,
      };
      return responseAPI;
    }
  };

  static get = async (
    url: string,
    params: {
      page: number;
    },
  ) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
        params: params,
      });
      if (response.status === 200) {
        const responseAPI: IWishlistResponse = {
          error: false,
          message: 'success get',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: IWishlistResponse = {
        error: true,
        message: 'failed get user wishlist',
        data: undefined,
      };
      return responseAPI;
    }
  };
}
