import axios from 'axios';

export interface IDropdownData {
  label: string;
  value: string;
}

export interface IDropdownResponse {
  error?: boolean;
  message?: string;
  data: IDropdownData[];
}

export class DropdownServer {
  static get = async (url: string) => {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI: IDropdownResponse = {
          error: false,
          message: 'success get data',
          data: response.data.data,
        };
        return responseAPI;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response: any = {
          error: true,
          message: error.message,
          data: [],
        };
        return response;
      }
    }
  };
}
