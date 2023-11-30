import React from 'react';
import { IOrderData } from '@/interface/sellerOrder';
import { Utils } from '@/utils';

interface SellerOrderCourierProps {
  order_data: IOrderData;
}
const SellerOrderCourier = ({ order_data }: SellerOrderCourierProps) => {
  return (
    <div className="courier lg:flex hidden lg:flex-col lg:w-[200px] h-full ">
      <p className="font-bold text-[12px]">Courier</p>
      <div className="courier-service text-[12px]">
        <p className="courier detail">{`${order_data.courier_name} - Reguler`}</p>
      </div>
      {order_data.eta !== '0001-01-01' && (
        <div className="flex flex-col py-3">
          {order_data.status === 'ARRIVE' && (
            <p className="font-bold text-[12px]">Arrive Date</p>
          )}
          {order_data.status === 'DELIVER' && (
            <p className="font-bold text-[12px]">Est Date</p>
          )}
          {order_data.status === 'RECEIVE' && (
            <p className="font-bold text-[12px]">Received</p>
          )}
          <p className="est days detail text-[12px]">{`${Utils.getDate(
            order_data.eta,
          )}`}</p>
        </div>
      )}
    </div>
  );
};

export default SellerOrderCourier;
