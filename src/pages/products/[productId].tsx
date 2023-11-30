import React, { useEffect, useState, ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Star } from 'lucide-react';
import { Utils } from '@/utils';
import { withBasePath } from '@/lib/nextUtils';
import axiosInstance from '@/lib/axiosInstance';
import { useUser } from '@/store/user/useUser';
import CONSTANTS from '@/constants/constants';
import ImageCarousel from '@/components/ImageCarousel/ImageCarousel';
import ProductPageLayout from '@/components/ProductPageLayout/ProductPageLayout';
import { Separator } from '@/components/ui/separator';
import SellerProfileSnippet from '@/components/SellerProfileSnippet/SellerProfileSnippet';
import ProductDetailDesc from '@/components/ProductDetailDesc/ProductDetailDesc';
import {
  IAddToCart,
  IProductPage,
  IProductVariant,
  IVariantType,
} from '@/interface/productPage';
import Layout from '@/components/Layout/Layout';
import ReviewComponent from '@/components/ReviewComponent/ReviewComponent';
import TypeSelector from '@/components/TypeSelector/TypeSelector';
import { useHome } from '@/store/home/useHome';

interface ProductPageProps {
  productPage: IProductPage;
  highestDiscount: number;
  isGroup1Variant: boolean;
  isGroup2Variant: boolean;
  isVariant: boolean;
  productCode: string;
}

const ProductPage = ({
  productPage,
  highestDiscount,
  isGroup1Variant,
  isGroup2Variant,
  isVariant,
  productCode,
}: ProductPageProps) => {
  const user_details = useUser.use.user_details();
  const fetchCartInHome = useHome.use.fetchCartInHome();
  const fetchUserDetails = useUser.use.fetchUserDetails();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [group1, setGroup1] = useState<IVariantType>(
    productPage.variant_group1.variant_types[0],
  );
  const [group2, setGroup2] = useState<IVariantType>(
    productPage.variant_group2.variant_types[0],
  );
  const [initialAvailableGroup1, setInitialAvailableGroup1] =
    useState<Set<number>>();
  const [initialAvailableGroup2, setInitialAvailableGroup2] =
    useState<Set<number>>();
  const [availableGroup1, setAvailableGroup1] = useState<Set<number>>();
  const [availableGroup2, setAvailableGroup2] = useState<Set<number>>();
  const [variant, setVariant] = useState<IProductVariant | undefined>(
    undefined,
  );
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);

  function handleChooseGroup1(type: IVariantType) {
    if (group1.type_name !== 'default' && group1.type_id === type.type_id) {
      setGroup1(productPage.variant_group1.variant_types[0]);
      setAvailableGroup2(initialAvailableGroup2);
      searchVariant(productPage.variant_group1.variant_types[0], group2);
    } else {
      setGroup1(type);
      searchAvailable(1, type);
      searchVariant(type, group2);
    }
  }

  function handleChooseGroup2(type: IVariantType) {
    if (group2.type_name !== 'default' && group2.type_id === type.type_id) {
      setGroup2(productPage.variant_group2.variant_types[0]);
      setAvailableGroup1(initialAvailableGroup1);
      searchVariant(group1, productPage.variant_group2.variant_types[0]);
    } else {
      setGroup2(type);
      searchAvailable(2, type);
      searchVariant(group1, type);
    }
  }

  function searchAvailable(typeNumber: 1 | 2, type: IVariantType) {
    if (typeNumber === 1) {
      const newAvailable = new Set<number>();
      for (let i = 0; i < productPage.product_variant.length; i++) {
        if (productPage.product_variant[i].variant_type1_id === type.type_id) {
          newAvailable.add(productPage.product_variant[i].variant_type2_id);
        }
      }
      setAvailableGroup2(newAvailable);
    } else {
      const newAvailable = new Set<number>();
      for (let i = 0; i < productPage.product_variant.length; i++) {
        if (productPage.product_variant[i].variant_type2_id === type.type_id) {
          newAvailable.add(productPage.product_variant[i].variant_type1_id);
        }
      }
      setAvailableGroup1(newAvailable);
    }
  }

  function searchVariant(type1: IVariantType, type2: IVariantType) {
    if (
      (type1.type_name === 'default' && isGroup1Variant) ||
      (type2.type_name === 'default' && isGroup2Variant)
    ) {
      setVariant(undefined);
    } else {
      for (let i = 0; i < productPage.product_variant.length; i++) {
        if (
          productPage.product_variant[i].variant_type1_id === type1.type_id &&
          productPage.product_variant[i].variant_type2_id === type2.type_id
        ) {
          setVariant(productPage.product_variant[i]);
          return;
        }
      }
    }
  }

  function setInitialAvailable() {
    if (!isVariant) {
      setVariant(productPage.product_variant[0]);
      return;
    }
    const availableSet1 = new Set<number>();
    const availableSet2 = new Set<number>();
    for (let i = 0; i < productPage.product_variant.length; i++) {
      availableSet1.add(productPage.product_variant[i].variant_type1_id);
      availableSet2.add(productPage.product_variant[i].variant_type2_id);
    }
    setAvailableGroup1(availableSet1);
    setInitialAvailableGroup1(availableSet1);
    setAvailableGroup2(availableSet2);
    setInitialAvailableGroup2(availableSet2);
  }

  useEffect(() => {
    fetchUserDetails();
    setInitialAvailable();
  }, []);

  async function handleAddToCart() {
    if (user_details.username === '') {
      router.push({
        pathname: '/signin',
        query: { prev: `/products/${router.query.productId}` },
      });
      return;
    }
    if (variant === undefined && isVariant) {
      Utils.notify(
        'Please choose the options for the product',
        'default',
        'colored',
      );
      return;
    } else if (quantity === '' || quantity < 0) {
      Utils.notify(
        'Please enter the right amount of quantity',
        'default',
        'colored',
      );
      return;
    } else if (variant !== undefined && variant.stock < quantity) {
      Utils.notify(
        "Your quantity is more than the product's stock",
        'default',
        'colored',
      );
      return;
    }
    const payload: IAddToCart = {
      product_variant_id: -1,
      seller_id: productPage.shop.id,
      quantity: quantity,
    };
    if (!isVariant) {
      payload.product_variant_id = productPage.product_variant[0].id;
    } else if (variant && isVariant) {
      payload.product_variant_id = variant.id;
    }
    setIsAddLoading(true);
    try {
      await axiosInstance.post(`${CONSTANTS.BASEURL}/carts`, payload);
      fetchCartInHome();
      Utils.notify('Successfully added to cart', 'success', 'colored');
    } catch (error: any) {
      if (error === CONSTANTS.ALREADY_LOGGED_OUT) {
        Utils.notify(
          'Your token has expired, please sign in again',
          'default',
          'colored',
        );
        router.push('/signin');
        return;
      }
      if (
        error.message &&
        error.message === CONSTANTS.CANNOT_ADD_MORE_THAN_STOCK &&
        variant &&
        quantity <= variant.stock
      ) {
        Utils.notify(
          'You might already have the product in the cart, please check it.',
          'default',
          'colored',
        );
        return;
      }
      Utils.handleGeneralError(error);
    } finally {
      setIsAddLoading(false);
    }
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>{`${productPage.product.name} - LilOren`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content={productPage.product.name} />
        <meta name="description" content={productPage.product.description} />
        <meta
          name="og:title"
          content={`${productPage.product.name} - Teracce`}
        />
        <meta name="og:description" content={productPage.product.description} />
        <meta name="og:type" content="website" />
        <link rel="icon" href={withBasePath('favicon.ico')} />
      </Head>
      <section className="flex flex-col justify-center items-center w-full bg-white">
        <div className="w-full md:w-[75vw] pt-5 pb-5">
          <div className="w-full flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <ImageCarousel mediaArray={productPage.product_media} />
            </div>
            <div className="flex-1 px-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold sm:text-xl lg:text-3xl">
                  {`${
                    productPage.product.name +
                    (group1.type_name === 'default'
                      ? ''
                      : ` | ${group1.type_name}`) +
                    (group2.type_name === 'default'
                      ? ''
                      : ` | ${group2.type_name}`)
                  }`}
                </h1>
                <div className="w-full flex justify-start items-center gap-2">
                  <p className="text-base sm:text-lg lg:text-xl">
                    Sold:{' '}
                    <span className="font-light">{`(${productPage.total_sold})`}</span>
                  </p>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                  <div className="flex items-center">
                    <Star className="fill-yellow-300 text-yellow-300 aspect-square h-5 mb-[0.125rem] sm:h-6" />{' '}
                    <p className="text-base sm:text-lg lg:text-xl">
                      {productPage.rating}{' '}
                      <span className="font-light">{`(${
                        productPage.rating_count
                      } rating${
                        productPage.rating_count > 1 ? 's' : ''
                      })`}</span>
                    </p>
                  </div>
                </div>
                <div className="lg:mt-12">
                  {variant === undefined &&
                  productPage.low_price < productPage.high_price ? (
                    <p className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                      {`${Utils.convertPrice(
                        productPage.low_price,
                      )} - ${Utils.convertPrice(productPage.high_price)}`}
                    </p>
                  ) : variant === undefined &&
                    productPage.low_price === productPage.high_price ? (
                    <p className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                      {Utils.convertPrice(productPage.low_price)}
                    </p>
                  ) : (
                    <p className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                      {variant!.discount === 0
                        ? Utils.convertPrice(variant!.price)
                        : Utils.convertPrice(variant!.discounted_price)}
                    </p>
                  )}
                  {variant === undefined && highestDiscount !== 0 ? (
                    <div className="flex items-center gap-2 mt-1 text-base sm:text-lg lg:text-xl">
                      <p className="px-1.5 py-0.5 bg-destructive text-white font-semibold rounded-md">{`${highestDiscount}%`}</p>
                    </div>
                  ) : variant === undefined &&
                    highestDiscount === 0 ? null : variant !== undefined &&
                    variant.discount !== 0 ? (
                    <div className="flex items-center gap-2 mt-1 text-base sm:text-lg lg:text-xl">
                      <p className="px-1.5 py-0.5 bg-destructive text-white font-semibold rounded-md">{`${variant.discount}%`}</p>
                      <p className="text-gray-400 font-semibold line-through">
                        {Utils.convertPrice(variant.price)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              <Separator className="h-0.5 rounded-md" />
              <div>
                {productPage.variant_group1.variant_types.length > 1 &&
                  availableGroup1 !== undefined && (
                    <div className="mt-2">
                      <TypeSelector
                        variant_group={productPage.variant_group1}
                        chosenType={group1}
                        handleChooseGroup={handleChooseGroup1}
                        availableSet={availableGroup1}
                      />
                    </div>
                  )}
                {productPage.variant_group2.variant_types.length > 1 &&
                  availableGroup2 !== undefined && (
                    <div className="mt-2">
                      <TypeSelector
                        variant_group={productPage.variant_group2}
                        chosenType={group2}
                        handleChooseGroup={handleChooseGroup2}
                        availableSet={availableGroup2}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="px-2 w-full my-4">
            <Separator className="h-0.5 rounded-md" />
          </div>
          <SellerProfileSnippet seller={productPage.shop} />
          <div className="px-2 w-full my-4">
            <Separator className="h-0.5 rounded-md" />
          </div>
          <ProductDetailDesc desc={productPage.product.description} />
          <div className="px-2 w-full my-4">
            <Separator className="h-0.5 rounded-md" />
          </div>
          <ReviewComponent
            rating={productPage.rating}
            product_code={productCode}
            totalRating={productPage.rating_count}
          />
        </div>
      </section>
      <ProductPageLayout
        quantity={quantity}
        setQuantity={setQuantity}
        variant={variant}
        handleAddToCart={handleAddToCart}
        isVariant={isVariant}
        isAddLoading={isAddLoading}
        product_code={productCode}
        is_in_wishlist={productPage.is_in_wishlist}
        shop_name={productPage.shop.name}
      />
    </>
  );
};

export default ProductPage;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  let productPage: IProductPage | null = null;
  let highestDiscount: number = 0;
  let isGroup1Variant: boolean | null = null;
  let isGroup2Variant: boolean | null = null;
  let isVariant: boolean = false;
  const cookies = req.headers.cookie;

  try {
    let response;
    if (cookies !== undefined) {
      response = await fetch(
        `${CONSTANTS.BASEURL}/products/${params!.productId}`,
        { headers: { Cookie: cookies }, credentials: 'include' },
      );
    } else {
      response = await fetch(
        `${CONSTANTS.BASEURL}/products/${params!.productId}`,
        { credentials: 'include' },
      );
    }
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    productPage = data.data;
  } catch (error) {
    console.error(error);
  }

  if (productPage !== null) {
    for (let i = 0; i < productPage.product_variant.length; i++) {
      if (productPage.product_variant[i].discount > highestDiscount) {
        highestDiscount = productPage.product_variant[i].discount;
      }
    }
    if (productPage.variant_group1.variant_types.length > 1) {
      isGroup1Variant = true;
    } else {
      isGroup1Variant = false;
    }
    if (productPage.variant_group2.variant_types.length > 1) {
      isGroup2Variant = true;
    } else {
      isGroup2Variant = false;
    }
    if (productPage.product_variant.length > 1) {
      isVariant = true;
    }
  }

  if (!productPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      productPage: productPage,
      highestDiscount: highestDiscount,
      isGroup1Variant: isGroup1Variant,
      isGroup2Variant: isGroup2Variant,
      isVariant: isVariant,
      productCode: params!.productId as string,
    },
  };
};
