import React, {
  Dispatch,
  SetStateAction,
  FormEventHandler,
  useState,
} from 'react';
import { ToastContent } from 'react-toastify';
import axiosInstance from '@/lib/axiosInstance';
import { Utils } from '@/utils';
import CONSTANTS from '@/constants/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AsyncButton from '@/components/AsyncButton/AsyncButton';

interface EditEmailFormProps {
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
}

const EditEmailForm = ({ userEmail, setUserEmail }: EditEmailFormProps) => {
  const [isLoadingChangeEmail, setIsLoadingChangeEmail] =
    useState<boolean>(false);
  const handleSubmitChangeEmail: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    setIsLoadingChangeEmail(true);
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: `${CONSTANTS.BASEURL}/auth/change-email`,
        data: {
          email: userEmail,
        },
      });
      if (response.status === 200) {
        Utils.notify(
          'success change email' as ToastContent,
          'success',
          'light',
        );
      }
    } catch (error: any) {
      Utils.notify(error.message as ToastContent, 'error', 'light');
    }

    setIsLoadingChangeEmail(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmitChangeEmail}>
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
            <DialogDescription>
              Make changes to your email here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="name"
                value={userEmail}
                className="col-span-3"
                type={'email'}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            {isLoadingChangeEmail ? (
              <AsyncButton isLoading={true}>{'Save changes'}</AsyncButton>
            ) : (
              <Button type="submit">Save changes</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmailForm;
