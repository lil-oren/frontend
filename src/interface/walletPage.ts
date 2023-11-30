export interface IWalletInfo {
  is_active: boolean;
  balance: number;
}

export interface ITopUpRequest {
  wallet_pin: string;
  amount: number;
}

export interface IGetPaymentToken {
  wallet_pin: string;
}

export interface IWalletHistory {
  title: string;
  amount: number;
  date: string;
  is_debit: boolean;
  shop_name?: string;
  order_id?: number;
}
