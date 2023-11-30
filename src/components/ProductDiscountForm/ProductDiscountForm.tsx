import React, { useEffect, useState } from 'react';
import { IProductDiscountResponse } from '@/interface/productDiscount';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import styles from './ProductDiscountForm.module.scss';
import AsyncButton from '../AsyncButton/AsyncButton';
import { IProductVariant } from '@/interface/addProduct';
import { Utils } from '@/utils';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/router';

interface ProductDiscountFormProps {
  productDiscount: IProductDiscountResponse | undefined;
  productCode: string;
}

const maxDiscount = 99;
const maxOptLength: number = 3;

const ProductDiscountForm = ({
  productDiscount,
  productCode,
}: ProductDiscountFormProps) => {
  const router = useRouter();
  const [isVariantActive, setIsVariantActive] = useState<boolean>(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [noVarDiscount, setNoVarDiscount] = useState<number | ''>(0);
  const [variants, setVariants] = useState<IProductVariant[]>([
    { variant_name: '', options: [undefined] },
  ]);
  const [discount, setDiscount] = useState<(number | '')[][]>(
    new Array(maxOptLength).fill(new Array(maxOptLength).fill(0)),
  );

  useEffect(() => {
    function setIniTialState() {
      if (productDiscount === undefined) return;
      if (
        productDiscount.variant_group.variant_group_1.name === 'default' &&
        productDiscount.variant_group.variant_group_2.name === 'default'
      ) {
        setIsVariantActive(false);
        setNoVarDiscount(productDiscount.variants[0].discount);
      } else if (
        productDiscount.variant_group.variant_group_1.name !== 'default' &&
        productDiscount.variant_group.variant_group_2.name === 'default'
      ) {
        setIsVariantActive(true);
        const newVariants: IProductVariant[] = [];
        const newVariant: IProductVariant = {
          variant_name: productDiscount.variant_group.variant_group_1.name,
          options: productDiscount.variant_group.variant_group_1.variant_types,
        };
        newVariants.push(newVariant);
        setVariants(newVariants);
        const newDiscount: number[][] = new Array(maxOptLength).fill(
          new Array(maxOptLength).fill(0),
        );
        productDiscount.variants.forEach((item, index) => {
          const smallDiscount = [...newDiscount[index]];
          smallDiscount[0] = item.discount;
          newDiscount[index] = smallDiscount;
        });
        setDiscount(newDiscount);
      } else {
        setIsVariantActive(true);
        const newVariants: IProductVariant[] = [];
        const variant1: IProductVariant = {
          variant_name: productDiscount.variant_group.variant_group_1.name,
          options: productDiscount.variant_group.variant_group_1.variant_types,
        };
        const variant2: IProductVariant = {
          variant_name: productDiscount.variant_group.variant_group_2.name,
          options: productDiscount.variant_group.variant_group_2.variant_types,
        };
        newVariants.push(variant1);
        newVariants.push(variant2);
        setVariants(newVariants);
        const newDiscount: number[][] = new Array(maxOptLength).fill(
          new Array(maxOptLength).fill(0),
        );
        let k = 0;
        for (let i = 0; i < variant1.options.length; i++) {
          for (let j = 0; j < variant2.options.length; j++) {
            const smallDiscount = [...newDiscount[i]];
            smallDiscount[j] = productDiscount.variants[j + k].discount;
            newDiscount[i] = smallDiscount;
          }
          k += variant1.options.length;
        }
        setDiscount(newDiscount);
      }
    }
    setIniTialState();
  }, [productDiscount]);

  function handleChangeNoVarDiscount(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = e.target;
    if (value === '') {
      setNoVarDiscount('');
      return;
    }
    const valNum = parseFloat(value);
    if (isNaN(valNum) || valNum < 0) {
      setNoVarDiscount(0);
    } else if (valNum > maxDiscount) {
      setNoVarDiscount(maxDiscount);
    } else {
      setNoVarDiscount(valNum);
    }
  }

  function setOnBlur() {
    if (noVarDiscount === '') {
      setNoVarDiscount(0);
    }
  }

  function handleChangeVarDiscount(
    e: React.ChangeEvent<HTMLInputElement>,
    index0: number,
    index1: number,
  ) {
    const { value } = e.target;
    if (value === '') {
      const newDiscount = [...discount];
      const newSmallDiscount = [...newDiscount[index0]];
      newSmallDiscount[index1] = value;
      newDiscount[index0] = newSmallDiscount;
      setDiscount(newDiscount);
      return;
    }
    const valNum = parseFloat(value);
    if (isNaN(valNum) || valNum < 0) {
      const newDiscount = [...discount];
      const newSmallDiscount = [...newDiscount[index0]];
      newSmallDiscount[index1] = 0;
      newDiscount[index0] = newSmallDiscount;
      setDiscount(newDiscount);
    } else {
      const newDiscount = [...discount];
      const newSmallDiscount = [...newDiscount[index0]];
      newSmallDiscount[index1] = valNum;
      newDiscount[index0] = newSmallDiscount;
      setDiscount(newDiscount);
    }
  }

  function setVarOnBlur(
    inputValue: number | '',
    index0: number,
    index1: number,
  ) {
    if (inputValue === '') {
      const newDiscount = [...discount];
      const newSmallDiscount = [...newDiscount[index0]];
      newSmallDiscount[index1] = 0;
      newDiscount[index0] = newSmallDiscount;
      setDiscount(newDiscount);
    }
  }

  function handleNumKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['e', 'E', '+', '-', ' '].includes(e.key)) {
      e.preventDefault();
    }
  }

  function createPayloadBody() {
    if (!isVariantActive) {
      const payload = {
        variant_type1: 'default',
        variant_type2: 'default',
        discount: noVarDiscount,
      };
      return { variants: [payload] };
    }

    if (variants.length === 1) {
      const variantsPayload: {
        variant_type1: string;
        variant_type2: string;
        discount: number;
      }[] = [];
      variants[0].options.forEach((item, index) => {
        if (typeof item === 'string') {
          const newVariant: {
            variant_type1: string;
            variant_type2: string;
            discount: number;
          } = {
            variant_type1: item,
            variant_type2: 'default',
            discount: discount[index][0] as number,
          };
          variantsPayload.push(newVariant);
        }
      });
      return { variants: variantsPayload };
    }

    if (variants.length === 2) {
      const variantsPayload: {
        variant_type1: string;
        variant_type2: string;
        discount: number;
      }[] = [];
      for (let i = 0; i < variants[0].options.length; i++) {
        for (let j = 0; j < variants[1].options.length; j++) {
          const newVariant: {
            variant_type1: string;
            variant_type2: string;
            discount: number;
          } = {
            variant_type1: variants[0].options[i]!,
            variant_type2: variants[1].options[j]!,
            discount: discount[i][j] as number,
          };
          variantsPayload.push(newVariant);
        }
      }
      return { variants: variantsPayload };
    }
  }

  async function postFormBody() {
    const reqBody = createPayloadBody();
    if (reqBody === undefined) return;
    setIsPostLoading(true);
    try {
      await axiosInstance.put(
        `/merchant/product/discount/${productCode}`,
        reqBody,
      );
      Utils.notify('Successfully edit product discount', 'success', 'colored');
      router.push('/seller/portal/product');
    } catch (error) {
      Utils.handleGeneralError(error);
    } finally {
      setIsPostLoading(false);
    }
  }

  if (productDiscount === undefined) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <p>Cannot load discount data</p>
      </div>
    );
  }

  if (!isVariantActive) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center gap-2 w-full">
          <Label
            className="min-w-fit w-40 text-right font-light text-xs lg:text-sm min-h-full flex items-center justify-center"
            htmlFor="non-variant-discount"
          >
            Discount
            <span className="text-primary">{'* '}</span>:
          </Label>
          <div className="w-4/12 flex flex-col gap-1">
            <p className="w-full text-black text-xs pl-2">{`in percentage (%)`}</p>
            <Input
              id="non-variant-discount"
              type="number"
              min={0}
              value={noVarDiscount}
              onChange={(e) => handleChangeNoVarDiscount(e)}
              className={`w-full ${styles.hideIndicator}`}
              onKeyDown={(e) => handleNumKeyDown(e)}
              onWheel={(e) => e.currentTarget.blur()}
              onBlur={setOnBlur}
            />
          </div>
        </div>
        <div className="flex items-center w-full justify-center">
          <AsyncButton isLoading={isPostLoading} onClick={postFormBody}>
            Enter Discount
          </AsyncButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex">
        {variants.length === 1 && (
          <>
            <p className="w-1/2 border-2 border-gray-100 text-base text-center py-2 font-light truncate">
              {variants[0].variant_name}
            </p>
            <p className="w-1/2 border-2 border-gray-100 text-base text-center py-2 font-light truncate">
              Discount
            </p>
          </>
        )}
        {variants.length === 2 && (
          <>
            <p className="w-1/3 border-2 border-gray-100 text-base text-center py-2 font-light truncate">
              {variants[0].variant_name}
            </p>
            <p className="w-1/3 border-2 border-gray-100 text-base text-center py-2 font-light truncate">
              {variants[1].variant_name}
            </p>
            <p className="w-1/3 border-2 border-gray-100 text-base text-center py-2 font-light truncate">
              Discount
            </p>
          </>
        )}
      </div>
      {variants.length > 1 ? (
        <div className="w-full">
          {variants[0].options.map((option, index0) => (
            <div key={index0} className="flex w-full min-h-fit">
              <p className="w-1/3 text-center min-h-full border-2 border-gray-100 flex justify-center items-center font-light truncate">
                {option}
              </p>
              <div className="flex flex-col w-2/3">
                {variants[1].options.map((option, index1) => (
                  <div key={index1} className="flex w-full min-h-fit">
                    <p className="w-1/2 text-center flex justify-center items-center min-h-full border-2 border-gray-100 font-light truncate">
                      {option}
                    </p>
                    <div className="w-1/2 p-2 border-2 border-gray-100 min-h-fit flex flex-col gap-1">
                      <p className="w-full text-black text-xs pl-2">{`in percentage (%)`}</p>
                      <Input
                        type="number"
                        value={discount[index0][index1]}
                        onChange={(e) =>
                          handleChangeVarDiscount(e, index0, index1)
                        }
                        onBlur={() =>
                          setVarOnBlur(discount[index0][index1], index0, index1)
                        }
                        className={`${styles.hideIndicator} h-12`}
                        onKeyDown={(e) => handleNumKeyDown(e)}
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full">
          {variants[0].options.map((option, index0) => (
            <div key={index0} className="flex w-full min-h-fit">
              <p className="w-1/2 text-center min-h-full border-2 border-gray-100 flex justify-center items-center font-light truncate">
                {option}
              </p>
              <div className="w-1/2 p-2 border-2 border-gray-100 min-h-fit flex flex-col gap-1">
                <p className="w-full text-black text-xs pl-2">{`in percentage (%)`}</p>
                <Input
                  type="number"
                  value={discount[index0][0]}
                  onChange={(e) => handleChangeVarDiscount(e, index0, 0)}
                  onBlur={() => setVarOnBlur(discount[index0][0], index0, 0)}
                  className={`${styles.hideIndicator} h-12`}
                  onKeyDown={(e) => handleNumKeyDown(e)}
                  min={0}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center w-full justify-center mt-8">
        <AsyncButton isLoading={isPostLoading} onClick={postFormBody}>
          Enter Discount
        </AsyncButton>
      </div>
    </div>
  );
};

export default ProductDiscountForm;
