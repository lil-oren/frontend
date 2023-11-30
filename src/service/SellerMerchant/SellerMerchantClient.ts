import { IShopInfoFormData } from '@/pages/seller/onboarding/form';
import CONSTANTS from '@/constants/constants';
import {
  ISellerMerchantRequest,
  SellerMerchantService,
} from './SellerMerchantService';

export class SellerMerchantClient {
  static create = async (payload: IShopInfoFormData) => {
    const data: ISellerMerchantRequest = {
      shop_name: payload.shop_name,
      address_id: parseInt(payload.address_id),
    };

    const response = await SellerMerchantService.post(
      `${CONSTANTS.BASEURL}/merchant`,
      data,
    );

    return response;
  };
}
