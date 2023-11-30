import React, { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { IProductDiscountResponse } from '@/interface/productDiscount';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';
import { withBasePath } from '@/lib/nextUtils';
import SellerLayout from '@/components/SellerLayout/SellerLayout';
import Head from 'next/head';
import ProductDiscountForm from '@/components/ProductDiscountForm/ProductDiscountForm';
import DotsLoading from '@/components/DotsLoading/DotsLoading';

const ProductDiscountPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productDiscount, setProductDiscount] =
    useState<IProductDiscountResponse>();

  useEffect(() => {
    async function getProductDiscount() {
      if (router.query.productCode === undefined) return;
      setIsLoading(true);
      try {
        const response = await axiosInstance(
          `/merchant/product/discount/${router.query.productCode}`,
        );
        setProductDiscount(response.data.data);
      } catch (error) {
        Utils.handleGeneralError(error);
      } finally {
        setIsLoading(false);
      }
    }
    getProductDiscount();
  }, [router]);

  return (
    <>
      <Head>
        <title>Product Discount - LilOren</title>
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
      <section className="bg-white rounded-xl p-8 shadow-lg w-[70vw] flex flex-col gap-8">
        {isLoading ? (
          <DotsLoading />
        ) : (
          <ProductDiscountForm
            productDiscount={productDiscount}
            productCode={router.query.productCode as string}
          />
        )}
      </section>
    </>
  );
};

ProductDiscountPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <SellerLayout header="Product Discount (discount cannot be empty or more than 99)">
      {page}
    </SellerLayout>
  );
};

export default ProductDiscountPage;
