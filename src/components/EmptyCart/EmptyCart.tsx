import React from 'react';
import ButtonWithIcon from '../ButtonWithIcon/ButtonWithIcon';
import FallbackImage from '@/components/FallbackImage/FallbackImage';
import EmptyCartImage from '../../../public/empty-cart.svg';
import { EMPTY_CART_TEXT } from './constants';
import styles from './EmptyCart.module.scss';

const EmptyCart = () => {
  return (
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
  );
};

export default EmptyCart;
