import React, { ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { NextPageWithLayout } from '../../_app';
import { withBasePath } from '@/lib/nextUtils';
import RegisterSeller from '../../../../public/seller-portal.svg';
import { Button } from '@/components/ui/button';
import styles from './SellerOnboarding.module.scss';
import BackButton from '@/components/BackButton/BackButton';
import SellerOnboardingLayout from '@/components/SellerOnboardingLayout/SellerOnboardingLayout';

const START_REGISTERED =
  'To get started, register as a seller by providing the necessary information.';

const WELCOME_TO_LILOREN = 'Welcome to LilOren!';

const SellerOnboarding: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <div className="lg:h-[100vh] lg:flex lg:flex-col lg:gap-8 lg:pt-5">
      <div className="lg:bg-white">
        <div className={styles.seller_portal_header}>
          <Image
            src={RegisterSeller}
            width={500}
            height={500}
            alt={'start-registered-as-seller'}
            className="lg:rounded-2xl w-full sm:w-[300px] md:w-[350px] md:lg:w-[300px]"
          />
          <div className="w-[300px] mt-8">
            <p className="font-ligt text-center">{START_REGISTERED}</p>
          </div>
        </div>
      </div>
      <div
        className={`hidden w-full items-center justify-center lg:flex lg:pt-4`}
      >
        <Button
          className="w-[200px]"
          type="submit"
          variant={'default'}
          onClick={() => router.push('/seller/onboarding/form')}
        >
          {'Start Registration'}
        </Button>
      </div>
      <div className={styles.button_wrapper}>
        <Button
          className="w-full"
          type="submit"
          variant={'default'}
          onClick={() => router.push('/seller/onboarding/form')}
        >
          {'Start Registration'}
        </Button>
      </div>
    </div>
  );
};

const SellerOnboardingHeading = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>LilOren Seller Center</title>
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
      <div className="lg:hidden SellerOnboarding__navbar w-[100%] min-w-auto flex items-center top-0 h-[52px] border-b-[1px] sticky bg-white">
        <BackButton
          icon={<ArrowLeft size={24} className="text-primary" />}
          onClick={() => router.push('/')}
        />
        <div>
          <p className="user__address__heading block relative font-medium m-0 text-[16px]">
            {WELCOME_TO_LILOREN}
          </p>
        </div>
      </div>
    </>
  );
};

SellerOnboarding.getLayout = function getLayout(page: ReactElement) {
  return (
    <SellerOnboardingLayout component={<SellerOnboardingHeading />}>
      {page}
    </SellerOnboardingLayout>
  );
};

export default SellerOnboarding;
