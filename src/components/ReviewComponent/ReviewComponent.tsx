import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ReviewCard from '../ReviewCard/ReviewCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/lib/axiosInstance';
import { IProductReview } from '@/interface/productPage';
import PaginationNav from '../PaginationNav/PaginationNav';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Utils } from '@/utils';
import DotsLoading from '../DotsLoading/DotsLoading';
import EmptyNotify from '../EmptyNotify/EmptyNotify';

interface ReviewComponentProps {
  product_code: string;
  rating: number;
  totalRating: number;
}

const ReviewComponent = ({
  product_code,
  rating,
  totalRating,
}: ReviewComponentProps) => {
  const [reviews, setReviews] = useState<IProductReview[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [type, setType] = useState<'all' | 'comment' | 'image'>('all');
  const [star, setStar] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleOrderChange(value: 'asc' | 'desc') {
    setOrder(value);
    setCurrentPage(1);
  }
  function handleTypeChange(value: 'all' | 'comment' | 'image') {
    setType(value);
    setCurrentPage(1);
  }

  function handleStarChange(value: 'all' | '5' | '4' | '3' | '2' | '1') {
    setStar(value);
    setCurrentPage(1);
  }

  async function handleStatusChange() {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (star !== 'all') {
      params.set('rate', star);
    }
    params.set('sort', order);
    if (type !== 'all') {
      params.set('type', type);
    }
    params.set('page', '1');
    try {
      const response = await axiosInstance(
        `/reviews/${product_code}?${params.toString()}`,
      );
      setTotalPage(response.data.data.total_page);
      setReviews(response.data.data.user_reviews);
      setCurrentPage(1);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function getReviews() {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (star !== 'all') {
      params.set('rate', star);
    }
    params.set('sort', order);
    if (type !== 'all') {
      params.set('type', type);
    }
    params.set('page', currentPage.toString());
    try {
      const response = await axiosInstance(
        `/reviews/${product_code}?${params.toString()}`,
      );
      setTotalPage(response.data.data.total_page);
      setReviews(response.data.data.user_reviews);
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleStatusChange();
  }, [order, type, star]);

  useEffect(() => {
    getReviews();
  }, [currentPage]);

  return (
    <div className="w-full px-2">
      <h3 className="font-semibold text-xl md:text-2xl">Review</h3>
      <div className="flex flex-col w-full mt-3 lg:flex-row lg:gap-5">
        <div className="w-full flex flex-col lg:w-1/3">
          <div className="flex items-center gap-1 w-full justify-center">
            <Star className="fill-yellow-300 text-yellow-300 aspect-square h-10 mb-[0.125rem]" />{' '}
            <p className="text-4xl font-bold lg:text-5xl">
              {rating}
              <span className="ml-1 font-extralight text-base text-gray-500 lg:text-xl">{`/5`}</span>
            </p>
          </div>
          <p className="text-gray-500 text-base w-full text-center lg:text-lg">{`${totalRating} review${
            totalRating > 1 ? 's' : ''
          }`}</p>
          <p className="font-semibold text-base lg:mt-3">Filter:</p>
          <ScrollArea>
            <div className="mt-2 lg:mt-1 flex items-center space-x-2 max-w-full py-1 lg:px-1 lg:flex-col lg:space-x-0 lg:space-y-3">
              <Select
                defaultValue={star}
                onValueChange={(value: 'all' | '5' | '4' | '3' | '2' | '1') =>
                  handleStarChange(value)
                }
              >
                <SelectTrigger className="min-w-fit">
                  <SelectValue className="text-sm xl:text-base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>By Star</SelectLabel>
                    <SelectItem value="all" className="text-sm xl:text-base">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        All
                      </div>
                    </SelectItem>
                    <SelectItem value="5">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        5
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        4
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        3
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        2
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center text-sm xl:text-base">
                        <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem]" />
                        1
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                defaultValue={type}
                onValueChange={(value: 'all' | 'image' | 'comment') =>
                  handleTypeChange(value)
                }
              >
                <SelectTrigger className="min-w-fit">
                  <SelectValue placeholder="By content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm xl:text-base">
                      By content
                    </SelectLabel>
                    <SelectItem value="all" className="text-sm xl:text-base">
                      All content
                    </SelectItem>
                    <SelectItem
                      value="comment"
                      className="text-sm xl:text-base"
                    >
                      Comment only
                    </SelectItem>
                    <SelectItem value="image" className="text-sm xl:text-base">
                      With image
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                defaultValue={order}
                onValueChange={(value: 'asc' | 'desc') =>
                  handleOrderChange(value)
                }
              >
                <SelectTrigger className="min-w-fit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm xl:text-base">
                      Order
                    </SelectLabel>
                    <SelectItem value="desc" className="text-sm xl:text-base">
                      Latest
                    </SelectItem>
                    <SelectItem value="asc" className="text-sm xl:text-base">
                      Oldest
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="w-full space-y-2">
          {isLoading ? (
            <DotsLoading />
          ) : (
            <>
              <div className="flex flex-col w-full mt-2 divide-y-2 lg:mt-0">
                {reviews.length !== 0 ? (
                  <>
                    {reviews.map((review, index) => (
                      <ReviewCard review={review} key={index} />
                    ))}
                  </>
                ) : (
                  <EmptyNotify message="No Review" />
                )}
              </div>
              <div className="w-full flex justify-center items-center">
                <PaginationNav
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPage={totalPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewComponent;
