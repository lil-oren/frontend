import { IOrderProductItem } from '@/interface/orderDetailPage';
import Image from 'next/image';
import React from 'react';
import { Utils } from '@/utils';
import FallbackImage from '@/components/FallbackImage/FallbackImage';

interface BuyerOrderDetailCardItemProps {
  item: IOrderProductItem;
}

const BuyerOrderDetailCardItem = ({ item }: BuyerOrderDetailCardItemProps) => {
  return (
    <div className="flex items-start gap-2 py-2 justify-between">
      <div className="flex gap-2 items-start max-w-full">
        <div className="relative aspect-square rounded-md overflow-hidden border-[1px] border-gray-100 w-[80px] lg:w-[100px]">
          <FallbackImage
            src={item.thumbnail_url}
            alt={item.product_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base sm:text-lg font-semibold line-clamp-2 text-ellipsis lg:text-xl">
            {`${item.product_name}${
              item.variant_name !== '' ? ` | ${item.variant_name}` : ''
            }`}
          </p>
          <div className="flex items-start gap-1">
            <p className="text-gray-500 text-sm lg:text-base">
              {`Quantity: ${item.quantity}`}
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-full flex-col items-center justify-center border-l-2 border-gray-100 pl-2 w-1/6 hidden lg:flex">
        <p className="font-semibold text-gray-500 w-full text-left text-base">
          Sub-Total:
        </p>
        <p className="text-lg font-bold w-full text-left">
          {Utils.convertPrice(item.sub_total_price)}
        </p>
      </div>
    </div>
  );
};

export default BuyerOrderDetailCardItem;
