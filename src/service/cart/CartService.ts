import axiosInstance from '@/lib/axiosInstance';
import { ICartItem } from '@/pages/user/cart';
import { ICheckedCart } from '@/store/cart/useCart';
import axios from 'axios';

export interface ICartsResponse {
  error?: boolean;
  message?: string;
  data?: ICartItem[];
}

export interface ICartRequest {
  product_variant_id?: number;
  seller_id?: number;
  quantity?: number;
}

export interface ICartCheckedRequest {
  is_checked_carts: ICheckedCart[];
}

export class CartService {
  static post = async (
    url: string,
    payload: ICartRequest | ICartCheckedRequest,
  ) => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: url,
        data: payload,
      });

      if (response.status === 201) {
        const responseAPI: ICartsResponse = {
          error: false,
          message: 'Success',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: any = {
          error: true,
          message: error.message,
        };
        return response;
      }
    }
  };

  static get = async (url: string, params?: any) => {
    try {
      const response = await axiosInstance({
        withCredentials: true,
        method: 'GET',
        url: url,
        params: params,
      });

      if (response.status === 200) {
        const responseAPI: ICartsResponse = {
          error: false,
          message: 'success',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: any = {
          error: true,
          message: error.message,
        };
        return response;
      }
    }
  };

  static put = async (
    url: string,
    payload: ICartRequest | ICartCheckedRequest,
  ) => {
    try {
      const response = await axiosInstance({
        method: 'PUT',
        url: url,
        data: payload,
      });
      if (response.status === 200) {
        const responseAPI: ICartsResponse = {
          error: false,
          message: 'Success',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: any = {
          error: true,
          message: error.message,
        };
        return response;
      }
    }
  };

  static delete = async (url: string) => {
    try {
      const response = await axiosInstance({
        method: 'DELETE',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI: ICartsResponse = {
          error: false,
          message: response.data.message,
        };
        return responseAPI;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: any = {
          error: true,
          message: error.message,
        };
        return response;
      }
    }
  };
}
