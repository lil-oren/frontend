import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { IProductReview } from '@/interface/productPage';
import { Utils } from '@/utils';

interface ReviewCardProps {
  review: IProductReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex flex-col gap-0.5 w-full py-2 px-1">
      <p className="text-base font-semibold leading-snug sm:text-lg">
        {review.username}
      </p>
      <div className="flex items-center gap-1 sm:gap-2">
        {[...Array(review.rating)].map((_, index) => (
          <Star
            key={index}
            className="fill-yellow-300 text-yellow-300 aspect-square h-5 -ml-1 sm:h-7"
          />
        ))}
      </div>
      <p className="text-gray-500 text-sm">
        {review.created_at.split(' ').join(',')}
      </p>
      {review.comment && (
        <p className="w-full text-justify text-base line-clamp-2 text-ellipsis sm:text-lg">
          {review.comment}
        </p>
      )}
      {review.image_urls && review.image_urls.length !== 0 && (
        <div className="w-full flex items-center flex-wrap justify-start gap-2">
          {review.image_urls.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-md overflow-hidden w-14 sm:w-20"
            >
              <Image
                src={image}
                alt={`Product's image ${index}`}
                fill
                sizes="(max-width: 768px) 30vw, 20vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
