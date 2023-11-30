import { withBasePath } from '@/lib/nextUtils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';

const EmptyWishlist = () => {
  const router = useRouter();
  return (
    <div className="max-h-max flex flex-col gap-4 justify-center items-center pt-3 lg:pt-3">
      <Image
        src={withBasePath('empty-wishlist.png')}
        width="200"
        height="200"
        alt="empty-wishlist"
        className="w-[200px]"
      />
      <div className="w-[250px] md:w-[400px] lg:w-[300px] flex flex-col gap-3 items-center justify-center">
        <p className="font-bold">{'Your wishlist is still empty'}</p>
        <p className="text-[14px] text-muted-foreground text-center">
          {
            'Fill it with your desired products and make your Wishlist come true!'
          }
        </p>
      </div>
      <Button onClick={() => router.push('/')}>{'Search for products'}</Button>
    </div>
  );
};

export default EmptyWishlist;
