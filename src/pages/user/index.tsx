import { withBasePath } from '@/lib/nextUtils';
import { authClient } from '@/service/auth/AuthClient';
import AsyncButton from '@/components/AsyncButton/AsyncButton';
import BackButton from '@/components/BackButton/BackButton';
import UserPresentation from '@/components/UserPresentation/UserPresentation';
import UserSettingsLayout from '@/components/UserSettingsLayout/UserSettingsLayout';
import FallbackImage from '@/components/FallbackImage/FallbackImage';
import EditEmailForm from '@/components/EditEmailForm/EditEmailForm';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CONSTANTS from '@/constants/constants';
import axiosInstance from '@/lib/axiosInstance';
import imageUploadder from '@/lib/imageUploadder';
import { useUser } from '@/store/user/useUser';
import { Utils } from '@/utils';
import { ArrowLeft, Heart, KeyRound, Store, Mail, LogOut } from 'lucide-react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { ToastContent } from 'react-toastify';
import { NextPageWithLayout } from '../_app';
import styles from './User.module.scss';

const User: NextPageWithLayout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const user_details = useUser.use.user_details();
  const loading_fetch_user_details = useUser.use.loading_fetch_user_details();
  const [showSetAddressModal, setShowSetAddressModal] =
    useState<boolean>(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [userTempImg, setTempUserImg] = useState<File>();
  const [userImg, setUserImg] = useState<string>('');
  const [loadingUploadImage, setLoadingUploadImage] = useState<boolean>(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState<boolean>(false);
  const [isChangeWishlistLoading, setIsChangeWishlistLoading] =
    useState<boolean>(false);
  const [isChangeAddressLoading, setIsChangeAddressLoading] =
    useState<boolean>(false);
  const [isChangeOpenLoading, setIsChangeOpenLoading] =
    useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isChangePassLoading, setIsChangePassLoading] =
    useState<boolean>(false);

  const [userEmail, setUserEmail] = useState(user_details.email);

  const handleAddPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoadingUploadImage(true);
    if (e.target.files !== null) {
      const selectedFiles = e.target.files;
      setTempUserImg(selectedFiles[0]);
      const response = await imageUploadder(selectedFiles[0]);
      try {
        const responseUpload = await axiosInstance({
          method: 'PUT',
          url: `${CONSTANTS.BASEURL}/profile/picture`,
          data: {
            image_url: response,
          },
        });
        if (responseUpload.status === 200) {
          setUserImg(response);
          Utils.notify(
            'success upload picture' as ToastContent,
            'success',
            'light',
          );
        }
      } catch (error) {
        Utils.notify('failed upload picture' as ToastContent, 'error', 'light');
      }
    }
    fetchUserDetails();
    console.log(user_details);

    setLoadingUploadImage(false);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await authClient.logout();
    router.reload();
    setLoadingLogout(true);
  };

  const handleOpenAddress = () => {
    setIsChangeAddressLoading(true);
    router.push('/user/address?status=Address');
  };

  const handleOpenWishlit = () => {
    setIsChangeWishlistLoading(true);
    router.push('/user/wishlist');
  };

  async function handleOpenChangePassword() {
    setIsChangeOpenLoading(true);
    try {
      await axiosInstance.post('/auth/change-password/request');
      setIsChangePassOpen(true);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsChangeOpenLoading(false);
    }
  }

  async function handleCloseChangePass() {
    setIsChangePassOpen(false);
    setOtp('');
    setNewPassword('');
  }

  async function changePass() {
    if (/^\s+$/.test(otp) || otp === '') {
      Utils.notify('OTP cannot be empty', 'info', 'colored');
      return;
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (!passwordRegex.test(newPassword)) {
      Utils.notify(
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and with a minimum of 8 characters',
        'info',
        'colored',
      );
      return;
    }
    setIsChangePassLoading(true);
    try {
      const reqBody = { verif_code: otp, password: newPassword };
      await axiosInstance.post('/auth/change-password', reqBody);
      Utils.notify('Succesfully changed password', 'success', 'colored');
      handleCloseChangePass();
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsChangePassLoading(false);
    }
  }

  useEffect(() => {
    if (status === '' || status === null) {
      fetchUserDetails();
      setUserEmail(user_details.email);
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    fetchUserDetails();
    setUserEmail(user_details.email);
  }, [fetchUserDetails, status]);

  return (
    <>
      <Head>
        <title>Jual Beli Online Aman dan Nyaman | LilOren</title>
        <meta
          data-rh="true"
          name="viewport"
          content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width"
        />
        <meta data-rh="true" property="site_name" content="LilOren" />
        <meta
          data-rh="true"
          property="title"
          content="Jual Beli Online Aman dan Nyaman | LilOren"
        />
        <meta
          data-rh="true"
          name="description"
          content="Mal online terbesar Indonesia, tempat berkumpulnya toko / online shop terpercaya se Indonesia. Jual beli online semakin aman dan nyaman di LilOren."
        ></meta>
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <div className="lg:flex lg:justify-center lg:items-center w-[100vw] bg-white">
        <div className="bg-accent flex flex-col justify-start h-[calc(100vh-52px)] lg:w-[75vw] lg:p-4 lg:bg-transparent lg:hidden">
          <UserPresentation />
          <div className="lilOren__user__setting pt-[17px] bg-white lg:bg-transparent lg:w-[350px] lg:hidden">
            <span id="account-setting-section" className="font-bold px-4">
              {'Account Settings'}
            </span>
            <ul className="lilOren__user__account__setting__list mt-[5px]">
              <UserSetting
                title={'My Address'}
                icon={<Store />}
                description={'Set the shop delivery address'}
                onClick={() => handleOpenAddress()}
                loading={isChangeAddressLoading}
              />
              <UserSetting
                title={'My Wishlist'}
                icon={<Heart />}
                description={''}
                onClick={() => handleOpenWishlit()}
                loading={isChangeWishlistLoading}
              />
              <UserSetting
                title={'Change Password'}
                icon={<KeyRound />}
                description={'Change your password'}
                onClick={handleOpenChangePassword}
                loading={isChangeOpenLoading}
              />
            </ul>
          </div>
          <div className="h-[10px] bg-transparent"></div>
          <ul className="lilOren__user__account__setting__list bg-white">
            <UserSetting
              title={'Logout'}
              icon={<LogOut />}
              onClick={handleLogout}
              loading={loadingLogout}
              description={''}
            />
          </ul>
        </div>
      </div>
      <div className="relative hidden lg:flex flex-row gap-4">
        <div className="flex flex-col w-fit">
          <div className="p-2 border-[1px] shadow-md rounded-lg w-fit m-3">
            <FallbackImage
              src={`${
                user_details.profile_picture_url
                  ? user_details.profile_picture_url
                  : withBasePath('/blank-profile.webp')
              }`}
              alt={'user__profpic'}
              className={'h-[200px] w-[200px]'}
              width={200}
              height={200}
            />

            <label
              className="flex flex-col justify-center items-center h-[200px] w-[200px] gap-2 duration-500 before:ease-in-out after:ease-in-out hover:text-white s lg:h-[50px] lg:w-[200px] cursor-pointer top-0 mt-2 rounded-lg"
              htmlFor={`user-profile`}
            >
              {loadingUploadImage ? (
                <AsyncButton
                  isLoading={true}
                  variant={'outline'}
                  className="w-full"
                >
                  {'Change Password'}
                </AsyncButton>
              ) : (
                <p className="w-full border-[1px] border-muted-foreground/50 rounded-lg py-3 text-center text-[14px] text-muted-foreground font-semibold">
                  {'Chooose Photo'}
                </p>
              )}
            </label>
            <input
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                handleAddPhoto(e);
                e.target.value = '';
              }}
              type="file"
              id={`user-profile`}
              hidden
            />
          </div>
          <div className="button w-full px-3 ">
            {isChangeOpenLoading ? (
              <AsyncButton
                isLoading={true}
                variant={'outline'}
                className="w-full"
              >
                <KeyRound className="mr-4" /> {'Change Password'}
              </AsyncButton>
            ) : (
              <Button
                className="w-full font-bold text-muted-foreground border-[1px] border-muted-foreground/50"
                variant={'outline'}
                onClick={handleOpenChangePassword}
              >
                <KeyRound className="mr-4" /> {'Change Password'}
              </Button>
            )}
          </div>
        </div>
        <div className="w-full p-3 text-muted-foreground">
          <div className="title text-muted-foreground font-semibold mb-3 mt-2">
            {'Profile Info'}
          </div>
          <div className="name flex flex-row gap-8 items-center mb-4 justify-normal">
            <span className="text-[16px] text-muted-foreground w-[100px]">
              {'Username'}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {user_details.username}
            </span>
          </div>
          <div className="name flex flex-row gap-8 items-center mb-4 justify-normal">
            <span className="text-[16px] text-muted-foreground w-[100px]">
              {'Email'}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {user_details.email}
            </span>
            <EditEmailForm userEmail={userEmail} setUserEmail={setUserEmail} />
          </div>
        </div>
      </div>
      <AlertDialog open={isChangePassOpen} onOpenChange={setIsChangePassOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              {'An OTP will be sent to your email (OTP is valid for 5 minutes)'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full space-y-3">
            <div className="w-full space-y-2">
              <Label htmlFor="otp-input">{'OTP'}</Label>
              <Input
                id="otp-input"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="new-password-input">New Password</Label>
              <Input
                id="new-password-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                {
                  'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and with a minimum of 8 characters'
                }
              </p>
            </div>
            <div className="w-full flex justify-end items-center gap-3">
              <Button onClick={handleCloseChangePass} variant={'outline'}>
                Cancel
              </Button>
              <AsyncButton
                onClick={changePass}
                variant={'default'}
                isLoading={isChangePassLoading}
              >
                Change Password
              </AsyncButton>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

User.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserSettingsLayout currentTab="Info" component={<UserHeading />}>
      {page}
    </UserSettingsLayout>
  );
};

export default User;

const UserHeading = () => {
  const router = useRouter();

  return (
    <div className="lg:hidden User__navbar w-[100%] min-w-auto flex items-center top-0 h-[52px] border-b-[1px] sticky bg-white">
      <BackButton
        icon={<ArrowLeft size={24} />}
        onClick={() => router.push('/')}
      />
      <div>
        <p className="user__address__heading block relative font-medium m-0 text-[16px]">
          {'My Profile'}
        </p>
      </div>
    </div>
  );
};

interface UserSettingProps {
  onClick: () => void;
  title: string;
  description: string;
  icon: ReactNode;
  loading?: boolean;
}

const UserSetting = ({
  onClick,
  title,
  description,
  icon,
  loading,
}: UserSettingProps) => {
  return (
    <li
      className={styles.list__item}
      onClick={() => onClick()}
      onKeyDown={() => onClick()}
    >
      {icon}
      <div className={styles.list__item__container}>
        <p className={styles.list__item__title}>{title}</p>
        <p className={styles.list__item__desc}>{description}</p>
      </div>
      {loading && (
        <div
          className={`mr-2 h-4 w-4 animate-spin border-4 border-b-primary rounded-full`}
        />
      )}
    </li>
  );
};
