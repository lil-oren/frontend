import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { NextPageWithLayout } from './_app';
import { IRecommendedProduct, ITopCategory } from '@/store/home/useHome';
import { HomeClient } from '@/service/home/HomeClient';
import { withBasePath } from '@/lib/nextUtils';
import HomeCategoryList from '@/components/HomeCategoryList/HomeCategoryList';
import Layout from '@/components/Layout/Layout';
import PromotionCarousel from '@/components/PromotionCarousel/PromotionCarousel';
import RecommendedProductCard from '@/components/RecommendedProductCard/RecommendedProductCard';

type Props = {
  products?: IRecommendedProduct[];
  categories?: ITopCategory[];
};

const Home: NextPageWithLayout<Props> = ({ products, categories }: Props) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>LilOren</title>
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
      <div className="flex flex-col justify-center items-center w-full bg-primary-foreground">
        <main className="w-full flex flex-col justify-center items-center">
          <PromotionCarousel
            imageArray={[
              'https://down-id.img.susercontent.com/file/id-50009109-af0948f69bef33259d862b058bc82b84',
              'https://down-id.img.susercontent.com/file/id-50009109-af0948f69bef33259d862b058bc82b84',
              'https://down-id.img.susercontent.com/file/id-50009109-af0948f69bef33259d862b058bc82b84',
            ]}
          />
          <section className="bg-white mt-3 lg:mt-5 w-full md:w-[75vw]">
            {categories && <HomeCategoryList categories={categories} />}
          </section>
          <section className="flex flex-col justify-center items-center w-full mt-3 mb-6 lg:mt-5 md:w-[75vw]">
            <div className="flex w-full">
              <div className="w-full md:w-[75vw] bg-white text-left text-primary py-3 pl-2 md:border-b-[5px] md:border-b-primary md:text-center md:text-[16px] md:bg-white md:mb-2 text-[14px] px-[10px]">
                RECOMMENDED
              </div>
            </div>
            <div className="HomeRecomProduct grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {products &&
                products.map((product, index) => (
                  <RecommendedProductCard
                    product={product}
                    key={`key:${product.name},${index.toString()}`}
                  />
                ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (_) => {
  const recommendeds = await HomeClient.getRecommendedProduct();
  const categories = await HomeClient.getCategories();

  return {
    props: {
      products: recommendeds?.data,
      categories: categories?.data,
    },
  };
};

export default Home;
