import { IOrderProductItem } from '@/interface/orderDetailPage';
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Label } from '../ui/label';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import PhotosArray from '../PhotosArray/PhotosArray';
import { Button } from '../ui/button';
import imageUploadder from '@/lib/imageUploadder';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';

const ratingArray = ['1', '2', '3', '4', '5'];
const maxPhoto = 5;

interface ReviewFormProps {
  product: IOrderProductItem;
}

const ReviewForm = ({ product }: ReviewFormProps) => {
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [rating, setRating] = useState<string>('5');
  const [comment, setComment] = useState<string>('');
  const [photo, setPhoto] = useState<File[]>([]);
  const [remainingPhotos, setRemainingPhotos] = useState<number>(maxPhoto);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleAddReview() {
    setIsLoading(true);
    const imageArr = [];
    for (let i = 0; i < photo.length; i++) {
      const imageUrl = await imageUploadder(photo[i]);
      imageArr.push(imageUrl);
    }
    try {
      const reqBody = {
        product_code: product.product_code,
        rating: parseInt(rating),
        comment: comment,
        image_urls: imageArr,
      };
      await axiosInstance.post(`/reviews`, reqBody);
      setIsReviewed(true);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="w-full space-y-3 border-[1px] border-black rounded-lg p-2">
      <div className="w-full flex gap-2 items-center">
        <div className="relative aspect-square rounded-md overflow-hidden border-[1px] border-gray-100 w-[50px] lg:w-[100px]">
          <Image
            src={product.thumbnail_url}
            alt={product.product_name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 30vw, 20vw"
          />
        </div>
        <p className="truncate text-sm font-semibold">{product.product_name}</p>
      </div>
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          <div className="flex items-center gap-2">
            <Label className="font-semibold pb-1" htmlFor="rating-toggle">
              Rating <span className="text-primary">{' *'}</span>
            </Label>
            <p>{`(${rating} star${parseInt(rating) > 1 ? 's' : ''})`}</p>
          </div>
          <Select
            defaultValue={rating}
            onValueChange={(value) => setRating(value)}
            disabled={isLoading || isReviewed}
          >
            <SelectTrigger id="rating-toggle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ratingArray.map((value) => (
                <SelectItem value={value} key={value}>
                  <div className="flex items-center text-sm xl:text-base">
                    <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                    {value}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full space-y-1">
          <Label className="font-semibold" htmlFor="review-comment">
            Comment
          </Label>
          <Textarea
            disabled={isLoading || isReviewed}
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="w-full">
          <PhotosArray
            tempProductPhotos={photo}
            setTempProductPhotos={setPhoto}
            remainingPhotos={remainingPhotos}
            setRemainingPhotos={setRemainingPhotos}
            maxPhoto={maxPhoto}
            isReviewForm={true}
            product_code={product.product_code}
          />
        </div>
        <div className="w-full flex justify-end">
          <Button disabled={isLoading || isReviewed} onClick={handleAddReview}>
            {isLoading ? (
              <div className="border-4 border-primary-foreground-foreground border-t-transparent rounded-full animate-spin aspect-square h-4" />
            ) : (
              <p>Add Review</p>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
