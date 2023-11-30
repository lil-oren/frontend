import { ISellerOrder } from '@/interface/sellerOrder';
import axiosInstance from '@/lib/axiosInstance';

interface ISellerOrderResponse {
  error: boolean;
  message?: string;
  data?: ISellerOrder;
}

export interface ISellerOrdersParams {
  page: number;
  status?: string;
}

interface ISellerOrderRequestData {
  est_days: number;
}

export class SellerOrderService {
  static get = async (url: string) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI: ISellerOrderResponse = {
          error: false,
          message: 'success get',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const response = {
        error: true,
        message: error.message,
        data: {
          order_data: [],
          total_data: 0,
          total_page: 0,
        },
      };
      return response;
    }
  };

  static put = async (url: string, data?: ISellerOrderRequestData) => {
    try {
      const response = await axiosInstance({
        method: 'PUT',
        url: url,
        data: data,
      });
      if (response.status === 200) {
        const responseAPI: ISellerOrderResponse = {
          error: false,
          message: 'success edit order status',
        };
        return responseAPI;
      }
    } catch (error: any) {
      const response = {
        error: true,
        message: error.message,
      };
      return response;
    }
  };
}
