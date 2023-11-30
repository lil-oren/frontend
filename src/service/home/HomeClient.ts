import CONSTANTS from '@/constants/constants';
import {
  HomeService,
  ICartHomeResponse,
  IRecommendedProductResponse,
  ITopCategoryResponse,
} from './HomeService';

export class HomeClient {
  static getCartInHome = async () => {
    const response = await HomeService.get<ICartHomeResponse>(
      `${CONSTANTS.BASEURL}/home-page/carts`,
    );
    return response;
  };

  static getRecommendedProduct = async () => {
    const response = await HomeService.get<IRecommendedProductResponse>(
      `${CONSTANTS.BASEURL}/home-page/recommended-products`,
    );
    return response;
  };

  static getCategories = async () => {
    const response = await HomeService.get<ITopCategoryResponse>(
      `${CONSTANTS.BASEURL}/home-page/categories`,
    );
    return response;
  };
}
