import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/_app';
import { withBasePath } from '@/lib/nextUtils';
import SellerLayout from '@/components/SellerLayout/SellerLayout';
import { useUser } from '@/store/user/useUser';

const SellerHome: NextPageWithLayout = () => {
  const user_details = useUser.use.user_details();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className="h-[100vh]">
      <Head>
        <meta charSet="UTF-8" />
        <title>{`LilOren | Seller ${user_details.shop_name}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content={'LilOren'} />
        <meta
          name="description"
          content={'LilOren is an e-commerce for everything you need'}
        />
        <meta name="og:title" content={`LilOren`} />
        <meta
          name="og:description"
          content={'LilOren is an e-commerce for everything you need'}
        />
        <meta name="og:type" content="website" />
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
    </div>
  );
};
SellerHome.getLayout = function getLayout(page: ReactElement) {
  return <SellerLayout header={'xeana'}>{page}</SellerLayout>;
};

export default SellerHome;
