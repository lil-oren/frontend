import React, { useState, useMemo, SetStateAction, Dispatch } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationNavProps {
  totalPage: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const PaginationNav = ({
  totalPage,
  currentPage,
  setCurrentPage,
}: PaginationNavProps) => {
  const paginationArray = useMemo(() => {
    const sidePage: number = 2;
    const numberOfShownPage = sidePage + 5;

    if (numberOfShownPage >= totalPage) {
      const returnArray: number[] = [];
      for (let i = 1; i <= totalPage; i++) {
        returnArray.push(i);
      }
      return returnArray;
    }

    const leftSiblingIndex: number = Math.max(currentPage - sidePage, 1);
    const rightSiblingIndex: number = Math.min(
      currentPage + sidePage,
      totalPage,
    );

    const isLeftDotsShown: boolean = leftSiblingIndex > 2;
    const isRightDotsShown: boolean = rightSiblingIndex < totalPage - 2;

    if (!isLeftDotsShown && isRightDotsShown) {
      const leftItem = 1 + 2 * sidePage;
      const leftTemp: number[] = [];
      for (let i = 1; i <= leftItem; i++) {
        leftTemp.push(i);
      }
      return [...leftTemp, '...', totalPage];
    }

    if (isLeftDotsShown && !isRightDotsShown) {
      const rightItem = 1 + 2 * sidePage;
      const rightTemp: number[] = [];
      for (let i = totalPage - rightItem + 1; i <= totalPage; i++) {
        rightTemp.push(i);
      }
      return [1, '...', ...rightTemp];
    }

    if (isLeftDotsShown && isRightDotsShown) {
      const middleTemp: number[] = [];
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        middleTemp.push(i);
      }
      return [1, '...', ...middleTemp, '...', totalPage];
    }
  }, [totalPage, currentPage]);

  if (totalPage < 2) {
    return null;
  }

  function handleClickPrev() {
    setCurrentPage((prev) => prev - 1);
  }

  function handleClickNext() {
    setCurrentPage((prev) => prev + 1);
  }

  return (
    <div className="flex items-center gap-2 w-fit text-lg sm:text-xl lg:text-2xl">
      <button
        className="duration-300 lg:hover:text-primary text-black disabled:hidden"
        disabled={currentPage === 1}
        onClick={handleClickPrev}
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9" />
      </button>
      {paginationArray?.map((number, index) =>
        typeof number === 'string' ? (
          <button key={index} disabled className="hover:cursor-not-allowed">
            {number}
          </button>
        ) : (
          <button
            key={index}
            onClick={() => setCurrentPage(number)}
            className={`duration-300 lg:hover:text-primary ${
              currentPage === number ? 'text-primary' : 'text-black'
            }`}
          >
            {number}
          </button>
        ),
      )}
      <button
        className="duration-300 lg:hover:text-primary text-black disabled:hidden"
        disabled={currentPage === totalPage}
        onClick={handleClickNext}
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9" />
      </button>
    </div>
  );
};

export default PaginationNav;
