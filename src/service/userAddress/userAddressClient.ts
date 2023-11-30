import CONSTANTS from '@/constants/constants';
import { Utils } from '@/utils';
import { ToastContent } from 'react-toastify';
import { IAddAddressData } from '@/interface/user';
import { UserAddressService } from './userAddressService';

export class UserAddressClient {
  static create = async (payload: IAddAddressData) => {
    const response = await UserAddressService.post(
      `${CONSTANTS.BASEURL}/profile/addresses`,
      payload,
    );

    return response;
  };

  static getUserAddresses = async () => {
    const response = await UserAddressService.get(
      `${CONSTANTS.BASEURL}/profile/addresses`,
    );
    const error = response?.error;
    if (error) {
      Utils.notify(
        'failed to get user addresses' as ToastContent,
        'error',
        'light',
      );
    }
    return response;
  };

  static editDefaultAddress = async (addres_id: number) => {
    const response = await UserAddressService.put(
      `${CONSTANTS.BASEURL}/profile/addresses/change-default`,
      { id: addres_id },
    );
    const error = response?.error;
    if (error) {
      Utils.notify(response.message as ToastContent, 'error', 'light');
    } else {
      Utils.notify(response?.message as ToastContent, 'success', 'light');
    }
    return response;
  };
}
