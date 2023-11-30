import axiosInstance from '@/lib/axiosInstance';
import {
  ICartHome,
  IRecommendedProduct,
  ITopCategory,
} from '@/store/home/useHome';

type ConstructResponse<D> = {
  error: boolean;
  message?: string;
  data?: D;
};

export type ICartHomeResponse = ConstructResponse<ICartHome[]>;
export type IRecommendedProductResponse = ConstructResponse<
  IRecommendedProduct[]
>;
export type ITopCategoryResponse = ConstructResponse<ITopCategory[]>;

type Responses =
  | ICartHomeResponse
  | IRecommendedProductResponse
  | ITopCategoryResponse;

export class HomeService {
  static get = async <Response extends Responses>(url: string) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: url,
      });
      if (response.status === 200) {
        const responseAPI = {
          error: false,
          data: response.data.data,
        } as Response;
        return responseAPI;
      }
    } catch (error: any) {
      const responseAPI: Response = {
        error: true,
        data: [],
      } as any;
      return responseAPI;
    }
  };
}
