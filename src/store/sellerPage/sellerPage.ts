import { create } from 'zustand';
import { IPagination } from '@/interface/pagination';
import { createZusSelector } from '../useSelector';
import { ISellerProduct } from '@/interface/sellerPage';
import { SellerPageClient } from '@/service/sellerPage/sellerPageClient';

export interface ISellerDetails {
  shop_name: string;
  product_counts: string;
  years: string;
  categories: string[];
  best_seller: ISellerProduct[];
  products: ISellerProduct[];
  pagination: IPagination;
}

type State = {
  loading_fetch_seller_details: boolean;
  seller_details: ISellerDetails;
};

type Actions = {
  fetchSellerDetails: (shop_name: string, params: string) => void;
  setSellerDetails: (seller_details: ISellerDetails) => void;
};

const useSellerPageBase = create<State & Actions>((set) => ({
  loading_fetch_seller_details: false,
  seller_details: {
    shop_name: '',
    product_counts: '',
    years: '',
    categories: [],
    best_seller: [],
    products: [],
    pagination: {
      page: 0,
      total_page: 0,
      total_product: 0,
      search: '',
    },
  },
  // seller_details: {
  //   shop_name: 'Oreki Shop',
  //   product_counts: '25',
  //   years: '\u003c 1 year',
  //   categories: ['Beras', 'Kaos', 'Pulpen'],
  //   best_seller: [
  //     {
  //       product_code: 'Shirt-98dba795-273e-435f-868b-374a4abc7e3f',
  //       product_name: 'Shirt',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/10/16/9a895898-56d6-4430-b338-bbd43107f091.png.webp?ect=4g',
  //       base_price: 100000,
  //       discount_price: 95000,
  //       discount: 5,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 4,
  //     },
  //     {
  //       product_code: 'Rice-bc2a61d7-362f-48b2-9634-ab26ca845769',
  //       product_name: 'Rice',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/10/16/9a895898-56d6-4430-b338-bbd43107f091.png.webp?ect=4g',
  //       base_price: 250000,
  //       discount_price: 250000,
  //       discount: 0,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 3,
  //     },
  //     {
  //       product_code: 'Pen-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Pen',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 20000,
  //       discount_price: 18000,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 1,
  //     },
  //     {
  //       product_code: 'Mug Ceramic-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Mug Ceramic',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 25000,
  //       discount_price: 22500,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 0,
  //     },
  //   ],
  //   products: [
  //     {
  //       product_code: 'Shirt-98dba795-273e-435f-868b-374a4abc7e3f',
  //       product_name: 'Shirt',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/10/16/9a895898-56d6-4430-b338-bbd43107f091.png.webp?ect=4g',
  //       base_price: 100000,
  //       discount_price: 95000,
  //       discount: 5,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 4,
  //     },
  //     {
  //       product_code: 'Rice-bc2a61d7-362f-48b2-9634-ab26ca845769',
  //       product_name: 'Rice',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/100-square/VqbcmM/2023/10/16/9a895898-56d6-4430-b338-bbd43107f091.png.webp?ect=4g',
  //       base_price: 250000,
  //       discount_price: 250000,
  //       discount: 0,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 3,
  //     },
  //     {
  //       product_code: 'Pen-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Pen',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 20000,
  //       discount_price: 18000,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 1,
  //     },
  //     {
  //       product_code: 'Mug Ceramic-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Mug Ceramic',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 25000,
  //       discount_price: 22500,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 0,
  //     },
  //     {
  //       product_code: 'Mug Ceramic-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Mug Ceramic',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 25000,
  //       discount_price: 22500,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 0,
  //     },
  //     {
  //       product_code: 'Mug Ceramic-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Mug Ceramic',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 25000,
  //       discount_price: 22500,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 0,
  //     },
  //     {
  //       product_code: 'Mug Ceramic-70b5f62a-040e-4546-b096-a303064a9d03',
  //       product_name: 'Mug Ceramic',
  //       thumbnail_url:
  //         'https://images.tokopedia.net/img/cache/900/VqbcmM/2021/3/21/19e19780-4bf2-46b7-bbc7-8ebf4652e0ee.jpg',
  //       base_price: 25000,
  //       discount_price: 22500,
  //       discount: 10,
  //       district_name: 'Aceh Barat',
  //       rating: 0,
  //       count_purchased: 0,
  //     },
  //   ],
  //   pagination: {
  //     page: 1,
  //     total_page: 1,
  //     total_product: 4,
  //     search: '',
  //   },
  // },
  fetchSellerDetails: async (shop_name: string, params: string) => {
    set(() => ({
      loading_fetch_seller_details: true,
    }));
    const response = await SellerPageClient.getSellerDetails(shop_name, params);
    set(() => ({
      seller_details: response.data,
    }));
    set(() => ({
      loading_fetch_seller_details: false,
    }));
  },
  setSellerDetails: (seller_details: ISellerDetails) => {
    set(() => ({
      seller_details: seller_details,
    }));
  },
}));

export const useSellerPage = createZusSelector(useSellerPageBase);
