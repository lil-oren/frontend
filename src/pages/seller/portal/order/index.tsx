import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { withBasePath } from '@/lib/nextUtils';
import Divider from '@/components/Divider/Divider';
import SellerLayout from '@/components/SellerLayout/SellerLayout';
import SellerOrderCard from '@/components/SellerOrderCard/SellerOrderCard';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import { useSeller } from '@/store/seller/useSeller';
import { NextPageWithLayout } from '@/pages/_app';
import styles from './SellerPortalOrder.module.scss';
import EmptyNotify from '@/components/EmptyNotify/EmptyNotify';
import PaginationNav from '@/components/PaginationNav/PaginationNav';

const data = [
  {
    id: 1,
    label: 'All Order',
    status: '',
    href: '/seller/portal/order?page=1',
  },
  {
    id: 2,
    label: 'New Order',
    status: 'NEW',
    href: '/seller/portal/order?status=NEW&page=1',
  },
  {
    id: 3,
    label: 'Ready to Ship',
    status: 'PROCESS',
    href: '/seller/portal/order?status=PROCESS&page=1',
  },
  {
    id: 4,
    label: 'In Delivery',
    status: 'DELIVER',
    href: '/seller/portal/order?status=DELIVER&page=1',
  },
  {
    id: 5,
    label: 'Arrived',
    status: 'ARRIVE',
    href: '/seller/portal/order?status=ARRIVE&page=1',
  },
  {
    id: 6,
    label: 'Completed',
    status: 'RECEIVE',
    href: '/seller/portal/order?status=RECEIVE&page=1',
  },
  {
    id: 7,
    label: 'Cancelled',
    status: 'CANCEL',
    href: '/seller/portal/order?status=CANCEL&page=1',
  },
];

const SellerPortalOrder: NextPageWithLayout = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [currentPage, setCurrentPage] = useState(1);
  const fetchSellerOrders = useSeller.use.fetchSellerOrders();
  const seller_orders = useSeller.use.seller_orders();
  const loading_fetch_seller_orders =
    useSeller.use.loading_fetch_seller_orders();
  const seller_current_page = useSeller.use.seller_current_page();
  const router = useRouter();

  const handleChangeStatus = useCallback(async () => {
    const param = new URLSearchParams(searchParams);
    setCurrentPage(1);
    if (status === '' || status === null) {
      param.set('page', '1');
    } else {
      param.set('status', status);
      param.set('page', '1');
    }
    router.replace(`/seller/portal/order?${param.toString()}`);
    fetchSellerOrders(param.toString());
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [status, fetchSellerOrders]);

  const handleChangePage = useCallback(() => {
    const param = new URLSearchParams(searchParams);
    if (status === '' || status === null) {
      param.set('page', currentPage.toString());
    } else {
      param.set('page', currentPage.toString());
      param.set('status', status);
    }
    router.replace(`/seller/portal/order?${param.toString()}`);
    fetchSellerOrders(param.toString());
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage, status, fetchSellerOrders]);

  useEffect(() => {
    handleChangeStatus();
    if (seller_current_page) {
      router.push(`/seller/portal/order?status=${seller_current_page}&page=1`);
    }
  }, [handleChangeStatus, seller_current_page]);

  useEffect(() => {
    handleChangePage();
  }, [handleChangePage]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>LilOren | Seller Order</title>
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
      <div className={`${styles.sellerPortalOrder}`}>
        {loading_fetch_seller_orders ? (
          <div className="w-[85vw] sm:w-[45vw] md:w-[47vw] lg:w-[65vw]">
            <DotsLoading />
          </div>
        ) : seller_orders.order_data.length === 0 ? (
          <div className="flex justify-center pt-5 h-full w-[100vw] sm:w-[45vw] md:w-[47vw] lg:w-[65vw]">
            <EmptyNotify message={'No Order Data Available'} />
          </div>
        ) : (
          <div className={`${styles.page_order}`}>
            <section className="w-[85vw] sm:w-[45vw] md:w-[47vw] lg:w-[65vw]">
              <Divider />
              {seller_orders.order_data.map((order_data, index) => (
                <SellerOrderCard
                  key={`key:${index.toString()}-${order_data.status}`}
                  order_data={order_data}
                  total_products={order_data.products.length}
                  index={index}
                />
              ))}
            </section>
          </div>
        )}
        <div className="flex justify-end w-[85vw] sm:w-[45vw] md:w-[47vw] lg:w-[65vw]">
          <PaginationNav
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={seller_orders.total_page}
          />
        </div>
      </div>
    </>
  );
};

SellerPortalOrder.getLayout = function getLayout(page: ReactElement) {
  return (
    <SellerLayout tabData={data} header="Order List">
      {page}
    </SellerLayout>
  );
};

export default SellerPortalOrder;
