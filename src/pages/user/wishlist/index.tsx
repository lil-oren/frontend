import React, { ReactElement, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { withBasePath } from '@/lib/nextUtils';
import { NextPageWithLayout } from '@/pages/_app';
import BackButton from '@/components/BackButton/BackButton';
import UserSettingsLayout from '@/components/UserSettingsLayout/UserSettingsLayout';
import { useWishlist } from '@/store/wishlist/useWishlist';
import EmptyWishlist from '@/components/EmptyWishlist/EmptyWishlist';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import WishlistProductCard from '@/components/WishlistProductCard/WishlistProductCard';

const UserWishlist: NextPageWithLayout = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const user_wishlist = useWishlist.use.user_wishlist();
  const fetchUserWishlist = useWishlist.use.fetchUserWishlist();
  const loading_fetch_user_wishlist =
    useWishlist.use.loading_fetch_user_wishlist();

  const handleChangePage = useCallback(async () => {
    let params = 0;
    if (page === '' || page === null) {
      params = currentPage;
    }
    fetchUserWishlist({ page: params });
  }, [currentPage]);

  useEffect(() => {
    handleChangePage();
  }, [handleChangePage]);

  useEffect(() => {
    fetchUserWishlist({ page: currentPage });
  }, [currentPage]);

  return loading_fetch_user_wishlist ? (
    <DotsLoading />
  ) : user_wishlist.items.length === 0 ? (
    <EmptyWishlist />
  ) : (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pt-4">
      {user_wishlist.items.map((item) => (
        <WishlistProductCard
          key={`key:${item.id}`}
          item={item}
          current_page={currentPage}
        />
      ))}
    </div>
  );
};

const UserWishlistHeading = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>My Wishlist | LilOren</title>
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
      <div className="lg:hidden UserWishlist__navbar w-[100%] min-w-auto flex items-center top-0 h-[52px] border-b-[1px] sticky bg-white">
        <BackButton
          id="back-button"
          icon={<ArrowLeft size={24} />}
          onClick={() => router.push('/user')}
        />
        <div>
          <p className="user__wishlist__heading block relative font-medium m-0 text-[16px]">
            {'My Wishlist'}
          </p>
        </div>
      </div>
    </>
  );
};

UserWishlist.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserSettingsLayout
      currentTab="My Wishlist"
      component={<UserWishlistHeading />}
    >
      {page}
    </UserSettingsLayout>
  );
};

export default UserWishlist;
