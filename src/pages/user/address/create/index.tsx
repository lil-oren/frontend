import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';
import { withBasePath } from '@/lib/nextUtils';
import BackButton from '@/components/BackButton/BackButton';
import UserSettingsLayout from '@/components/UserSettingsLayout/UserSettingsLayout';
import AddAddressForm from '@/components/AddAddressForm/AddAddressForm';

const ADDRESS_DETAILS = 'Address Details';

const UserAddressCreate = () => {
  return (
    <div className="h-[90vh]">
      <AddAddressForm />
    </div>
  );
};

const UserAddressCreateHeading = () => {
  const router = useRouter();
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
      <div className="lg:hidden UserSettingsAddressCreate__navbar w-[100%] min-w-auto flex items-center top-0 h-[52px] border-b-[1px] sticky bg-white">
        <BackButton
          icon={<ArrowLeft size={24} />}
          onClick={() => router.push('/user/address?status=Address')}
        />
        <div>
          <p className="user__address__heading block relative font-medium m-0 text-[16px]">
            {ADDRESS_DETAILS}
          </p>
        </div>
      </div>
    </>
  );
};

UserAddressCreate.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserSettingsLayout
      component={<UserAddressCreateHeading />}
      currentTab={'My Bio'}
    >
      {page}
    </UserSettingsLayout>
  );
};

export default UserAddressCreate;
