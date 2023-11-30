import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import QuantityController from '../QuantityController/QuantityController';
import { Button } from '../ui/button';
import { IProductVariant } from '@/interface/productPage';
import { Utils } from '@/utils';
import HeartWishlistButton from '../HeartWishlistButton/HeartWishlistButton';
import { useUser } from '@/store/user/useUser';

interface ProductPageLayoutProps {
  quantity: number | '';
  setQuantity: Dispatch<SetStateAction<number | ''>>;
  variant: IProductVariant | undefined;
  handleAddToCart: () => void;
  isVariant: boolean;
  isAddLoading: boolean;
  product_code: string;
  is_in_wishlist: boolean;
  shop_name: string;
}

const ProductPageLayout = ({
  quantity,
  setQuantity,
  variant,
  handleAddToCart,
  isVariant,
  isAddLoading,
  product_code,
  is_in_wishlist,
  shop_name,
}: ProductPageLayoutProps) => {
  const [isMaxValid, setIsMaxValid] = useState<boolean>(true);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(is_in_wishlist);
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const user_details = useUser.use.user_details();
  function handleVariantChange() {
    setIsMaxValid(true);
    if (variant === undefined) {
      setQuantity(1);
    } else if (
      variant !== undefined &&
      quantity !== '' &&
      variant.stock < quantity
    ) {
      setQuantity(variant.stock);
    } else if (variant !== undefined && quantity !== '' && quantity < 1) {
      setQuantity(1);
    }
  }

  function handleMaximumValid(sign: 'minus' | 'plus') {
    if (
      variant !== undefined &&
      (quantity as number) < variant.stock &&
      sign === 'plus'
    ) {
      setQuantity((prev) => (prev === '' ? 1 : prev + 1));
      return;
    }
    if (
      variant !== undefined &&
      quantity === variant.stock &&
      sign === 'plus'
    ) {
      Utils.notify('You have reached the maximum stock', 'info', 'colored');
      setIsMaxValid(false);
      return;
    }
    if (sign === 'minus' && variant !== undefined && (quantity as number) > 1) {
      setQuantity((prev) => (prev === '' ? 1 : prev - 1));
      setIsMaxValid(true);
      return;
    }
  }
  useEffect(() => handleVariantChange(), [variant]);
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div
      className={`bg-primary-foreground w-full sticky z-30 bottom-0 left-0 flex justify-center ${
        user_details.shop_name === shop_name ? 'hidden' : 'block'
      }`}
    >
      <div className="w-full md:w-[75vw] p-2 pb-3 flex items-center gap-2 lg:justify-between">
        <div className="hidden sm:flex flex-col items-start justify-center min-h-fit w-4/5">
          {variant === undefined ? (
            <p className="font-semibold text-base lg:text-xl">
              Please choose a combination
            </p>
          ) : (
            <>
              <p className="text-gray-500 text-sm">Total Price</p>
              <p className="font-semibold text-2xl truncate max-w-[2/5]">
                {variant.discount !== 0
                  ? Utils.convertPrice(
                      variant.discounted_price *
                        (quantity === '' ? 1 : quantity),
                    )
                  : Utils.convertPrice(
                      variant.price * (quantity === '' ? 1 : quantity),
                    )}
              </p>
            </>
          )}
        </div>
        <div className="w-full lg:w-3/5 flex items-end gap-2 justify-end">
          <div className="w-fit flex flex-col items-center gap-1">
            {variant !== undefined && !isMaxValid ? (
              <p className="text-xs sm:text-sm lg:text-base text-destructive">{`Limit: ${variant.stock}!`}</p>
            ) : variant !== undefined && isMaxValid ? (
              <p className="text-xs sm:text-sm lg:text-base">{`Stock: ${variant.stock}`}</p>
            ) : null}
            <QuantityController
              inputValue={quantity}
              setInputValue={setQuantity}
              maximum={variant === undefined ? 1 : variant.stock}
              handleMaximumValid={handleMaximumValid}
            />
          </div>
          <Button
            variant={'default'}
            size={'customBlank'}
            className="w-full sm:w-52 h-full p-2 text-lg"
            onClick={handleAddToCart}
            disabled={
              (variant === undefined && isVariant) || isAddLoading === true
            }
          >
            {!isAddLoading ? (
              <p>Add to Cart</p>
            ) : (
              <div className="border-4 border-primary-foreground aspect-square border-t-transparent rounded-full animate-spin w-6" />
            )}
          </Button>
          <HeartWishlistButton
            product_code={product_code}
            wishlist_id={0}
            current_page={0}
            is_in_wishlist={isInWishlist}
            setIsInWishlist={setIsInWishlist}
            is_in_product_detail={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPageLayout;
