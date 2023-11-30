import React, { useEffect, Dispatch, useState, SetStateAction } from 'react';
import { IProduct } from '@/interface/product';
import { Checkbox } from '@/components/ui/checkbox';
import Divider from '@/components/Divider/Divider';
import CartCardProduct from '@/components/CartCardProduct/CartCardProduct';
import { useCart } from '@/store/cart/useCart';
import { ICartCheckedRequest } from '@/service/cart/CartService';
import { ICart } from '@/pages/user/cart';

interface CartCardProps {
  shop: string;
  shop_items: IProduct[];
  indexData: number;
  setIsDeleteCart: Dispatch<SetStateAction<boolean>>;
}

const CartCard = ({
  shop,
  shop_items,
  indexData,
  setIsDeleteCart,
}: CartCardProps) => {
  const [isShopCheck, setIsShopCheck] = useState(false);
  const cartItems = useCart.use.cartItems();
  const setCart = useCart.use.setCartItems();
  const fetchCart = useCart.use.fetchCart();
  const is_checked_carts = useCart.use.is_checked_carts();
  const setIsCheckedCarts = useCart.use.setCheckedCart();
  const putIsCheckedCart = useCart.use.putIsCheckedCart();
  const checkIsShopCheckOrNot = () => {
    const isCheck = shop_items.every((item) => item.is_checked === true);
    setIsShopCheck(isCheck);
  };

  const handleCheckBySeller = (isCheck: boolean) => {
    setIsShopCheck(!isShopCheck);
    const updatedCart: ICart = JSON.parse(JSON.stringify(cartItems));
    const updatedCartItems = updatedCart.items;
    const products = updatedCartItems[indexData].products;
    products.forEach((product, index) => {
      const updatedProduct = product;
      updatedProduct.is_checked = isCheck;
      updatedCartItems[indexData].products[index] = updatedProduct;
    });
    updatedCart.items = updatedCartItems;
    setCart(updatedCart);
    handleUpdateIsChecked(isCheck);
  };

  const handleUpdateIsChecked = async (isCheck: boolean) => {
    const updatedCart: ICart = JSON.parse(JSON.stringify(cartItems));
    const updatedCartItems = updatedCart.items;
    const products = updatedCartItems[indexData].products;
    const updated_is_checked_carts = [...is_checked_carts];
    updated_is_checked_carts.forEach((cart, index) => {
      products.forEach((product) => {
        if (product.cart_id === cart.cart_id) {
          updated_is_checked_carts[index].is_checked = isCheck;
        }
      });
    });
    setIsCheckedCarts(updated_is_checked_carts);
    const req: ICartCheckedRequest = {
      is_checked_carts: is_checked_carts,
    };
    putIsCheckedCart(req);
  };

  useEffect(() => {
    checkIsShopCheckOrNot();
  }, [is_checked_carts]);

  return (
    <div className="flex flex-col w-full border-[1px] border-gray-100">
      <div className="flex items-center gap-2 p-2 border-gray-200 w-full">
        <Checkbox
          checked={isShopCheck}
          onCheckedChange={(checked) => {
            return checked
              ? handleCheckBySeller(true)
              : handleCheckBySeller(false);
          }}
          id={`check-${shop}`}
          className="w-5 h-5"
        />
        <p className="font-semibold text-sm md:text-base line-clamp-1 overflow-hidden whitespace-nowrap text-elipsis">
          {shop}
        </p>
      </div>
      <div className="w-full flex flex-col gap-2 p-2">
        {shop_items.map((items, index) => (
          <CartCardProduct
            key={`key-${items.product_name} ${index.toString()}`}
            product={items}
            index={indexData}
            setIsDeleteCart={setIsDeleteCart}
          />
        ))}
      </div>
      <Divider />
    </div>
  );
};

export default CartCard;
