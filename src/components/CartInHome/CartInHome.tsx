import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EmptyCart from '@/components/EmptyCart/EmptyCart';
import { ListItem } from '@/components/Navigation/Navigation';
import { Button } from '@/components/ui/button';
import { Utils } from '@/utils';
import { ICartHome } from '@/store/home/useHome';
import styles from './CartInHome.module.scss';
import CONSTANTS from './constants';

interface CartInHomeProps {
  products: ICartHome[];
}

const CartInHome = ({ products }: CartInHomeProps) => {
  return (
    <div className={styles.cart}>
      <div className={styles.cartHeader}>
        <p className={styles.totalCartItems}>{`Cart (${products.length})`}</p>
        <Button
          variant={'link'}
          className="p-0 text-[10px] sm:text-[12px] md:text-[14px]"
        >
          <Link href="/user/cart">{CONSTANTS.SEE_MY_CART}</Link>
        </Button>
      </div>
      <ul className={styles.cartItemsWrapper}>
        {products.length !== 0 ? (
          products
            .slice(0, products.length > 5 ? 5 : products.length)
            .map((product) => (
              <div
                key={`key:${product.product_name}`}
                className="flex flex-row items-center w-full"
              >
                <Image
                  src={product.thumbnail_url}
                  alt={'product-img'}
                  width={500}
                  height={500}
                  className="w-[50px] h-[50px] pl-1"
                />
                <ListItem href="/user/cart" title={product.product_name}>
                  <div className="flex justify-between items-center pt-1">
                    <p className="quantityinCart text-[10px] sm:text-[12px] md:text-[14px]">
                      {`${product.quantity} ${
                        product.quantity > 1 ? CONSTANTS.ITEMS : CONSTANTS.ITEM
                      }`}
                    </p>
                    <p className="priceInCart text-primary text-[10px] sm:text-[12px] md:text-[14px]">
                      {Utils.convertPrice(product.price)}
                    </p>
                  </div>
                </ListItem>
              </div>
            ))
        ) : (
          <EmptyCart />
        )}
        {products.length > 5 && (
          <Button variant={'link'}>
            <Link href="/user/cart">{CONSTANTS.SEE_MORE_PRODUCTS}</Link>
          </Button>
        )}
      </ul>
    </div>
  );
};

export default CartInHome;
