import CONSTANTS from '@/constants/constants';
import { SellerOrderService } from './SellerOrderService';
import { Utils } from '@/utils';
import { ToastContent } from 'react-toastify';

export class SellerOrderClient {
  static getSellerOrders = async (params: string) => {
    const response = await SellerOrderService.get(`/orders/seller?${params}`);
    if (response?.error) {
      Utils.notify(
        'failed to get seller order' as ToastContent,
        'error',
        'colored',
      );
    }
    return response;
  };

  static putOrderStatusToProcess = async (order_id: number) => {
    const response = await SellerOrderService.put(
      `/orders/seller/${order_id}/process`,
    );
    return response;
  };

  static putOrderStatusToArrive = async (order_id: number) => {
    const response = await SellerOrderService.put(
      `${CONSTANTS.BASEURL}/orders/seller/${order_id}/arrive`,
    );
    return response;
  };

  static putOrderStatusToDeliver = async (
    data: {
      est_days: number;
    },
    cart_id: number,
  ) => {
    const response = await SellerOrderService.put(
      `/orders/seller/${cart_id}/deliver`,
      data,
    );
    return response;
  };
}
