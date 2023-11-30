import React, {
  ReactElement,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import CONSTANTS from '@/constants/constants';
import { withBasePath } from '@/lib/nextUtils';
import { ISellerDetails, useSellerPage } from '@/store/sellerPage/sellerPage';
import SellerPageCategoryTabs from '@/components/SellerPageCategoryTabs/SellerPageCategoryTabs';
import SellerPageHeading from '@/components/SellerPageHeading/SellerPageHeading';
import Layout from '@/components/Layout/Layout';
import SellerProductCard from '@/components/SellerProductCard/SellerProductCard';
import { Button } from '@/components/ui/button';
import DotsLoading from '@/components/DotsLoading/DotsLoading';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaginationNav from '@/components/PaginationNav/PaginationNav';

interface SellerPageProps {
  sellerPage: ISellerDetails;
}

const SellerPage = ({ sellerPage }: SellerPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sort_by = searchParams.get('sort_by');
  const sort_desc = searchParams.get('sort_desc');
  const category_name = searchParams.get('category_name');
  const page = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortByPriceDesc, setSortByPriceDesc] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState('BestSeller');

  const tabsRef = useRef(null);
  const loading_fetch_seller_details =
    useSellerPage.use.loading_fetch_seller_details();
  const fetchSellerDetails = useSellerPage.use.fetchSellerDetails();
  const seller_details = useSellerPage.use.seller_details();
  const setSellerDetails = useSellerPage.use.setSellerDetails();

  const [showFilterCategory, setShowFilterCategory] = useState<boolean>(false);
  const [showFilterProduct, setShowFilterProduct] = useState<boolean>(false);
  const [showTab1, setShowTab1] = useState<boolean>(false);
  const [showTab2, setShowTab2] = useState<boolean>(false);

  const resetAllTab = () => {
    setShowTab1(false);
    setShowTab2(false);
    setShowFilterProduct(false);
    setShowFilterCategory(false);
  };

  const handleShowTabProduct = () => {
    setShowFilterProduct(true);
    setShowFilterCategory(false);
    setShowTab1(true);
    setShowTab2(false);
    const params = new URLSearchParams(searchParams);
    params.delete('sort_by');
    params.delete('sort_desc');
    params.delete('category_name');
    setSelectedCategory('');
    setActiveFilter('');
    router.replace(`${pathname}?${params.toString()}`);
    fetchSellerDetails(seller_details.shop_name, `${params.toString()}`);
  };

  const handleShowTabCategory = () => {
    setSelectedCategory('');
    setShowFilterProduct(false);
    setShowFilterCategory(true);
    setShowTab1(false);
    setShowTab2(true);
    setActiveFilter('');
  };

  const handleSeeAllBestSellerProduct = () => {
    setShowFilterProduct(true);
    setShowTab1(true);
  };

  const handleChangeCategory = (category: string, status: string) => {
    if (category === 'All') {
      setSelectedCategory('');
    }
    if (!showFilterCategory) {
      setShowFilterCategory(false);
    }

    const params = new URLSearchParams(searchParams);
    if (status === 'change') {
      params.delete('sort_by');
      params.delete('sort_desc');
      params.delete('category_name');
      setActiveFilter('');
      if (category === 'All') {
        params.delete('category_name');
      } else {
        params.set('category_name', category);
      }
      setSelectedCategory(category);
      params.set('page', currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
      fetchSellerDetails(seller_details.shop_name, `${params.toString()}`);
    } else {
      if (sort_by !== null) {
        setActiveFilter('Price');
        params.set('sort_by', 'price');
      }

      if (sort_desc !== null) {
        params.set('sort_desc', sort_desc);
      }
      if (activeFilter !== 'MostRecent') {
        setActiveFilter('MostRecent');
      }
      params.set('category_name', category);
      params.set('page', currentPage.toString());
      setSelectedCategory(category);
      router.replace(`${pathname}?${params.toString()}`);
      fetchSellerDetails(seller_details.shop_name, `${params.toString()}`);
    }
  };

  const handleSeeAllBestSeller = () => {
    //price: low to high
    const params = new URLSearchParams(searchParams);
    params.delete('sort');
    params.delete('sort_by');
    params.delete('category_name');
    params.set('page', '1');
    setSelectedCategory('');
    setActiveFilter('BestSeller');
    router.push(`${pathname}?${params.toString()}`);
    fetchSellerDetails(seller_details.shop_name, `${params.toString()}`);
  };

  const handeAllProduct = () => {
    if (!showTab1 && !showTab2) {
      setShowTab1(false);
      setShowTab2(false);
    }
    const params = new URLSearchParams(searchParams);
    params.delete('sort');
    params.delete('sort_by');
    params.delete('category_name');
    params.set('page', '1');
    setSelectedCategory('');
    setActiveFilter('MostRecent');
    router.replace(`${pathname}?${params.toString()}`);
    fetchSellerDetails(seller_details.shop_name, `${params.toString()}`);
  };

  const handleFilter = useCallback(async () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', currentPage.toString());

    if (sort_by !== null) {
      params.set('sort_by', sort_by);
    }

    if (sort_desc !== null) {
      params.set('sort_desc', sort_desc);
    }

    if (category_name !== null) {
      params.set('category_name', selectedCategory);
    }

    fetchSellerDetails(sellerPage.shop_name, `${params.toString()}`);
    handleScroll(tabsRef.current);
  }, [activeFilter, sort_by, sort_desc, selectedCategory, category_name]);

  const handleScroll = (ref: any) => {
    window.scrollTo({
      top: ref.offsetTop,
      left: 0,
      behavior: 'auto',
    });
  };

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  useEffect(() => {
    setSellerDetails(sellerPage);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>{`${sellerPage.shop_name} | LilOren`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content={'LilOren'} />
        <meta
          name="description"
          content={'LilOren is an e-commerce for everything you need'}
        />
        <meta name="og:title" content={`LilOren`} />
        <meta
          name="og:description"
          content={'LilOren is an e-commerce for everything you need'}
        />
        <meta name="og:type" content="website" />
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <section className="flex flex-col justify-center items-center w-full bg-white lg:px-0 pt-3">
        <div className="flex flex-row"></div>
        {/* Heading */}
        <div className="flex flex-col justify-center w-full md:w-[75vw]">
          <SellerPageHeading sellerPage={seller_details} />
        </div>
        {/* Mobile - Tab */}
        <ScrollArea className="flex md:hidden justify-start w-[100vw]">
          <div className="flex flex-row gap-2 justify-start w-full lg:py-6 md:w-[75vw] py-3 px-2 sticky top-0">
            <div
              className={`${
                !showTab1 && !showTab2 && 'border-b-2 border-primary'
              } border-0`}
            >
              <Button
                className="border-0"
                variant={'outline'}
                onClick={() => resetAllTab()}
              >
                {'Shop'}
              </Button>
            </div>
            <div
              className={`${showTab1 && 'border-b-2 border-primary'} border-0`}
            >
              <Button
                className="border-0"
                variant={'outline'}
                onClick={() => handleShowTabProduct()}
              >
                {'All Products'}
              </Button>
            </div>
            <div
              className={`${showTab2 && 'border-b-2 border-primary'} border-0`}
            >
              <Button
                className="border-0"
                variant={'outline'}
                onClick={() => handleShowTabCategory()}
              >
                {'By Category'}
              </Button>
            </div>
          </div>
          <div className={`${showTab2 ? 'block' : 'hidden'}`}>
            <Select
              onValueChange={(value) => handleChangeCategory(value, 'change')}
              defaultValue={selectedCategory}
            >
              <SelectTrigger id="category-dropdown" className="lg:text-lg">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="max-h-[15rem] lg:max-h-96">
                <SelectGroup>
                  <SelectLabel className="lg:text-lg">Categories</SelectLabel>
                  <SelectItem value={'All'} className="lg:text-lg">
                    {'All'}
                  </SelectItem>
                  {seller_details.categories.map((category, index) => (
                    <SelectItem
                      key={index}
                      value={category}
                      className="lg:text-lg"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* )} */}
          {/* </div> */}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Content Below Desktop*/}
        <ScrollArea className="hidden md:flex justify-start">
          <div className="flex flex-row gap-2 justify-start w-full lg:py-6 md:w-[75vw] py-3 px-2">
            <div className={`border-0 border-b-2 border-primary`}>
              <Button className="border-0" variant={'outline'}>
                {'Main Page'}
              </Button>
            </div>
            <div className={'border-0'}>
              <Button
                className="border-0"
                variant={'outline'}
                onClick={() => handeAllProduct()}
              >
                {'All Products'}
              </Button>
            </div>
            {seller_details.categories.slice(0, 4).map((category, index) => (
              <Button
                className={'border-0'}
                key={`key:category${index.toString()}`}
                variant={'outline'}
                onClick={() => handleChangeCategory(category, 'change')}
              >
                {category}
              </Button>
            ))}
            {seller_details.categories.length > 4 && (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={'More'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>{'Category'}</SelectLabel> */}
                    {seller_details.categories.slice(4).map((category) => (
                      <SelectItem key={`${category}`} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="w-full md:flex md:flex-col justify-center items-center bg-primary-foreground">
          {/* BEST SELLING PRODUCTS MOBILE*/}
          <div className={`${(showTab1 || showTab2) && 'hidden'}`}>
            <div
              className={`flex-row justify-between items-center w-full md:w-[75vw] my-3 flex`}
            >
              <p
                className={`md:hidden font-bold pl-3 lg:p-0 text-[12px] md:text-[14px] lg:text-[16px] lg:pl-2 ${
                  showTab1 || showTab2 ? 'hidden' : 'block'
                } `}
              >
                {'BEST SELLING PRODUCTS'}
              </p>

              {/* For Mobile */}
              <Button
                variant={'link'}
                onClick={() => handleSeeAllBestSellerProduct()}
                className={`font-bold md:hidden ${
                  showTab1 || showTab2 ? 'hidden' : 'block'
                } `}
              >
                {'See All >'}
              </Button>
            </div>

            <div
              className={`md:hidden w-full md:w-[75vw] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ${
                showTab1 || showTab2 ? 'hidden' : 'grid'
              } `}
            >
              {seller_details.best_seller.map((product, index) => (
                <SellerProductCard
                  key={`key:${product.product_name},${index.toString()}`}
                  shop_name={sellerPage.shop_name}
                  product={product}
                />
              ))}
            </div>
          </div>

          {/* BEST SELLING PRODUCTS DESKTOP */}
          <div className={`'hidden md:block'}`}>
            <div
              className={`flex-row justify-between items-center w-full md:w-[75vw] my-3 flex`}
            >
              <p
                className={`font-bold pl-3 lg:p-0 text-[12px] md:text-[14px] lg:text-[16px] lg:pl-2 hidden md:block`}
              >
                {'BEST SELLING PRODUCTS'}
              </p>
              {/* For Desktop */}
              <Button
                variant={'link'}
                onClick={() => handleSeeAllBestSeller()}
                className="font-bold hidden md:block"
              >
                {'See All >'}
              </Button>
            </div>
            <div
              className={`w-full md:w-[75vw] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 hidden md:grid`}
            >
              {seller_details.best_seller.map((product, index) => (
                <SellerProductCard
                  key={`key:${product.product_name},${index.toString()}`}
                  shop_name={sellerPage.shop_name}
                  product={product}
                />
              ))}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className={`md:hidden ${showTab1 ? 'block' : 'hidden'}`}>
            <SellerPageCategoryTabs
              shop_name={seller_details.shop_name}
              sort_desc={sort_desc as string}
              category_name={category_name as string}
              seller_pagination={seller_details.pagination}
              setCurrentPage={setCurrentPage}
              setActiveFilter={setActiveFilter}
              sort_by={sort_by as string}
              activeFilter={activeFilter}
              sortByPriceDesc={sortByPriceDesc}
              setSortByPriceDesc={setSortByPriceDesc}
            />
          </div>

          <div className="md:flex md:flex-row w-full md:w-[75vw] gap-3">
            <div className="category border-[1px] rounded-lg bg-white px-4 py-2 mb-5 hidden md:block">
              <div className="border-b-[1px] pb-3 pt-3 pr-5">
                <p className="font-bold text-[16px] leading-[21px] text-left">
                  {'Category'}
                </p>
              </div>
              <ul className="categories  leading-[21px] flex flex-col gap-3 mt-4 text-[14px]">
                <li
                  onKeyDown={() => handeAllProduct()}
                  onClick={() => handeAllProduct()}
                  className={`hover:text-primary hover:cursor-pointer text-[14px] ${
                    selectedCategory === 'All' || selectedCategory === ''
                      ? 'text-primary'
                      : 'font-light text-muted-foreground'
                  }`}
                >
                  {'All Products'}
                </li>
                {seller_details.categories.map((category) => (
                  <li
                    key={`key:${category}`}
                    onKeyDown={() => handleChangeCategory(category, 'filter')}
                    onClick={() => handleChangeCategory(category, 'filter')}
                    className={`hover:text-primary hover:cursor-pointer ${
                      selectedCategory === category
                        ? 'text-primary'
                        : 'font-light text-muted-foreground'
                    }`}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
            {/* Tabs and product */}
            <div className="hidden md:flex md:flex-col" ref={tabsRef}>
              <div className="sticky top-0 z-50 mb-4 lg:mb-0">
                <div className="flex flex-col">
                  <div
                    className="flex flex-col justify-center sticky lg:relative top-0 z-50  bg-white border-[1px] lg:mb-4 rounded-lg md:ml-1 md:mr-2 "
                    id="tabs"
                  >
                    <SellerPageCategoryTabs
                      shop_name={seller_details.shop_name}
                      sort_desc={sort_desc as string}
                      category_name={category_name as string}
                      seller_pagination={seller_details.pagination}
                      setCurrentPage={setCurrentPage}
                      setActiveFilter={setActiveFilter}
                      sort_by={sort_by as string}
                      activeFilter={activeFilter}
                      sortByPriceDesc={sortByPriceDesc}
                      setSortByPriceDesc={setSortByPriceDesc}
                    />
                  </div>
                </div>
              </div>
              {/* Desktop */}
              {loading_fetch_seller_details ? (
                <div className="w-full flex justify-center h-[350px]">
                  <DotsLoading />
                </div>
              ) : (
                <div
                  className={`w-[calc(100vw-35vw)] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:grid`}
                >
                  {seller_details.products.map((product, index) => (
                    <SellerProductCard
                      key={`key:${product.product_name},${index.toString()}`}
                      shop_name={sellerPage.shop_name}
                      product={product}
                    />
                  ))}
                </div>
              )}
              {/* Mobile */}
              <div className="w-full flex justify-center mb-4">
                <PaginationNav
                  currentPage={currentPage}
                  totalPage={seller_details.pagination.total_page}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
            {loading_fetch_seller_details ? (
              <div className="w-full flex justify-center h-[350px]">
                <DotsLoading />
              </div>
            ) : (
              <div
                className={`w-full md:hidden grid-cols-2 md:grid-cols-4 lg:grid-cols-5 pt-4 ${
                  showTab1 || showTab2 ? 'grid' : 'hidden'
                }`}
              >
                {seller_details.products.map((product, index) => (
                  <SellerProductCard
                    key={`key:${product.product_name},${index.toString()}`}
                    shop_name={sellerPage.shop_name}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SellerPage;

SellerPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let sellerPage = null;

  try {
    const response = await fetch(
      `${CONSTANTS.BASEURL}/shops/${params!.sellerId}`,
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    sellerPage = data.data;
  } catch (error) {
    console.error(error);
  }

  if (!sellerPage) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      sellerPage: sellerPage,
    },
  };
};
