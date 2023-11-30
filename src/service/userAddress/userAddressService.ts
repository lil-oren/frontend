import axiosInstance from '@/lib/axiosInstance';
import CONSTANS from './constants';
import { IUserAddress } from '@/interface/user';

export interface IUserAddressRequest {
  receiver_name: string;
  receiver_phone_number: string;
  address: string;
  province_id: number;
  city_id: number;
  sub_district: string;
  sub_sub_district: string;
  postal_code: string;
}

export interface IUserAddressResponse {
  error?: boolean;
  message?: string;
  data: IUserAddress[];
}

export class UserAddressService {
  static post = async (url: string, payload: IUserAddressRequest) => {
    try {
      const responseAPI = await axiosInstance({
        method: 'POST',
        url: url,
        data: payload,
      });
      if (responseAPI.status === 201) {
        const response: IUserAddressResponse = {
          error: false,
          message: CONSTANS.success_created,
          data: [],
        };
        return response;
      }
    } catch (error: any) {
      const response: IUserAddressResponse = {
        error: true,
        message: error.message,
        data: [],
      };
      return response;
    }
  };

  static get = async (url: string) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI: IUserAddressResponse = {
          error: false,
          message: 'success',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: IUserAddressResponse = {
        error: true,
        message: 'failed get user addresses',
        data: [],
      };
      return responseAPI;
    }
  };

  static put = async (url: string, payload: { id: number }) => {
    try {
      const response = await axiosInstance({
        method: 'PUT',
        url: url,
        data: payload,
      });
      if (response.status === 200) {
        const responseAPI: IUserAddressResponse = {
          error: false,
          message: CONSTANS.success_edit,
          data: [],
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: IUserAddressResponse = {
        error: true,
        message: CONSTANS.failed_edit,
        data: [],
      };
      return responseAPI;
    }
  };
}
