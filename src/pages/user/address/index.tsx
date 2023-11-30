import React, { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus } from 'lucide-react';
import { IUserAddress } from '@/interface/user';
import { withBasePath } from '@/lib/nextUtils';
import UserSettingsLayout from '@/components/UserSettingsLayout/UserSettingsLayout';
import AddAddressModal from '@/components/AddAddressModal/AddAddressModal';
import BackButton from '@/components/BackButton/BackButton';
import { Button } from '@/components/ui/button';
import SkeletonUserAddress from '@/components/SkeletonUserAddress/SkeletonUserAddress';
import UserAddressCard from '@/components/UserAddressCard/UserAddressCard';
import { useUser } from '@/store/user/useUser';
import { NextPageWithLayout } from '@/pages/_app';

const MY_ADDRESSES = 'My Addresses';
const ADD_ADDRESS = 'Add Address';
const PATH_USER_ADDRESS_CREATE = '/user/address/create';

const UserSettingsAddress: NextPageWithLayout = () => {
  const loading_fetch_user_addresses =
    useUser.use.loading_ferch_user_addresses();
  const fetchUserAddresses = useUser.use.fetchUserAddresses();
  const userAddresses = useUser.use.user_addresses();
  const router = useRouter();
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, [showAddAddressModal]);
  return (
    <>
      {loading_fetch_user_addresses ? (
        <>
          <SkeletonUserAddress />
          <SkeletonUserAddress />
        </>
      ) : (
        <div className="all-address">
          <div className="pb-[60px] m-[16px] flex flex-col gap-4">
            <div className="hidden lg:flex w-full justify-end">
              <Button
                className="flex flex-row gap-2"
                onClick={() => setShowAddAddressModal(true)}
              >
                <Plus /> {ADD_ADDRESS}
              </Button>
            </div>

            {userAddresses.map((address: IUserAddress, index) => (
              <UserAddressCard
                key={`key:${String(index)} ${address.id.toString()} ${
                  address.receiver_name
                }`}
                address={address}
              />
            ))}
          </div>
          <AddAddressModal
            isVisible={showAddAddressModal}
            onClose={() => setShowAddAddressModal(false)}
            setShowModal={setShowAddAddressModal}
          />
        </div>
      )}
    </>
  );
};

const UserSettingsAddressHeading = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Address List | LilOren</title>
        <meta
          data-rh="true"
          name="viewport"
          content="initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=no, width=device-width"
        />
        <meta data-rh="true" property="site_name" content="LilOren" />
        <meta
          data-rh="true"
          name="description"
          content="Mal online terbesar Indonesia, tempat berkumpulnya toko / online shop terpercaya se Indonesia. Jual beli online semakin aman dan nyaman di LilOren."
        ></meta>
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <div className="lg:hidden UserSettingsAddress__navbar w-[100%] min-w-auto flex items-center top-0 h-[52px] border-b-[1px] sticky bg-white z-50">
        <BackButton
          id="back-button"
          icon={<ArrowLeft size={24} />}
          onClick={() => router.push('/user')}
        />
        <div>
          <p className="user__address__heading block relative font-medium m-0 text-[16px]">
            {MY_ADDRESSES}
          </p>
        </div>
        <button
          className="px-4 min-w-[fit] ml-auto inline-block text-[16px] text-primary font-medium"
          onClick={() => router.push(PATH_USER_ADDRESS_CREATE)}
        >
          {ADD_ADDRESS}
        </button>
      </div>
    </>
  );
};

UserSettingsAddress.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserSettingsLayout
      currentTab="My Addresses"
      component={<UserSettingsAddressHeading />}
    >
      {page}
    </UserSettingsLayout>
  );
};

export default UserSettingsAddress;
