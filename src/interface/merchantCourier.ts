export interface IMerchantCourier {
  id: number;
  name: string;
  image_url: string;
  description: string;
  is_available: boolean;
}

export interface IPutCourier {
  '1': boolean;
  '2': boolean;
  '3': boolean;
}

export type TypePutCourier = '1' | '2' | '3';
