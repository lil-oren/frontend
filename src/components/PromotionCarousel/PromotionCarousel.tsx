import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromotionCarouselProps {
  imageArray: string[];
  autoSlide?: boolean;
  slideInterval?: number;
}

function PromotionCarousel({
  imageArray,
  autoSlide = true,
  slideInterval = 4000,
}: PromotionCarouselProps) {
  const [current, setCurrent] = useState<number>(0);
  const goToPrev = () => {
    setCurrent((current) =>
      current === 0 ? imageArray.length - 1 : current - 1,
    );
  };
  const goToNext = () => {
    setCurrent((current) =>
      current === imageArray.length - 1 ? 0 : current + 1,
    );
  };

  useEffect(() => {
    if (!autoSlide) return;
    const slide = setTimeout(goToNext, slideInterval);
    return () => clearTimeout(slide);
  }, [current]);

  return (
    <>
      <div className="w-full bg-primary-foreground flex-col justify-center items-center hidden lg:flex">
        <div className="w-full md:w-[75vw] flex overflow-hidden relative md:rounded-xl md:my-5 group">
          {imageArray.map((image, index) => (
            <div
              key={index}
              className="min-w-full min-h-full transition-transform linear duration-300"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              <Image
                src={image}
                alt={`Promotion ${index + 1}`}
                height={150}
                width={500}
                style={{ objectFit: 'fill' }}
                className="w-full"
              />
            </div>
          ))}
          <div className="absolute inset-3 flex items-center justify-between opacity-0 duration-300 group-hover:opacity-100 group-hover:inset-0">
            <button
              className="text-white py-1 px-2 bg-[rgba(0,0,0,0.2)] focus:outline-none duration-300 hover:bg-[rgba(0,0,0,0.6)]"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            </button>
            <button
              className="text-white py-1 px-2 bg-[rgba(0,0,0,0.2)] focus:outline-none duration-300 hover:bg-[rgba(0,0,0,0.6)]"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            </button>
          </div>
          <div className="absolute bottom-0 flex items-center justify-center gap-2 w-full pb-2">
            {imageArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className="focus:outline-none"
              >
                <div
                  className={`transition-all w-2.5 h-2.5 bg-white rounded-full duration-300 hover:bg-primary ${
                    current === index ? 'p-1' : 'bg-opacity-50'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:w-[75vw] lg:hidden max-h-fit">
        <Swiper
          initialSlide={current}
          slidesPerView={1}
          loop={true}
          pagination={{ type: 'bullets' }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: slideInterval,
            disableOnInteraction: false,
          }}
        >
          {imageArray.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image}
                alt={`Promotion ${index + 1}`}
                height={150}
                width={500}
                style={{ objectFit: 'contain' }}
                className="w-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default PromotionCarousel;
