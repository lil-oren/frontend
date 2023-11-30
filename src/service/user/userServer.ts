import axios from 'axios';
import { IRegister, ISignIn } from '@/interface/user';
import axiosInstance from '@/lib/axiosInstance';

export class UserServer {
  static async post(url: string, payload: IRegister | ISignIn) {
    try {
      const response = await axios.post(url, payload);
      if (response.status === 201 || response.status === 200) {
        const responseAPI = {
          error: false,
          status: response.status,
          data: response.data,
          message: response.statusText,
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI = {
        error: true,
        status: error.response.status,
        data: null,
        message: error.response.statusText,
      };
      return responseAPI;
    }
  }

  static get = async (url: string) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI = {
          error: false,
          data: response.data.data,
          message: 'success get data',
        };
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI = {
        error: true,
        data: {},
        message: 'error get user details',
      };
      return responseAPI;
    }
  };
}
