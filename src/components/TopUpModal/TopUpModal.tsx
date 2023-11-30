import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PinInput from '@/components/PinInput/PinInput';
import { Button } from '../ui/button';
import AsyncButton from '../AsyncButton/AsyncButton';
import styles from './TopUpModal.module.css';
import { Input } from '../ui/input';
import { IGetPaymentToken, ITopUpRequest } from '@/interface/walletPage';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';

interface TopUpModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateToggle?: Dispatch<SetStateAction<boolean>>;
}

const TopUpModal = ({
  isOpen,
  setIsOpen,
  setUpdateToggle,
}: TopUpModalProps) => {
  const [pins, setPins] = useState<string[]>(new Array(6).fill(''));
  const [amount, setAmount] = useState<number | ''>('');
  const [isPINValid, setIsPINValid] = useState<boolean>(true);
  const [isTopUpLoading, setIsTopUpLoading] = useState<boolean>(false);

  function handleNumDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      handleTopUp();
    }
  }
  function handleAmoutnInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value === '') {
      setAmount('');
      return;
    }
    const valNum = parseInt(value);
    if (isNaN(valNum) || valNum < 0) {
      setAmount(0);
    } else {
      setAmount(valNum);
    }
  }

  function handleCancelTopUp() {
    setAmount('');
    setPins(new Array(6).fill(''));
    setIsOpen(false);
  }

  function findNonNumber(): boolean {
    for (let i = 0; i < pins.length; i++) {
      if (!/[0-9]/gi.test(pins[i])) {
        return false;
      }
    }
    return true;
  }

  function validateAll(): boolean {
    let isContinue = true;
    if (pins.includes('') || !findNonNumber()) {
      setIsPINValid(false);
      isContinue = false;
    } else {
      setIsPINValid(true);
    }
    if (amount === '' || amount < 10000) {
      isContinue = false;
      Utils.notify('Top Up must be Rp10.000 minimum', 'info', 'colored');
    }
    return isContinue;
  }

  async function handleTopUp() {
    if (!validateAll()) return;
    setIsTopUpLoading(true);
    try {
      const stepUp: IGetPaymentToken = {
        wallet_pin: pins.join(''),
      };
      await axiosInstance.post('/auth/payment-token', stepUp);
      const reqBody: ITopUpRequest = {
        wallet_pin: pins.join(''),
        amount: amount as number,
      };
      await axiosInstance.post('/wallets/personal/topup', reqBody);
      if (setUpdateToggle !== undefined) {
        setUpdateToggle((prev) => !prev);
      }
      Utils.notify('Your top up is successful', 'success', 'colored');
      handleCancelTopUp();
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsTopUpLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm text-center sm:text-base">
            Top Up
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="w-full flex flex-col items-center justify-center gap-6">
          <div className="w-full space-y-1">
            <p className="w-full text-left font-semibold text-sm sm:text-base">
              Top Up amount:
            </p>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => handleAmoutnInput(e)}
              onKeyDown={(e) => handleNumDown(e)}
              className={styles.hideIndicator}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div className="w-full space-y-1">
            {!isPINValid ? (
              <p
                className={`w-full text-center font-semibold text-destructive text-sm sm:text-base ${styles.wiggleOnce}`}
              >
                PIN must be 6 digits!
              </p>
            ) : (
              <p
                className={`w-full text-left font-semibold text-sm sm:text-base`}
              >
                Please enter your PIN:
              </p>
            )}
            <div className="w-full flex justify-center items-center">
              <PinInput
                pins={pins}
                setPins={setPins}
                onEnter={handleTopUp}
                isLoading={isTopUpLoading}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-3">
          <Button
            size={'customBlank'}
            variant={'destructive'}
            className="text-sm px-2 py-1 sm:text-base"
            onClick={handleCancelTopUp}
          >
            Cancel
          </Button>
          <AsyncButton
            variant={'outline'}
            size={'customBlank'}
            className="text-sm px-2 py-1 sm:text-base"
            isLoading={isTopUpLoading}
            onClick={handleTopUp}
          >
            Top Up
          </AsyncButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TopUpModal;
