import React, { Dispatch, SetStateAction, useState } from 'react';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PinInput from '@/components/PinInput/PinInput';
import styles from './ActivatePinWarning.module.css';
import AsyncButton from '../AsyncButton/AsyncButton';
import { Button } from '../ui/button';
import axiosInstance from '@/lib/axiosInstance';
import CONSTANTS from '@/constants/constants';

import { Utils } from '@/utils';

interface ActivatePinWarningProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateToggle?: Dispatch<SetStateAction<boolean>>;
}

const ActivatePinWarning = ({
  isOpen,
  setIsOpen,
  setUpdateToggle,
}: ActivatePinWarningProps) => {
  const [pins, setPins] = useState<string[]>(new Array(6).fill(''));
  const [isPINValid, setIsPINValid] = useState<boolean>(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmPins, setConfirmPins] = useState<string[]>(
    new Array(6).fill(''),
  );
  const [isConfirmValid, setIsConfirmValid] = useState<boolean>(true);
  const [isConfirmLoading, setIsConfirmLoading] = useState<boolean>(false);

  function findNonNumber(): boolean {
    for (let i = 0; i < pins.length; i++) {
      if (!/[0-9]/gi.test(pins[i])) {
        return false;
      }
    }
    return true;
  }

  function handleActivatePIN() {
    if (pins.includes('') || !findNonNumber()) {
      setIsPINValid(false);
    } else {
      setIsPINValid(true);
      setIsOpen(false);
      setIsConfirmOpen(true);
    }
  }

  function handleGoBack() {
    setIsConfirmValid(true);
    setIsConfirmOpen(false);
    setIsOpen(true);
  }

  function handleCancelActivatePin() {
    setPins(new Array(6).fill(''));
    setConfirmPins(new Array(6).fill(''));
    setIsPINValid(true);
    setIsConfirmValid(true);
    setIsConfirmOpen(false);
    setIsOpen(false);
  }

  async function handleConfirmPIN() {
    if (!pins.every((pin, index) => pin === confirmPins[index])) {
      setIsConfirmValid(false);
      return;
    }
    setIsConfirmValid(true);
    setIsConfirmLoading(true);
    try {
      const response = await axiosInstance.put(
        `${CONSTANTS.BASEURL}/wallets/personal/activate`,
        {
          wallet_pin: pins.join(''),
        },
      );
      Utils.notify('Successfully set up your pin', 'success', 'colored');
      if (setUpdateToggle !== undefined) {
        setUpdateToggle((prev) => !prev);
      }
      setIsConfirmOpen(false);
    } catch (error: any) {
      Utils.handleGeneralError(error);
    } finally {
      setIsConfirmLoading(false);
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger>
          <div
            className={`bg-destructive text-destructive-foreground px-2 py-1 rounded-lg flex items-center gap-1 ${styles.wiggleDiv}`}
          >
            <AlertTriangle className="h-5 w-5" />
            Activate Pin
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm text-center sm:text-base">
              You haven&apos;t activate your PIN
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center sm:text-base">
              Activate your PIN to start using MyWallet
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex flex-col items-center justify-center gap-3">
            {!isPINValid && (
              <p
                className={`w-full text-center font-semibold text-destructive text-sm sm:text-base ${styles.wiggleOnce}`}
              >
                PIN must be 6 digits!
              </p>
            )}
            <PinInput
              pins={pins}
              setPins={setPins}
              onEnter={handleActivatePIN}
            />
          </div>
          <div className="flex justify-end items-center gap-3">
            <Button
              size={'customBlank'}
              variant={'destructive'}
              onClick={handleCancelActivatePin}
              className="text-sm px-2 py-1 sm:text-base"
            >
              Cancel
            </Button>
            <AsyncButton
              onClick={handleActivatePIN}
              variant={'outline'}
              size={'customBlank'}
              className="text-sm px-2 py-1 sm:text-base"
            >
              Continue
            </AsyncButton>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full">
              <Button
                variant={'outline'}
                size={'customBlank'}
                className="text-sm p-1 sm:text-base"
                onClick={handleGoBack}
                disabled={isConfirmLoading}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" /> Back
              </Button>
            </div>
            {!isConfirmValid ? (
              <p
                className={`w-full text-center font-semibold text-destructive text-sm sm:text-base ${styles.wiggleOnce}`}
              >
                Must be the same with the initial PIN!
              </p>
            ) : (
              <p
                className={`w-full text-center font-semibold text-sm sm:text-base`}
              >
                Confirm PIN:
              </p>
            )}
            <PinInput
              pins={confirmPins}
              setPins={setConfirmPins}
              onEnter={handleConfirmPIN}
              isLoading={isConfirmLoading}
            />
          </div>
          <AlertDialogFooter className="w-full">
            <AsyncButton
              onClick={handleConfirmPIN}
              variant={'outline'}
              isLoading={isConfirmLoading}
              className="text-base w-full"
            >
              Confirm Pin
            </AsyncButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActivatePinWarning;
