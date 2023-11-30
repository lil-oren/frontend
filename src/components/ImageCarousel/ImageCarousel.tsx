import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IProductMedia } from '@/interface/productPage';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface ImageCarouselProps {
  mediaArray: IProductMedia[];
}

function ImageCarousel({ mediaArray }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0]);
  const [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
  const [isMagnifying, setIsMagnifying] = useState<boolean>(false);

  const goToPrev = () => {
    setCurrentIndex((current) =>
      current === 0 ? mediaArray.length - 1 : current - 1,
    );
  };
  const goToNext = () => {
    setCurrentIndex((current) =>
      current === mediaArray.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <Dialog>
      <DialogContent>
        <div className="w-full flex flex-col justify-between items-center gap-1 mt-6">
          <Image
            src={mediaArray[currentIndex].media_url}
            alt={`Product view ${currentIndex + 1}`}
            height={400}
            width={300}
            style={{ objectFit: 'fill' }}
            className="w-full aspect-square"
          />
          <div
            className={`w-full flex items-center ${
              currentIndex === 0 ? 'justify-end' : 'justify-between'
            }`}
          >
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={goToPrev}
              className={`${currentIndex === 0 ? 'hidden' : 'block'}`}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={goToNext}
              className={`${
                currentIndex === mediaArray.length - 1 ? 'hidden' : 'block'
              }`}
            >
              <ChevronRight />
            </Button>
          </div>
          <ScrollArea className="max-w-full">
            <div className="flex space-x-5 py-1">
              {mediaArray.map((media, index) => (
                <div
                  key={index}
                  className={`min-w-fit min-h-fit relative border-2 cursor-pointer duration-300 lg:hover:opacity-100 lg:hover:border-primary rounded-xl overflow-hidden ${
                    currentIndex === index
                      ? 'opacity-100 border-primary'
                      : 'opacity-50 border-transparent'
                  }`}
                >
                  <Image
                    src={media.media_url}
                    alt={`Product view ${index + 1}`}
                    width={80}
                    height={80}
                    className={`aspect-square`}
                    onClick={() => setCurrentIndex(index)}
                  />
                  <p className="p-1 bg-[rgba(0,0,0,0.5)] absolute bottom-0 left-0 text-white text-xs">{`${
                    index + 1
                  }/${mediaArray.length}`}</p>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </DialogContent>
      <div className="w-full">
        <div className="lg:hidden">
          <Swiper
            initialSlide={currentIndex}
            slidesPerView={1}
            loop={true}
            pagination={{
              type: 'fraction',
            }}
            modules={[Pagination]}
          >
            {mediaArray.map((media, index) => (
              <SwiperSlide key={index}>
                <DialogTrigger asChild>
                  <Image
                    src={media.media_url}
                    alt={`Product's view ${index + 1}`}
                    height={500}
                    width={500}
                    style={{ objectFit: 'cover' }}
                    className="w-full aspect-square"
                    onClick={() => setCurrentIndex(index)}
                  />
                </DialogTrigger>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="hidden lg:flex flex-col gap-9">
          <DialogTrigger asChild>
            <div style={{ position: 'relative', cursor: 'none' }}>
              <Image
                src={mediaArray[currentIndex].media_url}
                alt={`Product view ${currentIndex + 1}`}
                height={500}
                width={500}
                style={{ objectFit: 'fill' }}
                className="w-full aspect-square duration-300 border-[1px] border-transparent lg:hover:border-primary"
                onMouseEnter={(e) => {
                  const { width, height } =
                    e.currentTarget.getBoundingClientRect();
                  setImageSize([width, height]);
                  setIsMagnifying(true);
                }}
                onMouseLeave={() => setIsMagnifying(false)}
                onMouseMove={(e) => {
                  const { top, left, width, height } =
                    e.currentTarget.getBoundingClientRect();
                  const cursorX = e.pageX - left + 150 / 2;
                  const cursorY = e.pageY - top + 150 / 2;
                  setCoordinate([cursorX, cursorY]);
                }}
              />
              {isMagnifying && (
                <div
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    height: '150px',
                    width: '150px',
                    left: `${coordinate[0] - 150}px`,
                    top: `${coordinate[1] - 150}px`,
                    border: '1px solid gray',
                    backgroundColor: 'white',
                    backgroundImage: `url(${mediaArray[currentIndex].media_url})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${imageSize[0] * 1.5}px ${
                      imageSize[1] * 1.5
                    }px`,
                    backgroundPositionX: `${-coordinate[0] * 1.5 + 150}px`,
                    backgroundPositionY: `${-coordinate[1] * 1.5 + 150}px`,
                  }}
                />
              )}
            </div>
          </DialogTrigger>
          <div>
            <ScrollArea className="max-w-full rounded-md">
              <div className="flex space-x-5 py-1">
                {mediaArray.map((media, index) => (
                  <div
                    key={index}
                    className={`min-w-fit min-h-fit relative border-2 cursor-pointer duration-300 lg:hover:opacity-100 lg:hover:border-primary rounded-xl overflow-hidden ${
                      currentIndex === index
                        ? 'opacity-100 border-primary'
                        : 'opacity-50 border-transparent'
                    }`}
                  >
                    <Image
                      src={media.media_url}
                      alt={`Product view ${index + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'fill' }}
                      className={`aspect-square`}
                      onClick={() => setCurrentIndex(index)}
                    />
                    <p className="p-1 bg-[rgba(0,0,0,0.5)] absolute bottom-0 left-0 text-white text-xs">{`${
                      index + 1
                    }/${mediaArray.length}`}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ImageCarousel;
