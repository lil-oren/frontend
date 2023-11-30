import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useOnClickOutside } from 'usehooks-ts';
import classNames from 'classnames';
import DefaultNavbarItems from './DefaultNavbarItems';
import { withBasePath } from '@/lib/nextUtils';
import { useUser } from '@/store/user/useUser';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '../ui/label';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';
import AsyncButton from '../AsyncButton/AsyncButton';
import styles from './SellerLayout.module.scss';
import PinInput from '../PinInput/PinInput';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

interface SidebarProps {
  open: boolean;
  navItems?: NavItem[];
  setOpen: (open: boolean) => void;
}

const Sidebar = ({
  open,
  navItems = DefaultNavbarItems,
  setOpen,
}: SidebarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const user_details = useUser.use.user_details();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const router = useRouter();

  useOnClickOutside(ref, (e) => {
    setOpen(false);
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [isBalanceOpen, setIsBalanceOpen] = useState<boolean>(false);
  const [isBalanceOpenLoading, setIsBalanceOpenLoading] =
    useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  async function handleOpenBalance() {
    setIsBalanceOpenLoading(true);
    try {
      const response = await axiosInstance(`/wallets/shop`);
      setBalance(response.data.data.balance);
      setIsBalanceOpen(true);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsBalanceOpenLoading(false);
    }
  }
  const [withdrawal, setWithdrawal] = useState<number | ''>(0);
  const [isWithdrawalLoading, setIsWithdrawalLoading] =
    useState<boolean>(false);
  const [pins, setPins] = useState<string[]>(new Array(6).fill(''));

  function handleWithdrawalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value === '') {
      setWithdrawal(value);
      return;
    }
    const valNum = parseInt(value);
    if (isNaN(valNum) || valNum < 0) {
      setWithdrawal(0);
    } else {
      setWithdrawal(valNum);
    }
  }

  function handleNumKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
  }

  function closeBalance() {
    setWithdrawal(0);
    setIsBalanceOpen(false);
    setPins(new Array(6).fill(''));
  }

  function findNonNumber(): boolean {
    for (let i = 0; i < pins.length; i++) {
      if (!/[0-9]/gi.test(pins[i])) {
        return false;
      }
    }
    return true;
  }

  async function handleWithdrawal() {
    if (withdrawal === '' || withdrawal < 10000) {
      Utils.notify(
        'Withdrawal cannot be empty or less than 10.000',
        'info',
        'colored',
      );
      return;
    }
    if (withdrawal > balance) {
      Utils.notify('Cannot withdraw more than balance', 'info', 'colored');
      return;
    }
    if (pins.includes('') || !findNonNumber()) {
      Utils.notify('Please enter the valid PIN', 'info', 'colored');
      return;
    }
    setIsWithdrawalLoading(true);
    try {
      const stepUp = {
        wallet_pin: pins.join(''),
      };
      await axiosInstance.post('/auth/payment-token', stepUp);
      const reqBody = {
        amount: withdrawal,
      };
      await axiosInstance.post(`/wallets/personal/withdraw`, reqBody);
      Utils.notify(
        'Withdrawal success, please check MyWallet',
        'success',
        'colored',
      );
      closeBalance();
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsWithdrawalLoading(false);
    }
  }

  return (
    <>
      <div
        className={classNames({
          'flex flex-col justify-between': true,
          'bg-white text-primary': true,
          'md:w-full md:sticky md:top-16 md:z-0 top-0 z-20 fixed': true,
          'md:h-[calc(100vh_-_64px)] h-full w-[300px]': true,
          'transition-transform .3s ease-in-out md:translate-x-0': true,
          '-translate-x-full ': !open,
        })}
        ref={ref}
      >
        <nav className="md:sticky top-0 md:top-16">
          <ul className="py-2 flex flex-col gap-2">
            {navItems.map((item, index) => {
              return (
                <Link key={`key:${index.toString()}`} href={item.href}>
                  <li
                    className={classNames({
                      'text-primary hover:text-white hover:bg-primary': true,
                      'flex gap-4 items-center ': true,
                      'transition-colors duration-300': true,
                      'rounded-md p-2 mx-2': true,
                      'bg-primary text-white':
                        router.pathname === item.href ||
                        router.pathname === `${item.href}/shipment` ||
                        router.pathname === `${item.href}/create` ||
                        router.pathname.includes(`${item.href}?`),
                    })}
                  >
                    {item.icon} {item.label}
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
        <div className="w-full flex justify-center items-center flex-col gap-5">
          <AsyncButton
            isLoading={isBalanceOpenLoading}
            onClick={handleOpenBalance}
          >
            Withdraw Balance
          </AsyncButton>
          <Link href="/wallet">MyWallet</Link>
        </div>
        <div className="border-t border-t-primary p-4 bg-primary-foreground">
          <div className="flex gap-4 items-center">
            <Image
              src={withBasePath('blank-profile.webp')}
              height={36}
              width={36}
              alt="profile image"
              className="rounded-full"
            />
            <div className="flex flex-col ">
              <span className="text-primary my-0 font-semibold">
                {user_details.username}
              </span>
              <Link
                href="/user?status=Info"
                className="text-muted-foreground text-sm"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm">
              Shop Balance:
            </AlertDialogTitle>
            <AlertDialogDescription className="text-primary font-semibold text-lg">
              {Utils.convertPrice(balance)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex flex-col justify-center gap-3 max-w-sm mx-auto">
            <div className="w-full space-y-1">
              <Label
                className="text-base font-semibold"
                htmlFor="widthdrawal-input"
              >
                Withdrawal amount
              </Label>
              <Input
                id="widthdrawal-input"
                disabled={isWithdrawalLoading}
                min={0}
                value={withdrawal}
                onChange={(e) => handleWithdrawalChange(e)}
                type="number"
                onKeyDown={(e) => handleNumKeyDown(e)}
                onWheel={(e) => e.currentTarget.blur()}
                className={styles.hideIndicator}
              />
            </div>
            <div className="w-full space-y-1 flex items-center justify-center flex-col">
              <Label className="text-base font-semibold w-full text-left">
                Enter your PIN
              </Label>
              <PinInput
                isLoading={isWithdrawalLoading}
                onEnter={handleWithdrawal}
                pins={pins}
                setPins={setPins}
              />
            </div>
          </div>
          <div className="w-full flex justify-end gap-2">
            <Button
              disabled={isWithdrawalLoading}
              onClick={closeBalance}
              variant={'outline'}
            >
              Close
            </Button>
            <AsyncButton
              isLoading={isWithdrawalLoading}
              onClick={handleWithdrawal}
            >
              Withdraw
            </AsyncButton>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
