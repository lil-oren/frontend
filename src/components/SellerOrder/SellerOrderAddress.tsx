import { IOrderData } from '@/interface/sellerOrder';
import React from 'react';

interface SellerOrderAddressProps {
  order_data: IOrderData;
}

const SellerOrderAddress = ({ order_data }: SellerOrderAddressProps) => {
  return (
    <div className="address lg:flex hidden lg:flex-col lg:w-[250px]">
      <p className="font-bold text-[12px]">Address</p>
      <div className="address-details text-[12px]">
        <p className="receiver-name-phone">{`${order_data.receiver_name} (${order_data.receiver_phone_number})`}</p>
        <p className="address">{order_data.address_detail}</p>
        <p className="postal-code">{'13220'}</p>
      </div>
    </div>
  );
};

export default SellerOrderAddress;
