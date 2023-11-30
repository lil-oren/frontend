import React, { Dispatch, SetStateAction } from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IProduct } from '@/interface/product';
import { CartClient } from '@/service/cart/CartClient';
import { Utils } from '@/utils';
import { ToastContent } from 'react-toastify';

interface TrashButtonProps {
  product: IProduct;
  setIsDeleteCart: Dispatch<SetStateAction<boolean>>;
}

const TrashButton = ({ product, setIsDeleteCart }: TrashButtonProps) => {
  const handleDeleteCart = async (cart_id: number) => {
    setIsDeleteCart(true);
    const response = await CartClient.deleteCart(cart_id);
    const error = response.error;
    const message = response.message;
    if (!error) {
      Utils.notify(message as ToastContent, 'success', 'light');
    } else {
      Utils.notify(
        'Failed to delete item in cart' as ToastContent,
        'error',
        'light',
      );
    }
    setIsDeleteCart(false);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="aspect-square w-5 duration-300 focus:outline-none text-muted-foreground" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="lg:text-lg">
            {`Are you sure you want to delete ${product.product_name} from cart?`}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <div className="w-full flex items-center gap-5 justify-end">
            <AlertDialogCancel className="mt-0 lg:text-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteCart(product.cart_id!)}
              className="lg:text-lg"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrashButton;
