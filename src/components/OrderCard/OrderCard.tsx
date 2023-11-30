import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CheckoutProductListTab from '../CheckoutProductListTab/CheckoutProductListTab';
import {
  ICheckout,
  ICheckoutSummary,
  IOrderSummary,
} from '@/interface/checkoutPage';
import Divider from '../Divider/Divider';
import { Utils } from '@/utils';
import OrderSumsSkeleton from '../Skeletons/OrderSumsSkeleton';

interface OrderCardProps {
  checkout: ICheckout;
  index: number;
  isMultiple: boolean;
  handleCouriersChange: (
    shop_id: number,
    shop_courier_id: number,
    loadingToggle: Dispatch<SetStateAction<boolean>>,
  ) => void;
  checkoutSummary: ICheckoutSummary;
  isCourierValid: boolean | undefined;
  isAllPriceLoading: boolean;
  handlePromotionChange: (
    shop_id: number,
    promotion_id: number,
    loadingToggle: Dispatch<SetStateAction<boolean>>,
  ) => void;
}

const OrderCard = ({
  checkout,
  index,
  isMultiple,
  handleCouriersChange,
  checkoutSummary,
  isCourierValid,
  isAllPriceLoading,
  handlePromotionChange,
}: OrderCardProps) => {
  const [orderSummary, setOrderSummary] = useState<IOrderSummary>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getOrderSummary() {
    for (let i = 0; i < checkoutSummary.orders.length; i++) {
      if (checkoutSummary.orders[i].shop_id === checkout.shop_id) {
        setOrderSummary(checkoutSummary.orders[i]);
        return;
      }
    }
  }

  useEffect(() => {
    getOrderSummary();
  }, [checkoutSummary]);
  return (
    <>
      <div
        className={`w-full border-[1px] border-gray-100 px-2 pt-2 ${
          orderSummary ? 'pb-2' : 'pb-5'
        }`}
      >
        <div className="pb-2 border-b-[1px] border-gray-200 w-full">
          {isMultiple && (
            <p className="text-xs md:text-sm w-full text-left">{`Order ${
              index + 1
            }`}</p>
          )}
          <p className="font-semibold text-sm sm:text-base md:text-lg w-full text-left truncate">
            {checkout.shop_name}
          </p>
          <p className="text-xs sm:text-sm md:text-base w-full text-left text-gray-400 truncate">
            {checkout.shop_city}
          </p>
        </div>
        <div className="w-full divide-y-2 divide-gray-200">
          {checkout.items.map((item, index) => (
            <CheckoutProductListTab key={index} item={item} />
          ))}
        </div>
        {checkout.promotion_dropdown.length !== 0 && (
          <div className="w-full pb-3">
            <Select
              onValueChange={(value) =>
                handlePromotionChange(
                  checkout.shop_id,
                  parseInt(value),
                  setIsLoading,
                )
              }
            >
              <SelectTrigger className="max-w-sm text-sm sm:text-base md:text-lg h-fit">
                <SelectValue placeholder={'Promotion'} />
              </SelectTrigger>
              <SelectContent className="max-w-sm">
                <SelectItem
                  value={'-1'}
                  className="text-sm sm:text-base md:text-lg flex flex-col items-start"
                >
                  Cancel
                </SelectItem>
                {checkout.promotion_dropdown.map((checkout, index) => (
                  <SelectItem
                    key={index}
                    value={checkout.promotion_id.toString()}
                    className="text-sm sm:text-base md:text-lg flex flex-col items-start"
                    disabled={!checkout.is_applicable}
                  >
                    {checkout.price_cut !== undefined && (
                      <p className="leading-none text-left">{`Discount: ${Utils.convertPrice(
                        checkout.price_cut,
                      )}`}</p>
                    )}
                    {checkout.percentage !== undefined && (
                      <p className="leading-none text-left">{`Discount: ${checkout.percentage}%`}</p>
                    )}
                    <p className="text-xs sm:text-sm md:text-base leading-tight text-left text-gray-500">{`Minimum spend: ${Utils.convertPrice(
                      checkout.minimum_spend,
                    )}`}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="w-full pb-3">
          <Select
            onValueChange={(value) =>
              handleCouriersChange(
                checkout.shop_id,
                parseInt(value),
                setIsLoading,
              )
            }
          >
            <SelectTrigger className="max-w-sm text-sm sm:text-base md:text-lg">
              <SelectValue placeholder={'Shipping option *'} />
            </SelectTrigger>
            <SelectContent className="max-w-sm">
              {checkout.courier_dropdown.map((courier, index) => (
                <SelectItem
                  key={index}
                  value={courier.value.toString()}
                  className="text-sm sm:text-base md:text-lg"
                >
                  {courier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isCourierValid !== undefined && isCourierValid === false && (
            <p className="text-sm sm:text-base md:text-lg text-destructive">
              Please choose a courier
            </p>
          )}
        </div>
        {(isLoading || isAllPriceLoading) && <OrderSumsSkeleton />}
        {!isLoading && !isAllPriceLoading && orderSummary && (
          <div className="w-full bg-primary-foreground py-2 max-w-sm px-1">
            {orderSummary.sub_total_product > 0 && (
              <p
                className={`text-gray-600 text-xs sm:text-sm ${
                  orderSummary.sub_total_promotion <
                    orderSummary.sub_total_product && 'line-through'
                }`}
              >{`product(s): ${Utils.convertPrice(
                orderSummary.sub_total_product,
              )}`}</p>
            )}
            {orderSummary.sub_total_promotion <
              orderSummary.sub_total_product && (
              <p className="text-gray-600 text-xs sm:text-sm">{`promotion: ${Utils.convertPrice(
                orderSummary.sub_total_promotion,
              )}`}</p>
            )}
            {orderSummary.delivery_cost > 0 && (
              <p className="text-gray-600 text-xs sm:text-sm">{`delivery: ${Utils.convertPrice(
                orderSummary.delivery_cost,
              )}`}</p>
            )}
            <p className="text-gray-600 text-sm sm:text-base font-semibold">{`Sub-total: ${Utils.convertPrice(
              orderSummary.subtotal,
            )}`}</p>
          </div>
        )}
      </div>
      <Divider />
    </>
  );
};

export default OrderCard;
