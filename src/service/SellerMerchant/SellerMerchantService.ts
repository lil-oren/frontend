import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';

export interface ISellerMerchantRequest {
  shop_name: string;
  address_id: number;
}

export interface ISellerMerchantResponse {
  error?: boolean;
  message?: string;
}

export class SellerMerchantService {
  static post = async (url: string, payload: ISellerMerchantRequest) => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: url,
        data: payload,
      });

      if (response.status === 201) {
        const response: ISellerMerchantResponse = {
          error: false,
          message: 'created',
        };
        return response;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: ISellerMerchantResponse = {
          error: true,
          message: error.message,
        };
        return response;
      }
    }
  };
}
