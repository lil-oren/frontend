import React from 'react';
import Image from 'next/image';
import { ICheckoutItem } from '@/interface/checkoutPage';
import { Utils } from '@/utils';
import FallbackImage from '@/components/FallbackImage/FallbackImage';

interface CheckoutProductListTabProps {
  item: ICheckoutItem;
}

const CheckoutProductListTab = ({ item }: CheckoutProductListTabProps) => {
  return (
    <div className="w-full py-2">
      <div className="flex mt-1 items-start gap-2">
        <div className="relative aspect-square rounded-md overflow-hidden border-[1px] border-gray-100 w-[100px]">
          <FallbackImage
            src={item.image_url}
            alt={`${item.name}'s photo`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        <div className="flex flex-col flex-1 gap-1">
          <p className="text-sm leading-tight sm:text-base">{item.name}</p>
          <p className="text-gray-500 text-xs leading-none sm:text-sm">{`Total weight: ${item.total_weight}g`}</p>
          <p className="font-semibold text-base sm:text-lg">{`(${
            item.quantity
          } item${item.quantity > 0 ? 's' : ''}): ${Utils.convertPrice(
            item.price,
          )}`}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProductListTab;
