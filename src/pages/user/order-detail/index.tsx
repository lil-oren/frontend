import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/_app';
import { Utils } from '@/utils';
import { withBasePath } from '@/lib/nextUtils';
import Layout from '@/components/Layout/Layout';
import axiosInstance from '@/lib/axiosInstance';
import { IOrderItem } from '@/interface/orderDetailPage';
import BuyerOrderDetailCard from '@/components/BuyerOrderDetailCard/BuyerOrderDetailCard';
import PaginationNav from '@/components/PaginationNav/PaginationNav';
import { useSearchParams } from 'next/navigation';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import OrderDetailLayout from '@/components/OrderDetailLayout/OrderDetailLayout';

const OrderDetailPage: NextPageWithLayout = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [orderItems, setOrderItems] = useState<IOrderItem[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);

  const handleChangeStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance(
        `/orders?${
          status === '' || status === null
            ? 'page=1'
            : `page=1&status=${status}`
        }`,
      );
      setOrderItems(response.data.data.order);
      setTotalPage(response.data.data.pagination.total_page);
      setCurrentPage(1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const handleChangePage = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance(
        `/orders?${
          status === '' || status === null
            ? `page=${currentPage}`
            : `page=${currentPage}&status=${status}`
        }`,
      );
      setOrderItems(response.data.data.order);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleChangePage();
  }, [currentPage, updateToggle]);

  useEffect(() => {
    handleChangeStatus();
  }, [handleChangeStatus]);
  return (
    <>
      <Head>
        <title>Order Detail - LilOren</title>
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
      <section className="w-full bg-white">
        <div
          className={`w-full md:w-[75vw] lg:px-2 pb-5 flex flex-col mx-auto`}
        >
          {isLoading ? (
            <>
              <DotsLoading />
            </>
          ) : (
            <>
              <div className="w-full pb-2">
                {orderItems !== undefined && orderItems.length !== 0 ? (
                  orderItems.map((orderItem, index) => (
                    <BuyerOrderDetailCard
                      key={index}
                      orderItem={orderItem}
                      setUpdateToggle={setUpdateToggle}
                    />
                  ))
                ) : (
                  <p className="w-full text-center py-2 text-lg">No Order</p>
                )}
              </div>
              <div className="w-full flex items-center justify-center mt-3">
                <PaginationNav
                  totalPage={totalPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <OrderDetailLayout>{page}</OrderDetailLayout>
    </Layout>
  );
};

export default OrderDetailPage;
