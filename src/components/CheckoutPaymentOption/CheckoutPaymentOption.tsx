import React, { Dispatch, SetStateAction, useState } from 'react';
import { ICheckoutSummary, ICheckoutWallet } from '@/interface/checkoutPage';
import { Utils } from '@/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import CheckoutSumSkeleton from '../Skeletons/CheckoutSumSkeleton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PinInput from '../PinInput/PinInput';

import styles from './CheckoutPaymentOption.module.css';
import AsyncButton from '../AsyncButton/AsyncButton';
import ActivatePinWarning from '../ActivatePinWarning/ActivatePinWarning';

interface CheckoutPaymentOptionProps {
  checkoutSummary: ICheckoutSummary;
  isLoading: boolean;
  pins: string[];
  setPins: Dispatch<SetStateAction<string[]>>;
  handlePay: () => void;
  isPinsValid: boolean;
  setIsPinsValid: Dispatch<SetStateAction<boolean>>;
  isPaymentOpen: boolean;
  setIsPaymentOpen: Dispatch<SetStateAction<boolean>>;
  isPaymentLoading: boolean;
  handleOpenPayment: () => void;
  wallet: ICheckoutWallet;
  setUpdateToggle: Dispatch<SetStateAction<boolean>>;
}

const CheckoutPaymentOption = ({
  checkoutSummary,
  isLoading,
  pins,
  setPins,
  handlePay,
  isPinsValid,
  setIsPinsValid,
  isPaymentOpen,
  setIsPaymentOpen,
  isPaymentLoading,
  handleOpenPayment,
  wallet,
  setUpdateToggle,
}: CheckoutPaymentOptionProps) => {
  const [isActivatePinOpen, setIsActivatePinOpen] = useState<boolean>(false);
  function handleClosePaymentModal() {
    setPins(new Array(6).fill(''));
    setIsPaymentOpen(false);
    setIsPinsValid(true);
  }
  return (
    <>
      <div className="w-full border-[1px] border-gray-100 px-2 pb-2">
        <div className="py-2 border-b-[1px] border-gray-200 w-full">
          <p className="font-semibold text-sm truncate sm:text-base lg:text-lg">
            Checkout Summary
          </p>
        </div>
        {isLoading ? (
          <CheckoutSumSkeleton />
        ) : (
          <>
            <div className="w-full py-2 flex flex-col gap-1 border-b-2 border-gray-300 text-sm sm:text-base">
              <p className="text-gray-500">{`Total Price (${
                checkoutSummary.total_product
              } product${
                checkoutSummary.total_product > 1 ? 's' : ''
              }): ${Utils.convertPrice(checkoutSummary.total_shop_price)}`}</p>
              <p className="text-gray-500">{`Shipping Fee: ${Utils.convertPrice(
                checkoutSummary.total_delivery_cost,
              )}`}</p>
            </div>
            <div className="flex items-center justify-between py-2 text-lg sm:text-xl lg:text-2xl">
              <p className="font-bold">{`Shopping Total:`}</p>
              <p className="font-bold">
                {Utils.convertPrice(checkoutSummary.summary_price)}
              </p>
            </div>
            {wallet.is_active ? (
              <>
                <p className="text-sm truncate sm:text-base lg:text-lg">{`MyWallet (${Utils.convertPrice(
                  wallet.balance,
                )})`}</p>
                <div className="flex items-center gap-1 mt-1 text-sm sm:text-base">
                  {wallet.is_active &&
                    wallet.balance < checkoutSummary.summary_price && (
                      <p className="text-destructive truncate">
                        Balance is insufficient.
                      </p>
                    )}
                  <Link
                    href={'/wallet'}
                    className="truncate text-gray-500 duration-300 hover:text-primary hover:underline"
                  >
                    Top-Up Wallet
                  </Link>
                </div>
                <Button
                  className="p-2 text-sm sm:text-base lg:text-lg w-full h-fit mt-3"
                  onClick={handleOpenPayment}
                >
                  Pay
                </Button>{' '}
              </>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-1">
                <p className="text-sm text-gray-500 sm:text-base">
                  You have&apos;t activate your pin:
                </p>
                <ActivatePinWarning
                  isOpen={isActivatePinOpen}
                  setIsOpen={setIsActivatePinOpen}
                  setUpdateToggle={setUpdateToggle}
                />
              </div>
            )}
          </>
        )}
      </div>
      <AlertDialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="w-full text-center lg:text-lg">
              Payment
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="w-full flex justify-center flex-col items-center gap-2">
            {isPinsValid ? (
              <p className="font-semibold text-sm sm:text-base lg:text-lg">
                Please enter your pin:
              </p>
            ) : (
              <p
                className={`font-semibold text-sm sm:text-base lg:text-lg text-destructive ${styles.wiggleDiv}`}
              >
                PIN must be 6 digits!
              </p>
            )}
            <PinInput
              pins={pins}
              setPins={setPins}
              onEnter={handlePay}
              isLoading={isPaymentLoading}
            />
          </div>
          <div className="flex gap-2 w-full justify-end">
            <Button
              size={'customBlank'}
              variant={'secondary'}
              onClick={handleClosePaymentModal}
              className="text-base px-2 py-1 lg:text-lg"
              disabled={isPaymentLoading}
            >
              Cancel
            </Button>
            <AsyncButton
              className="text-base px-2 py-1 lg:text-lg"
              onClick={handlePay}
              isLoading={isPaymentLoading}
            >
              Continue
            </AsyncButton>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CheckoutPaymentOption;
