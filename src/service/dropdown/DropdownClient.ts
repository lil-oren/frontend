import CONSTANTS from '@/constants/constants';
import { DropdownServer, IDropdownResponse } from './DropdownService';
import { Utils } from '@/utils';
import { ToastContent } from 'react-toastify';

export class DropdownClient {
  static getProvinces = async () => {
    const response: IDropdownResponse = await DropdownServer.get(
      `${CONSTANTS.BASEURL}/dropdowns/location-unit/provinces`,
    );
    if (response.error) {
      Utils.notify('failed to get data' as ToastContent, 'error', 'light');
    }
    return response;
  };

  static getCityByProvinceId = async (province_id: number) => {
    const response = await DropdownServer.get(
      `${CONSTANTS.BASEURL}/dropdowns/location-unit/provinces/${province_id}/districts`,
    );
    if (response.error) {
      Utils.notify('failed get city data' as ToastContent, 'error', 'light');
    }
    return response;
  };
}
