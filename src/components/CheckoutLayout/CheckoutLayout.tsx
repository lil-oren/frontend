import React from 'react';
import { Button } from '../ui/button';

interface CheckoutLayoutProps {
  amount: number;
}

const CheckoutLayout = ({ amount }: CheckoutLayoutProps) => {
  return (
    <div className="w-full fixed bottom-0 left-0 z-30 bg-primary-foreground flex justify-center">
      <div className="w-full md:w-[75vw] p-2 flex justify-between items-center gap-3">
        <div className="flex flex-col items-baseline min-w-fit">
          <p className="text-base text-gray-500 sm:text-lg xl:text-xl">
            Total:
          </p>
          <p className="text-xl font-semibold sm:text-2xl xl:text-3xl">
            {amount}
          </p>
        </div>
        <Button size={'customBlank'} className="p-2 text-xl w-1/3 lg:text-2xl">
          Pay
        </Button>
      </div>
    </div>
  );
};

export default CheckoutLayout;
