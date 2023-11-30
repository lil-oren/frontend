import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { NextPageWithLayout } from '@/pages/_app';
import { withBasePath } from '@/lib/nextUtils';
import axiosInstance from '@/lib/axiosInstance';
import { ICheckout } from '@/interface/checkoutPage';
import {
  IAddress,
  ICheckoutSummary,
  ICheckoutWallet,
  IRequestOrderSummary,
  IRequestSummary,
  IResponseCheckouts,
} from '@/interface/checkoutPage';
import CONSTANTS from '@/constants/constants';
import { Utils } from '@/utils';
import Layout from '@/components/Layout/Layout';
import CheckoutAddressOption from '@/components/CheckoutAddressOption.tsx/CheckoutAddressOption';
import OrderCard from '@/components/OrderCard/OrderCard';
import CheckoutPaymentOption from '@/components/CheckoutPaymentOption/CheckoutPaymentOption';

const CheckoutPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [allAddress, setAllAddress] = useState<IAddress[] | undefined>();
  const [chosenAddress, setChosenAddress] = useState<IAddress | undefined>();
  const [checkouts, setCheckouts] = useState<ICheckout[]>();
  const [couriers, setCouriers] = useState<IRequestOrderSummary[]>();
  const [checkoutSummary, setCheckoutSummary] = useState<ICheckoutSummary>({
    orders: [],
    total_shop_price: 0,
    total_product: 0,
    total_delivery_cost: 0,
    service_price: 0,
    summary_price: 0,
  });
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<string[]>(new Array(6).fill(''));
  const [isPinsValid, setIsPinsValid] = useState<boolean>(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [couriersValid, setCouriersValid] = useState<boolean[]>();
  const [wallet, setWallet] = useState<ICheckoutWallet>({
    is_active: false,
    balance: 0,
  });
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);
  const [isAllPriceLoading, setIsAllPriceLoading] = useState<boolean>(false);

  async function handleCourierChange(
    shop_id: number,
    shop_courier_id: number,
    loadingToggle: Dispatch<SetStateAction<boolean>>,
  ) {
    loadingToggle(true);
    setIsSummaryLoading(true);
    if (couriers && couriersValid) {
      for (let i = 0; i < couriers.length; i++) {
        if (couriers[i].shop_id === shop_id) {
          const newCourierArr: IRequestOrderSummary[] = [...couriers];
          const newCouriersValid: boolean[] = [...couriersValid];
          const newCourierItem: IRequestOrderSummary = {
            shop_id: shop_id,
            shop_courier_id: shop_courier_id,
            promotion_id: newCourierArr[i].promotion_id,
          };
          newCourierArr[i] = newCourierItem;
          newCouriersValid[i] = true;
          setCouriers(newCourierArr);
          setCouriersValid(newCouriersValid);
          await getSummary(chosenAddress!, newCourierArr);
          loadingToggle(false);
          setIsSummaryLoading(false);
          return;
        }
      }
    }
    loadingToggle(false);
    setIsSummaryLoading(false);
  }

  async function handlePromotionChange(
    shop_id: number,
    promotion_id: number,
    loadingToggle: Dispatch<SetStateAction<boolean>>,
  ) {
    loadingToggle(true);
    setIsSummaryLoading(true);
    if (couriers) {
      for (let i = 0; i < couriers.length; i++) {
        if (couriers[i].shop_id === shop_id) {
          const newCourierArr: IRequestOrderSummary[] = [...couriers];
          const newCourierItem: IRequestOrderSummary = {
            shop_id: shop_id,
            shop_courier_id: newCourierArr[i].shop_courier_id,
            promotion_id: promotion_id === -1 ? undefined : promotion_id,
          };
          newCourierArr[i] = newCourierItem;
          setCouriers(newCourierArr);
          await getSummary(chosenAddress!, newCourierArr);
          loadingToggle(false);
          setIsSummaryLoading(false);
          return;
        }
      }
    }
    loadingToggle(false);
    setIsSummaryLoading(false);
  }

  async function getSummary(
    address: IAddress,
    courierArray: IRequestOrderSummary[],
  ) {
    const newRequestSummary: IRequestSummary = {
      order_deliveries: courierArray,
      buyer_address_id: address.id,
    };
    try {
      const response = await axiosInstance.post(
        `${CONSTANTS.BASEURL}/checkouts/summary`,
        newRequestSummary,
      );
      setCheckoutSummary(response.data.data);
    } catch (error) {
      if (error === CONSTANTS.ALREADY_LOGGED_OUT) {
        Utils.notifyTokenExp();
        router.replace('/signin');
      }
      Utils.handleGeneralError(error);
    }
  }

  async function getInitialOrderList() {
    try {
      const response = await axiosInstance(`${CONSTANTS.BASEURL}/checkouts`);
      setCheckouts(response.data.data.checkouts);
      return response.data.data;
    } catch (error: any) {
      Utils.handleGeneralError(error);
    }
  }

  async function getInitialAddress() {
    try {
      const response = await axiosInstance(
        `${CONSTANTS.BASEURL}/profile/addresses`,
      );
      setAllAddress(response.data.data);
      setChosenAddress(response.data.data[0]);
      return response.data.data[0];
    } catch (error) {
      Utils.handleGeneralError(error);
    }
  }

  async function getWallet() {
    try {
      const response = await axiosInstance(
        `${CONSTANTS.BASEURL}/wallets/personal/info`,
      );
      setWallet(response.data.data);
    } catch (error: any) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message === CONSTANTS.WALLET_NOT_ACTIVATED
      ) {
        setWallet({ is_active: false, balance: 0 });
      } else {
        Utils.notifyGeneralError(error);
      }
    }
  }

  async function setInitialStates() {
    try {
      const checkoutReponse: IResponseCheckouts = await getInitialOrderList();
      const initialAddress = await getInitialAddress();
      const initialCouriers: IRequestOrderSummary[] = [];
      const initialCouriersValid: boolean[] = [];
      if (checkoutReponse && checkoutReponse.checkouts) {
        for (let i = 0; i < checkoutReponse.checkouts.length; i++) {
          const orderReq: IRequestOrderSummary = {
            shop_id: checkoutReponse.checkouts[i].shop_id,
            shop_courier_id: undefined,
            promotion_id: undefined,
          };
          initialCouriers.push(orderReq);
          initialCouriersValid.push(true);
        }
        setCouriers(initialCouriers);
        setCouriersValid(initialCouriersValid);
        await getSummary(initialAddress, initialCouriers);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function findNonNumber(): boolean {
    for (let i = 0; i < pins.length; i++) {
      if (!/[0-9]/gi.test(pins[i])) {
        return false;
      }
    }
    return true;
  }

  function checkCouriers(): boolean {
    let isContinue: boolean = true;
    if (couriers && couriersValid) {
      for (let i = 0; i < couriers.length; i++) {
        if (couriers[i].shop_courier_id === undefined) {
          isContinue = false;
          const newCouriersValid: boolean[] = [...couriersValid];
          newCouriersValid[i] = false;
          setCouriersValid(newCouriersValid);
        }
      }
    } else {
      return false;
    }
    return isContinue;
  }

  function handleOpenPaymentPortal() {
    if (
      !wallet.is_active ||
      (wallet.is_active && wallet.balance < checkoutSummary.summary_price)
    ) {
      Utils.notifyGeneralError('Insufficient balance, please top up first');
      return;
    } else if (!checkCouriers()) {
      Utils.notify(
        "You haven't choose all shipping couriers",
        'error',
        'colored',
      );
      return;
    } else {
      setIsPaymentOpen(true);
    }
  }

  async function handlePay() {
    if (pins.includes('') || !findNonNumber()) {
      setIsPinsValid(false);
      return;
    } else {
      setIsPinsValid(true);
    }
    setIsPaymentLoading(true);
    try {
      const payload = {
        order_deliveries: couriers,
        buyer_address_id: chosenAddress!.id,
      };
      await axiosInstance.post(`/auth/payment-token`, {
        wallet_pin: pins.join(''),
      });
      await axiosInstance.post(`/orders`, payload);
      Utils.notify('Your order is created successfully', 'success', 'colored');
      router.replace('/user/order-detail?page=1');
    } catch (error: any) {
      Utils.handleGeneralError(error);
    } finally {
      setIsPaymentLoading(false);
    }
  }

  async function handleChangeAddress() {
    if (chosenAddress === undefined || couriers === undefined) return;
    setIsAllPriceLoading(true);
    setIsSummaryLoading(true);
    try {
      await getSummary(chosenAddress, couriers);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAllPriceLoading(false);
      setIsSummaryLoading(false);
    }
  }

  useEffect(() => {
    setInitialStates();
  }, []);

  useEffect(() => {
    getWallet();
  }, [updateToggle]);

  useEffect(() => {
    handleChangeAddress();
  }, [chosenAddress]);

  if (allAddress === undefined || allAddress.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - LilOren</title>
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
        <section className="flex flex-col justify-center items-center w-full bg-white pb-5">
          <div className="w-full md:w-[75vw] lg:px-2 lg:pt-5 flex flex-col justify-center items-center gap-5">
            <p className="w-full text-center mt-10 text-lg lg:text-xl px-2">
              Seems like you don&apos;t have any registered address yet.
            </p>
            <Link
              href="/user/address?status=Address"
              className="text-primary underline text-base px-2"
            >
              Add address
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (checkouts === undefined || checkouts.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - LilOren</title>
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
        <section className="flex flex-col justify-center items-center w-full bg-white pb-5">
          <div className="w-full md:w-[75vw] lg:px-2 lg:pt-5 flex flex-col justify-center items-center gap-5">
            <p className="w-full text-center mt-10 text-lg lg:text-xl px-2">
              Seems like you don&apos;t have any items at checkout yet.
            </p>
            <Link
              href="/user/cart"
              className="text-primary underline text-base px-2"
            >
              Go to Cart Page
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - LilOren</title>
      </Head>
      <section className="flex flex-col justify-center items-center w-full bg-white pb-5">
        <div className="w-full md:w-[75vw] lg:px-2 lg:pt-5 flex flex-col">
          <CheckoutAddressOption
            chosenAddress={chosenAddress}
            setChosenAddress={setChosenAddress}
            allAddress={allAddress}
          />
          <div className="w-full">
            {checkouts &&
              checkouts.map((checkout, index) => (
                <OrderCard
                  key={index}
                  checkout={checkout}
                  index={index}
                  isMultiple={checkouts.length > 1}
                  handleCouriersChange={handleCourierChange}
                  checkoutSummary={checkoutSummary}
                  isCourierValid={
                    couriersValid ? couriersValid[index] : undefined
                  }
                  isAllPriceLoading={isAllPriceLoading}
                  handlePromotionChange={handlePromotionChange}
                />
              ))}
          </div>
          <div className="w-full flex justify-end">
            <CheckoutPaymentOption
              checkoutSummary={checkoutSummary}
              isLoading={isSummaryLoading}
              pins={pins}
              setPins={setPins}
              handlePay={handlePay}
              isPinsValid={isPinsValid}
              setIsPinsValid={setIsPinsValid}
              isPaymentOpen={isPaymentOpen}
              setIsPaymentOpen={setIsPaymentOpen}
              isPaymentLoading={isPaymentLoading}
              handleOpenPayment={handleOpenPaymentPortal}
              wallet={wallet || { isActive: false, balance: 0 }}
              setUpdateToggle={setUpdateToggle}
            />
          </div>
        </div>
      </section>
    </>
  );
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CheckoutPage;
