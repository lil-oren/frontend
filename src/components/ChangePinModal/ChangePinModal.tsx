import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import PinInput from '../PinInput/PinInput';
import { Button } from '../ui/button';
import AsyncButton from '../AsyncButton/AsyncButton';
import styles from './ChangePinModal.module.scss';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';

interface ChangePinModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateToggle?: Dispatch<SetStateAction<boolean>>;
}

const ChangePinModal = ({
  isOpen,
  setIsOpen,
  setUpdateToggle,
}: ChangePinModalProps) => {
  const [password, setPassword] = useState<string>('');
  const [pin, setPin] = useState<string[]>(new Array(6).fill(''));
  const [confirmPin, setConfirmPin] = useState<string[]>(new Array(6).fill(''));
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isPINValid, setIsPINValid] = useState<boolean>(true);
  const [isConfirmPINValid, setIsConfirmPINValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function findNonNumber(): boolean {
    for (let i = 0; i < pin.length; i++) {
      if (!/[0-9]/gi.test(pin[i])) {
        return false;
      }
    }
    return true;
  }

  function validate(): boolean {
    let isContinue = true;
    if (password === '') {
      isContinue = false;
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
    if (pin.includes('') || !findNonNumber()) {
      isContinue = false;
      setIsPINValid(false);
    } else {
      setIsPINValid(true);
    }
    if (!pin.every((pin, index) => pin === confirmPin[index])) {
      isContinue = false;
      setIsConfirmPINValid(false);
    } else {
      setIsConfirmPINValid(true);
    }
    return isContinue;
  }

  function closeModal() {
    setPassword('');
    setIsPasswordValid(true);
    setPin(new Array(6).fill(''));
    setIsPINValid(true);
    setConfirmPin(new Array(6).fill(''));
    setIsConfirmPINValid(true);
    setIsOpen(false);
  }

  async function handleChangePIN() {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const reqBody = {
        password: password,
        wallet_pin: pin.join(''),
      };
      await axiosInstance.put(`/wallets/change-pin`, reqBody);
      if (setUpdateToggle !== undefined) {
        setUpdateToggle((prev) => !prev);
      }
      Utils.notify('Successfully changed your pin', 'success', 'colored');
      closeModal();
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm text-center sm:text-base">
            Change PIN
          </AlertDialogTitle>
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="w-full space-y-3 flex flex-col items-start">
              <Label
                className={`w-full text-left font-semibold text-xs sm:text-sm ${
                  isPasswordValid
                    ? 'text-black'
                    : `text-destructive ${styles.wiggleDiv}`
                }`}
                htmlFor="password"
              >
                Please put in your account&apos;s password
                <span className="text-primary">{' *'}</span>
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isValid={isPasswordValid}
                disabled={isLoading}
              />
            </div>
            <div className="w-full space-y-3 flex flex-col justify-center items-center">
              <Label
                className={`w-full text-left font-semibold text-xs sm:text-sm ${
                  isPasswordValid
                    ? 'text-black'
                    : `text-destructive ${styles.wiggleDiv}`
                }`}
              >
                {isPINValid
                  ? 'Please put in your new PIN'
                  : 'PIN must be 6 digits!'}
                <span className="text-primary">{' *'}</span>
              </Label>
              <PinInput
                pins={pin}
                setPins={setPin}
                onEnter={handleChangePIN}
                isLoading={isLoading}
              />
            </div>
            <div className="w-full space-y-3 flex flex-col justify-center items-center">
              <Label
                className={`w-full text-left font-semibold text-xs sm:text-sm ${
                  isConfirmPINValid
                    ? 'text-black'
                    : `text-destructive ${styles.wiggleDiv}`
                }`}
              >
                {isConfirmPINValid
                  ? 'Confirm your PIN'
                  : 'Confirm PIN must be the same with PIN!'}
                <span className="text-primary">{' *'}</span>
              </Label>
              <PinInput
                pins={confirmPin}
                setPins={setConfirmPin}
                onEnter={handleChangePIN}
                isLoading={isLoading}
              />
            </div>
            <div className="w-full flex justify-end items-center gap-3">
              <Button
                size={'customBlank'}
                variant={'destructive'}
                className="text-sm px-2 py-1 sm:text-base"
                disabled={isLoading}
                onClick={closeModal}
              >
                Cancel
              </Button>
              <AsyncButton
                variant={'outline'}
                size={'customBlank'}
                className="text-sm px-2 py-1 sm:text-base"
                isLoading={isLoading}
                onClick={handleChangePIN}
              >
                Change PIN
              </AsyncButton>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangePinModal;
