import React, { useEffect, useState, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
  totalPage: number;
}

const SearchPagination = ({ totalPage }: SearchPaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const paginationArray = useMemo(() => {
    if (totalPage === undefined) {
      return undefined;
    }
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

  function handleClickPrev() {
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage - 1).toString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleClickNext() {
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage + 1).toString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSetToCertainPage(number: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', number.toString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  function setInitialState() {
    const page: string | null = searchParams.get('page');
    if (typeof page === 'string') {
      setCurrentPage(parseInt(page));
    }
  }

  useEffect(() => {
    setInitialState();
  }, [searchParams]);

  if (totalPage < 2) {
    return null;
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
            onClick={() => handleSetToCertainPage(number)}
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

export default SearchPagination;
