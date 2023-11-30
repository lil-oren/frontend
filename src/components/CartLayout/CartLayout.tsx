import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart/useCart';
import { CartClient } from '@/service/cart/CartClient';
import { ICartCheckedRequest } from '@/service/cart/CartService';
import { ICart, ICartPrice } from '@/pages/user/cart';
import { Utils } from '@/utils';

interface CartLayoutProps {
  prices: ICartPrice;
}

const CartLayout = ({ prices }: CartLayoutProps) => {
  const isMounted = useRef(false);
  const router = useRouter();
  const [countMounted, setCountMounted] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const all_checked = useCart.use.all_checked();
  const is_checked_carts = useCart.use.is_checked_carts();
  const cartItems = useCart.use.cartItems();
  const price = useCart.use.prices();
  const setCartItems = useCart.use.setCartItems();
  const setCheckedCart = useCart.use.setCheckedCart();
  const putIsCheckedCart = useCart.use.putIsCheckedCart();
  const setAllCheck = useCart.use.setAllCheck();

  const checkAllCartItem = () => {
    const check = is_checked_carts.every((cart) => cart.is_checked === true);
    setIsAllChecked(check);
  };

  const handleCheckUnCheckAll = async (isCheck: boolean) => {
    const updated_is_checked_cart = [...is_checked_carts];
    updated_is_checked_cart.forEach((cart) => (cart.is_checked = isCheck));
    const updatedCart: ICart = JSON.parse(JSON.stringify(cartItems));
    const updatedCartItems = updatedCart.items;
    updatedCartItems.forEach((cartItem) => {
      cartItem.products.forEach((product) => (product.is_checked = isCheck));
    });

    const req: ICartCheckedRequest = {
      is_checked_carts: is_checked_carts,
    };
    putIsCheckedCart(req);
    setAllCheck(isCheck);
    updatedCart.items = updatedCartItems;
    setTimeout(() => {
      setCartItems(updatedCart);
      setCheckedCart(updated_is_checked_cart);
    }, 100);
  };

  useEffect(() => {
    if (isMounted.current) {
      checkAllCartItem();
    } else {
      setCountMounted((prev) => prev + 1);
      if (countMounted >= 1) {
        isMounted.current = true;
      }
    }
  }, []);
  return (
    <section className="w-full fixed bottom-0 left-0 bg-primary-foreground">
      <div className="w-full md:w-[75vw] p-2 pb-3 flex items-center justify-between mx-auto gap-2">
        <div className="flex items-center gap-2 justify-between w-full sm:gap-8">
          <div className="flex items-center gap-2 min-w-fit justify-between">
            {/* checkbox label */}
            <div className="flex flex-row gap-2 items-center">
              <Checkbox
                id="check-all-product"
                className="sm:h-5 sm:w-5 xl:w-6 xl:h-6"
                checked={all_checked}
                onCheckedChange={(checked) => {
                  return checked
                    ? handleCheckUnCheckAll(true)
                    : handleCheckUnCheckAll(false);
                }}
              />
              <label
                htmlFor="check-all-product"
                className="text-sm flex flex-col items-start sm:text-base sm:flex-row sm:gap-1 xl:text-lg"
              >
                <p className="text-[12px] md:text-[14px] lg:text-[16px] text-muted-foreground">
                  All
                </p>
              </label>
            </div>
          </div>
          {/* total checkout button */}
          <div className="flex flex-row gap-2 lg:gap-4 items-center">
            <div className="text-right justify-end items-start">
              <p className="text-xs text-gray-500 sm:text-sm xl:text-base text-right">
                Total
              </p>
              {price.total_price ? (
                <p
                  className={`text-base  sm:text-xl xl:text-2xl text-right font-semibold`}
                >
                  {Utils.convertPrice(price.total_price)}
                </p>
              ) : (
                <p
                  className={`text-base  sm:text-xl xl:text-2xl text-right font-light`}
                >
                  {'-'}
                </p>
              )}
            </div>
            <Button
              variant={'default'}
              size={'customBlank'}
              className="w-[100px] lg:w-[200px] h-full p-2 text-sm sm:text-base lg:text-lg"
              onClick={() => router.push('/user/cart/checkout')}
            >
              Check Out
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartLayout;
