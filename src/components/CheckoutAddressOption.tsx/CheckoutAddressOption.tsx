import React, { Dispatch, SetStateAction, useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { IAddress } from '@/interface/checkoutPage';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Divider from '../Divider/Divider';

interface CheckoutAddressOptionProps {
  chosenAddress: IAddress | undefined;
  setChosenAddress: Dispatch<SetStateAction<IAddress | undefined>>;
  allAddress: IAddress[] | undefined;
}

const CheckoutAddressOption = ({
  chosenAddress,
  setChosenAddress,
  allAddress,
}: CheckoutAddressOptionProps) => {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  if (!chosenAddress || !allAddress) {
    return null;
  }

  function handleChooseAddress(address: IAddress) {
    setChosenAddress(address);
    setIsOptionOpen(false);
  }

  return (
    <>
      <div className="w-full border-[1px] border-gray-100 px-2">
        <div className="py-2 border-b-[1px] border-gray-200 w-full">
          <p className="font-semibold text-sm md:text-base truncate">
            Shipping Address
          </p>
        </div>
        <div
          className="w-full p-2 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOptionOpen(true)}
        >
          <div className="w-10/12">
            <div className="flex items-center space-x-2 pb-2">
              <p className="text-sm sm:text-lg truncate">
                {chosenAddress.receiver_name}
              </p>
              {chosenAddress.id === allAddress[0].id && (
                <p className="text-xs bg-primary text-primary-foreground px-[2px] rounded lg:text-sm">
                  Default
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 sm:text-base truncate">
                {chosenAddress.address}
              </p>
              <div className="h-5 w-[1px] bg-gray-300 hidden lg:block" />
              <p className="text-xs text-gray-500 sm:text-base truncate hidden lg:block">
                {chosenAddress.postal_code}
              </p>
            </div>
          </div>
          <ChevronRight className="h-6 w-6 sm:w-9 sm:h-9 text-gray-500 duration-300 lg:hover:text-primary" />
        </div>
      </div>
      <Divider />
      <Sheet open={isOptionOpen} onOpenChange={setIsOptionOpen}>
        <SheetContent
          side={'bottom'}
          className="max-h-screen overflow-y-auto w-full md:w-[75vw] mx-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-sm sm:text-lg">
              Select the shipping address:
            </SheetTitle>
          </SheetHeader>
          <div className="w-full flex flex-col py-5 gap-3">
            {allAddress.map((address, index) => (
              <div
                key={index}
                className={`w-full border-[1px] p-2 cursor-pointer group duration-300 lg:hover:border-primary ${
                  chosenAddress.id === address.id
                    ? 'border-primary bg-orange-100'
                    : 'border-gray-200'
                }`}
                onClick={() => handleChooseAddress(address)}
              >
                <div className="flex items-center space-x-2 pb-2">
                  <p className="font-semibold text-sm sm:text-lg">
                    {address.receiver_name}
                  </p>
                  {address.id === allAddress[0].id && (
                    <p className="text-xs bg-primary text-primary-foreground px-[2px] rounded lg:text-sm">
                      Default
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-xs sm:text-base group-hover:text-black duration-300 ${
                      chosenAddress.id === address.id
                        ? 'text-black'
                        : 'text-gray-500'
                    }`}
                  >
                    {address.address}
                  </p>
                  <div
                    className={`h-3 w-[1px] lg:h-5 group-hover:bg-black duration-300 ${
                      chosenAddress.id === address.id
                        ? 'bg-black'
                        : 'bg-gray-300'
                    }`}
                  />
                  <p
                    className={`text-xs sm:text-base group-hover:text-black duration-300 ${
                      chosenAddress.id === address.id
                        ? 'text-black'
                        : 'text-gray-500'
                    }`}
                  >
                    {address.postal_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CheckoutAddressOption;
