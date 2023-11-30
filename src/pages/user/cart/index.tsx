import ButtonWithIcon from '@/components/ButtonWithIcon/ButtonWithIcon';
import CartCard from '@/components/CartCard/CartCard';
import CartLayout from '@/components/CartLayout/CartLayout';
import { EMPTY_CART_TEXT } from '@/components/EmptyCart/constants';
import Layout from '@/components/Layout/Layout';
import SkeletonCart from '@/components/SkeletonCart/SkeletonCart';
import FallbackImage from '@/components/FallbackImage/FallbackImage';
import { IProduct } from '@/interface/product';
import { useCart } from '@/store/cart/useCart';
import Image from 'next/image';
import { ReactElement, useEffect, useState } from 'react';
import EmptyCartImage from '../../../../public/empty-cart.svg';
import { NextPageWithLayout } from '../../_app';
import styles from './CartPage.module.scss';

export interface ICartItem {
  seller_name: string;
  seller_id: number;
  products: IProduct[];
}

export interface ICartPrice {
  total_base_price: number;
  total_discount_price: number;
  total_price: number;
}

export interface ICart {
  items: ICartItem[];
  prices: ICartPrice;
}

const CartPage: NextPageWithLayout = () => {
  const fetchCart = useCart.use.fetchCart();
  const cartItems = useCart.use.cartItems();
  const setCheckedCart = useCart.use.setCheckedCart();
  const loading_fetch_cart = useCart.use.loading_fetch_cart();
  const [isDeleteCart, setIsDeleteCart] = useState<boolean>(false);

  const handleSetCheckedFirstCart = () => {
    const checkedCart = cartItems.items
      .map((cps) =>
        cps.products.map((cart) => ({
          cart_id: cart.cart_id!,
          is_checked: cart.is_checked!,
        })),
      )
      .flat();

    setCheckedCart(checkedCart);
  };

  useEffect(() => {
    fetchCart();
    handleSetCheckedFirstCart();
  }, [isDeleteCart]);

  return (
    <>
      <section className="flex flex-col justify-center items-center w-full bg-white pb-8">
        <div className="w-full md:w-[75vw] lg:px-2 lg:pt-5 lg:pb-16 flex flex-col">
          {loading_fetch_cart ? (
            <>
              <SkeletonCart />
              <SkeletonCart />
              <SkeletonCart />
            </>
          ) : (
            <>
              {cartItems.items.length !== 0 ? (
                cartItems.items.map((item, index) => (
                  <CartCard
                    key={`key:${item.seller_name}`}
                    shop={item.seller_name!}
                    shop_items={item.products}
                    indexData={index}
                    setIsDeleteCart={setIsDeleteCart}
                  />
                ))
              ) : (
                <div className="flex flex-col justify-center items-center w-full">
                  <div className={`${styles.emptyCart}`}>
                    <FallbackImage
                      alt="empty-cart"
                      src={EmptyCartImage}
                      width={500}
                      height={500}
                      className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]"
                    />
                    <p className={styles.EmptyCartText}>{EMPTY_CART_TEXT}</p>
                    <ButtonWithIcon href={'/'}>{'Shop Now'}</ButtonWithIcon>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {!loading_fetch_cart && cartItems.items.length !== 0 && (
        <CartLayout prices={cartItems.prices} />
      )}
    </>
  );
};

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CartPage;
