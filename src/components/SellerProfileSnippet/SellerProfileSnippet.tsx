import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { ISeller } from '@/interface/productPage';
import { Button } from '../ui/button';
import { useRouter } from 'next/router';
import FallbackImage from '../FallbackImage/FallbackImage';

interface SellerProfileSnippetProps {
  seller: ISeller;
}

const SellerProfileSnippet = ({ seller }: SellerProfileSnippetProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 w-full sm:gap-5 px-2">
      <div className="rounded-full aspect-square relative w-1/5 overflow-hidden lg:w-2/12 xl:w-1/12 ">
        <FallbackImage
          src={seller.profile_picture_url || '/blank-profile.webp'}
          alt="Shop's profile pict"
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <p className="font-normal text-lg sm:text-xl">{seller.name}</p>
        <div className="flex items-center gap-1">
          <MapPin className="text-primary h-5 w-5 sm:w-6 sm:h-6" />
          <p className="leading-none text-gray-500 text-base sm:text-lg">
            {seller.location}
          </p>
        </div>
        <div className="flex items-center justify-start gap-2">
          <Button
            onClick={() => router.push(`/shop/${seller.name}`)}
            size="customBlank"
            className="text-base px-2 py-1 sm:text-lg"
          >
            View Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileSnippet;
