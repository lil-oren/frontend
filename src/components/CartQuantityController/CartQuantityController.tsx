import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Minus, Plus } from 'lucide-react';
import { IProduct } from '@/interface/product';
import { CartClient } from '@/service/cart/CartClient';
import useDebounce from '@/hook/useDebounce';
import { useCart } from '@/store/cart/useCart';
interface CartQuantityControllerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  inputValue: number;
  setInputValue: Dispatch<SetStateAction<number>>;
  maximum: number;
  product: IProduct;
}

function CartQuantityController({
  inputValue,
  setInputValue,
  maximum,
  product,
}: CartQuantityControllerProps) {
  const handleAPI = useDebounce(putQuantityToDb, 500);
  const putQuantityCart = useCart.use.putQuantityCart();
  const handleUpdateQuantity = async (type: string) => {
    if (type === 'decrement') {
      setInputValue((prev) => prev - 1);
    } else {
      setInputValue((prev) => prev + 1);
    }
  };

  async function putQuantityToDb() {
    putQuantityCart(product.cart_id!, {
      quantity: inputValue,
    });
  }

  useEffect(() => {
    handleAPI();
  }, [inputValue]);

  return (
    <div className="p-1 bg-white border-[1px] flex items-center gap-4 w-fit lg:gap-5 rounded-md">
      <button
        onClick={() => handleUpdateQuantity('decrement')}
        disabled={inputValue === 1}
        className="text-primary w-5 aspect-square disabled:text-[#777777] disabled:cursor-not-allowed"
      >
        <Minus className="w-[19px]" />
      </button>
      <p className="text-sm font-semibold lg:text-base">{inputValue}</p>
      <button
        onClick={() => handleUpdateQuantity('increment')}
        disabled={inputValue === maximum}
        className="text-primary w-5 aspect-square disabled:text-[#777777] disabled:cursor-not-allowed"
      >
        <Plus className="w-[19px]" />
      </button>
    </div>
  );
}

export default CartQuantityController;
